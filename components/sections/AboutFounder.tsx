"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { founderReveal } from "@/lib/content";
import { getLenisInstance } from "@/lib/lenisInstance";

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
// Figma storyboard's frames (photo + label + name → intro copy → statistics
// → breather → background + quote) as content that "lands" one swipe at a
// time rather than scrubbing continuously with the scrollbar. Frame 1 is
// the portrait together with the eyebrow label AND her name — both read as
// one identity beat with the photo, not a separate reveal. The intro copy
// lands on the next swipe, with the name still holding; the name then
// retires (along with the intro copy) once the stats swap in, clearing the
// slot for them. The intro eyebrow leaves together with the stats — same
// swipe, same beat, not lingering on its own — into a bare breather frame
// with no text at all (just portrait) before the background chapter's own
// eyebrow, its copy and the quote all land together on the final swipe, as
// one fixed block. That breather is deliberate: the stats leaving and the
// background copy arriving used to happen in the same swipe, which read as
// one crashing straight into the other.
const STEPS: StepKey[][] = [
  ["introEyebrow", "name"],
  ["introEyebrow", "introCopy", "name"],
  ["introEyebrow", "introCopy", "stats"],
  [],
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
        // The name lands in the very same beat as the portrait settling in
        // (frame 1) — a full-viewport-height fly-in reads as arriving well
        // after the photo instead of with it, so it gets a short nudge too,
        // just a bit more than the eyebrow's since it's larger text.
        const nameOffset = 148;
        // Shared by both the exit tween itself and the maxExitDuration
        // lookahead below, so they can never drift out of sync. Name
        // retires faster than the rest — it's a short, light element, no
        // need for it to linger as long as a full paragraph block does.
        // The background eyebrow, its paragraphs and the closing quote all
        // land on the same step and need to read as one fixed block
        // arriving together, not independently-timed pieces of content —
        // same duration and travel distance across all three, in and out.
        const isBackgroundBlock = (key: StepKey) =>
          key === "backgroundEyebrow" ||
          key === "backgroundParagraphs" ||
          key === "quote";
        const exitDuration = (key: StepKey) =>
          isBackgroundBlock(key) ? 1.05 : key === "name" ? 0.7 : 0.95;

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
          name: { els: els.name ? [els.name] : [], offsetY: nameOffset },
          stats: { els: statItems, offsetY: enterDistance },
          backgroundEyebrow: {
            els: backgroundEyebrow ? [backgroundEyebrow] : [],
            // Part of the background block (see isBackgroundBlock below),
            // not treated like the small quick-nudge intro eyebrow — it
            // travels with its paragraphs and the quote as one fixed
            // layout, not on its own light beat.
            offsetY: enterDistance,
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
        // if (portrait) gsap.set(portrait, { opacity: 0.82, scale: 1.06 });

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

          // Retiring chapters and newly-arriving ones used to start at the
          // exact same instant — while the outgoing text was still fading
          // and blurring away, the incoming one was already flying in on
          // top of it. Working out the slowest exit in THIS transition
          // first lets every entrance wait for it, so the slot is actually
          // clear before anything new lands in it.
          let maxExitDuration = 0;
          stepKeys.forEach((key) => {
            const { els: target } = targets[key];
            if (!target.length) return;
            if (!visible.has(key) && previousVisible.has(key)) {
              maxExitDuration = Math.max(maxExitDuration, exitDuration(key));
            }
          });

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
            const isName = key === "name";
            const noStagger = isStats || isBackgroundBlock(key);
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
              const isNewlyEntering = !previousVisible.has(key);
              if (isNewlyEntering) {
                // Stats coming back in on a reverse scroll (falling from
                // above) used the full enterDistance like everything
                // else — reads as much too far a drop from directly
                // overhead. Only trimmed for this one direction; the
                // normal forward entrance is untouched.
                const enterOffset =
                  isStats && !forward ? offsetY * 0.4 : offsetY;
                gsap.set(target, { y: forward ? enterOffset : -enterOffset });
              }
              gsap.to(target, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                // Name gets a quicker entrance than the rest — it needs to
                // finish arriving in step with the portrait's own ~1s
                // settle, not the slower beat that suits content flying up
                // the full viewport height.
                duration: isBackgroundBlock(key) ? 1.35 : isName ? 0.85 : 1.15,
                stagger: noStagger ? 0 : 0.08,
                ease: "power3.out",
                overwrite: true,
                // Only a genuinely new arrival waits for the slot to
                // clear — a chapter that's just holding across steps
                // never had anything to wait for. Slightly less than the
                // full exit duration: starting just before the outgoing
                // content has completely finished still reads as clean,
                // without the pause feeling as long.
                delay: isNewlyEntering ? maxExitDuration * 0.8 : 0,
              });
            } else if (previousVisible.has(key)) {
              // Only actually retire a chapter that was visible a moment
              // ago — one that's never been shown yet (e.g. everything
              // during the photo-only first frame) is already sitting
              // hidden off-screen, so there's nothing to animate out.
              // A much smaller fraction of the entrance offset than before
              // — retiring content only needs to read as "leaving", not
              // travel nearly as far as it arrived. The intro eyebrow
              // leaves in the same swipe as stats, so it travels the same
              // distance stats does here (not its own short entrance
              // nudge) — the two move as one, in parallel, on the way out.
              const exitTravel = key === "introEyebrow" ? enterDistance : offsetY;
              gsap.to(target, {
                opacity: 0,
                y: forward ? -exitTravel * 0.3 : exitTravel * 0.3,
                filter: "blur(10px)",
                duration: exitDuration(key),
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
          // gsap.to(portrait, {
          //   opacity: 1,
          //   scale: 1,
          //   duration: 1,
          //   ease: "power2.out",
          //   overwrite: true,
          // });
        };

        const STEP_COUNT = STEPS.length;
        // How much scroll (in % of the section's own height) each step
        // transition takes — bigger means a longer scroll before content
        // changes, not a faster/slower animation.
        const PER_STEP_PERCENT = 80;
        // Just the very first frame (name + eyebrow only, nothing else
        // competing for attention) reads as holding on screen far longer
        // than the rest — half the usual scroll gets it out of the way,
        // every other transition keeps the normal segment size.
        const FIRST_STEP_PERCENT = 40;
        // Extra pinned scroll held past the last step (background + quote)
        // before the section releases — a full step's worth now, so there's
        // at least one more real swipe of hold after the last text lands
        // before the section lets go, instead of releasing on the very
        // next scroll tick.
        const EXTRA_HOLD_PERCENT = 130;
        const totalPercent =
          FIRST_STEP_PERCENT +
          (STEP_COUNT - 2) * PER_STEP_PERCENT +
          EXTRA_HOLD_PERCENT;
        // Fraction of the pin's own scroll progress (0-1) that one step
        // occupies — `firstSegment` only gates leaving step 0 forward,
        // everything else (including coming back to step 0) uses the
        // normal `segment`.
        const segment = PER_STEP_PERCENT / totalPercent;
        const firstSegment = FIRST_STEP_PERCENT / totalPercent;

        // No `snap` — that was GSAP itself auto-correcting scroll position
        // to the nearest threshold, a real programmatic jump, and it read
        // as a jerk. Content is still fully threshold-driven; it just
        // doesn't get an automatic scroll-position assist.
        //
        // `baseProgress` rebases to the current progress on every commit,
        // so the next one always needs a full fresh segment of NEW scroll
        // — never jumps more than one step per commit. But a plain JS
        // debounce alone can only gate our OWN goToStep calls — it can't
        // stop the pin itself from releasing. A hard/fast enough scroll
        // (5 quick swipes) can physically carry real scroll position past
        // the pin's entire `end` distance before our onUpdate even gets a
        // chance to pace anything, and GSAP releases the pin the instant
        // scroll crosses `end`, regardless of how our step logic wanted to
        // gate it — that's a hard physical limit, not a logic bug, and no
        // amount of JS-side debouncing fixes it. Real scroll has to
        // actually be held back during each step's guaranteed dwell time.
        //
        // lenis.scrollTo(..., { lock: true }) holds scroll at (essentially)
        // its current position for that dwell time — smoother than
        // lenis.stop() (which hard-resets velocity to zero instantly and
        // read as a jerk): momentum already in flight eases out on its own
        // curve instead of being cut off. Deferred a frame via
        // requestAnimationFrame because calling it straight from onUpdate
        // means calling back into Lenis from inside Lenis's OWN "scroll"
        // event handler (SmoothScroll.tsx's lenis.on("scroll", ...) is
        // what drives ScrollTrigger's onUpdate in the first place) — that
        // re-entrant call is the likely source of the jerk seen earlier;
        // letting the current Lenis cycle finish first avoids it.
        // Which step a given pin progress corresponds to — used wherever the
        // page lands somewhere without scrolling through the steps in
        // order (nav-link jumps, re-entering from either end).
        const stepAt = (progress: number) =>
          progress < firstSegment
            ? 0
            : Math.min(
                STEP_COUNT - 1,
                1 + Math.floor((progress - firstSegment) / segment),
              );
        let baseProgress = 0;
        let lastProgress = 0;
        let debounceUntil = 0;
        // How long each step is guaranteed to stay up before the next one
        // can commit — padded well past the entrance animation's own
        // duration (~1.15s for most chapters), so there's real dwell time
        // once content has actually landed, not just during it.
        const MIN_STEP_VISIBLE_MS = 300;

        const holdScroll = () => {
          requestAnimationFrame(() => {
            const lenis = getLenisInstance();
            if (!lenis) return;
            // +0.5 rather than the exact current value — scrollTo() skips
            // the lock entirely when the target already equals its own
            // in-flight target, so this needs to read as a real, if
            // imperceptible, move.
            lenis.scrollTo(lenis.animatedScroll + 0.5, {
              lock: true,
              duration: MIN_STEP_VISIBLE_MS / 1000,
              easing: (t: number) => t,
            });
          });
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${totalPercent}%`,
          pin,
          anticipatePin: 1,
          // No holdScroll() here — the section hasn't necessarily finished
          // scrolling all the way into its pinned "top top" position yet
          // at this exact instant, and locking scroll right now freezes
          // it wherever it happens to be mid-transition (what read as the
          // section not fully scrolling into view). There's also nothing
          // to protect against on the very first reveal — no previous
          // step for scroll to accidentally skip past. Locking only
          // matters once there's an actual step-to-step transition to
          // pace, which onUpdate below already covers.
          onEnter: (self) => {
            settlePortrait();
            baseProgress = self.progress;
            lastProgress = self.progress;
            // Plain JS debounce only, no holdScroll()/Lenis here — a
            // short grace period so the very first frame (name + eyebrow)
            // is guaranteed on screen a moment before any scroll can
            // advance past it, without touching real scroll at all (that
            // was what caused the section to freeze before fully
            // scrolling into place, when this used the Lenis lock too).
            debounceUntil = Date.now() + 200;
            goToStep(stepAt(self.progress), true);
          },
          onEnterBack: (self) => {
            settlePortrait();
            baseProgress = self.progress;
            lastProgress = self.progress;
            debounceUntil = Date.now() + 200;
            // Normally re-entering from below lands at the very end (last
            // step) — but a nav jump to #about lands at the START of the
            // pin, and must show the first step (the person), not
            // whatever step the visitor last saw here.
            goToStep(stepAt(self.progress), false);
          },
          // A jump straight to the pin's very start (progress exactly 0)
          // is reported as leaving the trigger backward, not as an
          // enter-back — without this the section would keep showing
          // whichever step was last on screen.
          onLeaveBack: () => {
            lastProgress = 0;
            baseProgress = 0;
            goToStep(0, false);
          },
          onUpdate: (self) => {
            // Per-update movement, tracked even during the debounce below —
            // a genuine wheel/touch scroll moves a sliver per frame, so a
            // big single-update move can only be a programmatic jump.
            const frameMove = self.progress - lastProgress;
            lastProgress = self.progress;
            const isJump = Math.abs(frameMove) > segment * 0.75;
            if (!isJump && Date.now() < debounceUntil) return;
            const delta = self.progress - baseProgress;
            // A nav-link jump (instant scroll) lands many steps away in a
            // single update. Treating that as one ordinary step commit
            // would fire holdScroll(), freezing scroll for a full second
            // at wherever the jump landed (or just past the pin) — the
            // "can't scroll after navigating" freeze. Snap straight to the
            // step matching the landing position instead, with no lock.
            if (isJump) {
              baseProgress = self.progress;
              debounceUntil = Date.now() + 200;
              const landed = stepAt(self.progress);
              goToStep(landed, delta > 0);
              return;
            }
            const forwardSegment = currentStep === 0 ? firstSegment : segment;
            if (delta >= forwardSegment && currentStep < STEP_COUNT - 1) {
              baseProgress = self.progress;
              debounceUntil = Date.now() + MIN_STEP_VISIBLE_MS;
              goToStep(currentStep + 1, true);
              holdScroll();
            } else if (delta <= -segment && currentStep > 0) {
              baseProgress = self.progress;
              debounceUntil = Date.now() + MIN_STEP_VISIBLE_MS;
              goToStep(currentStep - 1, false);
              holdScroll();
            }
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
      id="about"
      ref={sectionRef}
      className="relative bg-ink text-alabaster"
      aria-label="The person behind NSR"
    >
      <div
        ref={pinRef}
        className="relative isolate overflow-hidden bg-ink pt-20 pb-16 xl:h-screen xl:py-0"
      >
        <GrainOverlay className="opacity-[0.22] mix-blend-overlay" />

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
            <h2
              data-chapter="name"
              className="mt-15 xl:mt-[18vh] mx-auto max-w-2xl text-center font-serif text-[48px] leading-[0.9] sm:text-6xl xl:mt-0 xl:absolute xl:inset-x-0 xl:top-[54%] xl:text-display"
            >
              {name}
            </h2>

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
                      <span
                        className={`text-[70px] leading-none xl:text-9xl ${index === 2 ? "-translate-x-2 md:translate-x-0 block" : ""}`}
                      >
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
