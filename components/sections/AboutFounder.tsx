"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
// import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { founderReveal } from "@/lib/content";
import { setScrollSnapping } from "@/lib/scrollSnapGuard";

const { eyebrow, intro, name, stats, background, quote } = founderReveal;

type ChapterKey = "intro" | "name" | "stats" | "background" | "quote";
type StepKey =
  | "introEyebrow"
  | "introCopy"
  | "name"
  | "stats"
  | "backgroundEyebrow"
  | "backgroundParagraphs"
  | "quote";

// Discrete steps, not a scroll-scrubbed progress bar: each swipe/wheel tick
// advances exactly one step, and that step's reveal plays on its own fixed
// timing regardless of how far or fast the user scrolled — matching the
// Figma storyboard's frames (photo + label → name → statistics →
// background + quote) as content that "lands" one swipe at a time rather
// than scrubbing continuously with the scrollbar. Frame 1 is the portrait
// together with just the eyebrow label — nothing else yet. The intro copy
// and name only land on the next swipe, as their own group. The eyebrow
// itself then holds, unchanged, through the stats frame, before finally
// swapping to the background chapter's own eyebrow ("My background") on
// the last frame.
const STEPS: StepKey[][] = [
  ["introEyebrow"],
  ["introEyebrow", "introCopy", "name"],
  ["introEyebrow", "introCopy", "stats"],
  ["backgroundEyebrow", "backgroundParagraphs", "quote"],
];

/**
 * Real desktop (xl+, 1280px): pinned, step-based scroll sequence matching
 * the Figma storyboard (node 149:7978, "Property 1=0..4") — the section
 * stays exactly one viewport tall. The portrait is a large, fixed, centered
 * anchor and every other chapter (label, name, stats, background copy,
 * quote) is absolutely positioned against it; each scroll gesture steps the
 * content to the next frame, playing a fixed-duration fade/lift over the
 * photo (not scrubbed frame-by-frame with scroll distance). Gated at xl
 * (1280px), not the more common lg (1024px), specifically because a real
 * iPad in landscape commonly reports a viewport width at or above 1024px —
 * at lg this pinned sequence would hijack scroll on tablets, which should
 * get the plain layout below instead.
 * Mobile/tablet (node 412:9138, and everything up to xl) has its own
 * dedicated linear layout — the stage below is authored in that reading
 * order (intro, portrait, name, stats, background, quote) and just flows
 * normally; under reduced motion it also falls back to this plain stacked
 * order.
 */
export function AboutFounder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!section || !pin || !stage || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1280px)", () => {
        const portrait = stage.querySelector<HTMLElement>(
          '[data-chapter="portrait"]',
        );
        const els: Record<ChapterKey, HTMLElement | null> = {
          intro: stage.querySelector('[data-chapter="intro"]'),
          name: stage.querySelector('[data-chapter="name"]'),
          stats: stage.querySelector('[data-chapter="stats"]'),
          background: stage.querySelector('[data-chapter="background"]'),
          quote: stage.querySelector('[data-chapter="quote"]'),
        };

        // Sub-elements within intro/background so the small eyebrow label
        // can hold across frame 1→4 while its companion copy reveals on its
        // own beat, then crossfades to the background chapter's label/copy
        // in the same on-screen slot (frame 5→6).
        const introEyebrow =
          els.intro?.querySelector<HTMLElement>(":scope > p:first-child") ??
          null;
        const introCopy =
          els.intro?.querySelector<HTMLElement>(":scope > p:last-child") ??
          null;
        const backgroundEyebrow =
          els.background?.querySelector<HTMLElement>(":scope > p") ?? null;
        const backgroundParagraphs = els.background
          ? Array.from(
              els.background.querySelectorAll<HTMLElement>(":scope > div > p"),
            )
          : [];
        const statItems = els.stats
          ? Array.from(els.stats.querySelectorAll<HTMLElement>(":scope > div"))
          : [];

        // Every chapter (other than the eyebrow label, see below) flies in
        // from below the viewport itself, not a subtle few-pixel nudge —
        // the pin wrapper is overflow-hidden and exactly one viewport tall
        // (xl:h-screen), so starting each element offset by that same
        // measured height guarantees it begins fully clipped below the
        // visible frame and travels the whole distance up into place,
        // instead of just fading in from a few pixels away.
        const enterDistance = pin.offsetHeight;
        // The eyebrow label is small text, not a headline-sized block —
        // dragging it the full viewport height along with everything else
        // reads as far too heavy a move for something this light. It gets
        // its own small, quick nudge instead.
        const eyebrowOffset = 24;

        // Each key still gets its own entry in `targets` (and could still
        // carry a different offset per chapter if a future frame needs
        // one) — reused both for the gsap.set() below and for the exit
        // offset when a step retires it.
        const targets: Record<
          StepKey,
          { els: HTMLElement[]; offsetY: number }
        > = {
          introEyebrow: {
            els: introEyebrow ? [introEyebrow] : [],
            offsetY: eyebrowOffset,
          },
          introCopy: {
            els: introCopy ? [introCopy] : [],
            offsetY: enterDistance,
          },
          name: { els: els.name ? [els.name] : [], offsetY: enterDistance },
          stats: { els: statItems, offsetY: enterDistance },
          backgroundEyebrow: {
            els: backgroundEyebrow ? [backgroundEyebrow] : [],
            offsetY: eyebrowOffset,
          },
          backgroundParagraphs: {
            els: backgroundParagraphs,
            offsetY: enterDistance,
          },
          quote: { els: els.quote ? [els.quote] : [], offsetY: enterDistance },
        };
        const stepKeys = Object.keys(targets) as StepKey[];
        const revealTargets = stepKeys.flatMap((key) => targets[key].els);

        // Frame 1 / 0%: only the portrait + small label exist — everything
        // else starts hidden, softly offset and blurred so its eventual
        // reveal reads as a focus-pull rather than a hard cut.
        stepKeys.forEach((key) => {
          const { els: target, offsetY } = targets[key];
          if (!target.length) return;
          gsap.set(target, { opacity: 0, y: offsetY, filter: "blur(10px)" });
        });
        if (portrait) gsap.set(portrait, { opacity: 0.82, scale: 1.06 });

        // Step index the pin is currently showing — advanced/retreated by
        // ScrollTrigger below, one step per swipe rather than continuously.
        let currentStep = -1;
        // Which chapters were visible in the step we're coming FROM — lets
        // goToStep tell "just arrived" apart from "was already showing and
        // is just holding" (see the reset below).
        let previousVisible = new Set<StepKey>();

        // `forward` mirrors the scroll direction that triggered this step
        // change: true = scrolling down, false = scrolling up. Every
        // chapter's motion flips with it, like a conveyor belt running in
        // the same direction as the scroll — forward, content rises in from
        // below and retired content exits off the top; backward, content
        // falls in from above and retired content exits off the bottom.
        const goToStep = (index: number, forward: boolean) => {
          if (index === currentStep) return;
          currentStep = index;
          const visible = new Set(STEPS[index]);
          stepKeys.forEach((key) => {
            const { els: target, offsetY } = targets[key];
            if (!target.length) return;
            // The 3 stat columns (12+ / 20+ / 4) read as one statistic, not a
            // sequence — they must land and leave together, no cascade.
            // Same for the background paragraphs: two lines of one
            // continuous thought, so they land together too, not one after
            // the other. Both also get a touch more time than the rest —
            // slower still reads better without a stagger masking it.
            const isStats = key === "stats";
            const isBackgroundCopy = key === "backgroundParagraphs";
            const noStagger = isStats || isBackgroundCopy;
            if (visible.has(key)) {
              // A chapter that's newly entering (wasn't shown a moment ago)
              // must always fly in from the side matching the current
              // scroll direction — but if it had previously retired off the
              // opposite side (e.g. the direction reversed since), GSAP
              // would otherwise just tween it from wherever that retreat
              // left it. Snapping it back to the correct side first (no
              // animation) guarantees every entrance starts from the right
              // place. A chapter that's simply holding across consecutive
              // steps (already visible last step too) is left alone so it
              // doesn't jump.
              if (!previousVisible.has(key)) {
                gsap.set(target, { y: forward ? offsetY : -offsetY });
              }
              gsap.to(target, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: isBackgroundCopy ? 1.2 : 1,
                stagger: noStagger ? 0 : 0.08,
                ease: "power3.out",
                overwrite: true,
              });
            } else if (previousVisible.has(key)) {
              // Only actually retire a chapter that was visible a moment
              // ago — one that's never been shown yet (e.g. everything
              // during the photo-only first frame) is already sitting
              // hidden off-screen, so there's nothing to animate out.
              gsap.to(target, {
                opacity: 0,
                y: forward ? -offsetY * 0.6 : offsetY * 0.6,
                filter: "blur(10px)",
                duration: isBackgroundCopy ? 0.9 : 0.75,
                stagger: noStagger ? 0 : 0.05,
                ease: "power2.inOut",
                overwrite: true,
              });
            }
          });
          previousVisible = visible;
        };

        // The portrait settles in once, on entering the pin, then drifts in
        // a slow ambient zoom for the whole scene — deliberately NOT tied to
        // scroll position, so it never competes with or lags the stepped
        // content reveals happening over it.
        const settlePortrait = () => {
          if (!portrait) return;
          gsap.to(portrait, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            overwrite: true,
          });
        };

        const STEP_COUNT = STEPS.length;
        // How much scroll (in % of the section's own height) each step
        // transition takes — bigger means a longer scroll before content
        // changes, not a faster/slower animation.
        const PER_STEP_PERCENT = 160;
        // Extra pinned scroll held past the last step (background + quote)
        // before the section releases — a full step's worth, so there's a
        // real pause to keep scrolling through once that content has landed,
        // not just a brief beat before unpinning.
        const EXTRA_HOLD_PERCENT = 100;
        const totalPercent =
          (STEP_COUNT - 1) * PER_STEP_PERCENT + EXTRA_HOLD_PERCENT;
        const segment = 100 / totalPercent;

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${totalPercent}%`,
          pin,
          anticipatePin: 1,
          snap: {
            snapTo: [
              ...Array.from({ length: STEP_COUNT }, (_, i) => i * segment),
              1,
            ],
            duration: 0.45,
            ease: "power2.inOut",
            // This snap can correct the scroll position BACKWARD (if the
            // user let go closer to the previous step than the next one) —
            // a real, sizeable automatic scroll the user didn't initiate.
            // StickyHeader watches scroll direction globally, so without
            // this flag it would misread that correction as "user scrolled
            // up" and flash in. See lib/scrollSnapGuard.ts.
            onStart: () => setScrollSnapping(true),
            onComplete: () => setScrollSnapping(false),
            onInterrupt: () => setScrollSnapping(false),
          },
          onEnter: () => {
            settlePortrait();
            goToStep(0, true);
          },
          onEnterBack: () => {
            settlePortrait();
            goToStep(STEP_COUNT - 1, false);
          },
          onUpdate: (self) => {
            const targetIndex = Math.min(
              STEP_COUNT - 1,
              Math.max(0, Math.round(self.progress / segment)),
            );
            if (targetIndex === currentStep) return;
            // Jumps straight to targetIndex on every tick, however far that
            // is from currentStep — goToStep only animates the diff between
            // the two (whatever needs to enter/exit), it doesn't play the
            // steps in between, so this never shows more than one clean
            // transition no matter how far a single scroll gesture goes.
            // (A debounce was tried here, waiting for scroll to fully settle
            // before committing — but Lenis's easing plus the snap keep
            // onUpdate ticking almost continuously while scrolling normally,
            // so nothing ever "settled" until the whole gesture was over,
            // which just froze the reveal until the very end. Reacting
            // immediately, every tick, is what keeps it responsive.)
            goToStep(targetIndex, targetIndex > currentStep);
          },
        });

        return () => {
          trigger.kill();
          gsap.killTweensOf([
            ...revealTargets,
            ...(portrait ? [portrait] : []),
          ]);
          gsap.set(revealTargets, { clearProps: "opacity,y,filter" });
          if (portrait) gsap.set(portrait, { clearProps: "opacity,scale" });
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-alabaster"
      aria-label="The person behind NSR"
    >
      <div
        ref={pinRef}
        className="relative isolate overflow-hidden pt-20 pb-16 xl:h-screen xl:py-0"
      >
        {/* <GrainOverlay className="opacity-[0.12] mix-blend-overlay" /> */}

        {/* Not <Container>: its shared px-6 can't be reliably overridden by
            a second utility class of equal specificity (Tailwind's output
            order decides ties, not JSX order) — this section's own Figma
            mobile frame (412:9649) uses a 16px margin, not Container's 24px,
            so it gets its own copy of Container's shape with px-4 instead. */}
        <div className="relative z-10 mx-auto w-full max-w-[1470px] px-4 sm:px-10 xl:px-[50px] xl:h-full">
          {/* No shared `gap` — mobile/tablet spacing between chapters is
              uneven (40 / -37 / 40 / 80 / 39px per Figma), so each chapter
              carries its own mt-* below; xl:mt-0 clears it once the real
              desktop pin takes over with absolute positioning. */}
          <div ref={stageRef} className="flex flex-col xl:block xl:h-full">
            <div
              data-chapter="intro"
              className="flex flex-col justify-between gap-6 xl:absolute xl:inset-x-0 xl:top-0 xl:max-w-[1470px] xl:px-[50px] xl:py-20 xl:flex-row xl:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase leading-[1.4] tracking-wide">
                <span aria-hidden="true">→</span>
                {eyebrow}
              </p>
              {/* Not shown in the mobile/tablet design — only the eyebrow appears above the portrait there. */}
              <p className="hidden max-w-[382px] font-sans text-base leading-[1.4] text-alabaster/80 xl:block">
                {intro}
              </p>
            </div>

            {/* 313×392 fixed box + mx-auto on phones, a bit larger on
                tablet, matching the Figma mobile frame's spirit (it isn't
                width/aspect-ratio driven there, unlike the real desktop's
                height-driven sizing). */}
            <div
              data-chapter="portrait"
              className="relative mx-auto mt-20 h-[392px] w-[313px] overflow-hidden sm:h-[500px] sm:w-[400px] xl:mx-0 xl:mt-0 xl:h-[70%] xl:w-auto xl:absolute xl:left-1/2 xl:top-[13%] xl:aspect-[557/726] xl:max-w-[370px] xl:-translate-x-1/2"
            >
              <Image
                src="/images/portrait-founder.jpg"
                alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
                fill
                sizes="(min-width: 1280px) 420px, 60vw"
                className="object-cover object-center block"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-[53.313%] to-ink xl:from-[50%] xl:to-ink/80" />
            </div>

            {/* -37px pulls the name up into the portrait's own bottom fade,
                exactly like the Figma mobile frame — the fade is solid ink
                by that point, so it reads as a clean gap, not an overlap. */}
            <p
              data-chapter="name"
              className="mt-15 xl:mt-[18vh] mx-auto max-w-2xl text-center font-serif text-[48px] leading-[0.9] sm:text-6xl xl:mt-0 xl:absolute xl:inset-x-0 xl:top-[54%] xl:text-display"
            >
              {name}
            </p>

            <div
              data-chapter="stats"
              className="mt-20 mx-auto flex w-[388px] flex-col items-center divide-y divide-smoky/20 sm:w-[480px] xl:mt-0 xl:mx-0 xl:w-auto xl:flex-row xl:justify-between xl:divide-y-0 xl:absolute xl:bottom-20 xl:left-1/2 xl:-translate-x-1/2"
            >
              {stats.map((stat, index) => {
                const hasPlus = stat.value.endsWith("+");
                const digits = hasPlus
                  ? stat.value.slice(0, -1).trim()
                  : stat.value;
                return (
                  <div
                    key={stat.label}
                    className={`flex w-full flex-col items-center px-[10px] py-6 text-center xl:w-[372px] xl:gap-2 xl:px-8 xl:py-10
                    ${index === 1 ? "xl:!translate-y-10 xl:border-x xl:border-smoky/20" : ""}
                    ${index === 0 ? "xl:!-translate-y-5 border-t xl:border-t-0 xl:border-l xl:border-smoky/20" : ""}
                    ${index === 2 ? "xl:!-translate-y-5 border-smoky/20 border-b xl:border-b-0 xl:border-r xl:border-smoky/20" : ""}
                    `}
                  >
                    <p className="font-serif uppercase leading-none">
                      <span className="text-[70px] leading-none xl:text-9xl">
                        {digits}
                      </span>
                      {hasPlus && (
                        <span className="text-[40px] leading-none xl:text-8xl">
                          {" +"}
                        </span>
                      )}
                    </p>
                    <p className="font-serif text-xl xl:text-lg">
                      {stat.label}
                    </p>
                    {"detail" in stat && stat.detail && (
                      <p className="font-sans text-sm text-alabaster/80">
                        {stat.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              data-chapter="background"
              className="mt-20 flex flex-col justify-between gap-[17px] xl:mt-0 xl:gap-6 xl:absolute xl:inset-x-0 xl:top-0 xl:max-w-[1470px] xl:px-[50px] xl:py-20 xl:flex-row xl:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase leading-[1.4] tracking-wide">
                <span aria-hidden="true">→</span>
                {background.eyebrow}
              </p>
              <div className="flex max-w-[383px] flex-col gap-3 font-sans text-base font-medium leading-[1.4] text-alabaster/80 sm:max-w-[520px] sm:text-lg xl:max-w-[383px] xl:gap-4 xl:text-base xl:leading-[1.5]">
                {background.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <p
              data-chapter="quote"
              className="mt-[39px] indent-[3ch] font-serif text-2xl leading-[1.2] sm:text-4xl xl:mt-0 xl:indent-[calc(50vw-185px)] xl:max-w-[1470px] xl:px-[50px] xl:mx-auto xl:leading-[1.25] xl:absolute xl:inset-x-0 xl:bottom-[3%] xl:text-[56px]"
            >
              “{quote}”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
