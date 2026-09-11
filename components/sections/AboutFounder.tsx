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
// Figma storyboard's frames (rest label → name → statistics → background +
// quote) as content that "lands" one swipe at a time rather than scrubbing
// continuously with the scrollbar.
const STEPS: StepKey[][] = [
  ["introEyebrow"],
  ["introEyebrow", "introCopy", "name"],
  ["introEyebrow", "introCopy", "stats"],
  ["backgroundEyebrow", "backgroundParagraphs", "quote"],
];

/**
 * Desktop (lg+): pinned, step-based scroll sequence matching the Figma
 * storyboard (node 149:7978, "Property 1=0..4") — the section stays exactly
 * one viewport tall. The portrait is a large, fixed, centered anchor and
 * every other chapter (label, name, stats, background copy, quote) is
 * absolutely positioned against it; each scroll gesture steps the content
 * to the next frame, playing a fixed-duration fade/lift over the photo
 * (not scrubbed frame-by-frame with scroll distance).
 * Mobile/tablet (node 412:9138) has its own dedicated linear layout — the
 * stage below is authored in that reading order (intro, portrait, name,
 * stats, background, quote) and just flows normally; under reduced motion
 * it also falls back to this plain stacked order.
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

      mm.add("(min-width: 1024px)", () => {
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

        // Each key maps to its own initial "hidden" offset — how far/blurred
        // it starts before its step brings it in — reused both for the
        // gsap.set() below and for the exit offset when a step retires it.
        const targets: Record<
          StepKey,
          { els: HTMLElement[]; offsetY: number }
        > = {
          introEyebrow: { els: introEyebrow ? [introEyebrow] : [], offsetY: 8 },
          introCopy: { els: introCopy ? [introCopy] : [], offsetY: 14 },
          name: { els: els.name ? [els.name] : [], offsetY: 26 },
          stats: { els: statItems, offsetY: 20 },
          backgroundEyebrow: {
            els: backgroundEyebrow ? [backgroundEyebrow] : [],
            offsetY: 8,
          },
          backgroundParagraphs: { els: backgroundParagraphs, offsetY: 16 },
          quote: { els: els.quote ? [els.quote] : [], offsetY: 24 },
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

        const goToStep = (index: number) => {
          if (index === currentStep) return;
          currentStep = index;
          const visible = new Set(STEPS[index]);
          stepKeys.forEach((key) => {
            const { els: target, offsetY } = targets[key];
            if (!target.length) return;
            // The 3 stat columns (12+ / 20+ / 4) read as one statistic, not a
            // sequence — they must land and leave together, no cascade.
            const isStats = key === "stats";
            if (visible.has(key)) {
              gsap.to(target, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.55,
                stagger: isStats ? 0 : 0.04,
                ease: "power2.out",
                overwrite: true,
              });
            } else {
              gsap.to(target, {
                opacity: 0,
                y: -offsetY * 0.6,
                filter: "blur(10px)",
                duration: 0.4,
                stagger: isStats ? 0 : 0.02,
                ease: "power2.in",
                overwrite: true,
              });
            }
          });
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
          gsap.to(portrait, {
            scale: 1.05,
            duration: 14,
            ease: "sine.inOut",
            delay: 0.8,
            overwrite: "auto",
          });
        };

        const STEP_COUNT = STEPS.length;
        // A bit of extra pinned scroll held past the last step (background +
        // quote) before the section releases, so it doesn't unpin the
        // instant that content lands.
        const EXTRA_HOLD_PERCENT = 40;
        const totalPercent = (STEP_COUNT - 1) * 100 + EXTRA_HOLD_PERCENT;
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
          },
          onEnter: () => {
            settlePortrait();
            goToStep(0);
          },
          onEnterBack: () => {
            settlePortrait();
            goToStep(STEP_COUNT - 1);
          },
          onUpdate: (self) => {
            const index = Math.min(
              STEP_COUNT - 1,
              Math.max(0, Math.round(self.progress / segment)),
            );
            goToStep(index);
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
        className="relative isolate overflow-hidden pt-20 pb-16 lg:h-screen lg:py-0"
      >
        <GrainOverlay className="opacity-[0.12] mix-blend-overlay" />

        {/* Not <Container>: its shared px-6 can't be reliably overridden by
            a second utility class of equal specificity (Tailwind's output
            order decides ties, not JSX order) — this section's own Figma
            mobile frame (412:9649) uses a 16px margin, not Container's 24px,
            so it gets its own copy of Container's shape with px-4 instead. */}
        <div className="relative z-10 mx-auto w-full max-w-[1470px] px-4 sm:px-10 lg:px-[50px] lg:h-full">
          {/* No shared `gap` — mobile spacing between chapters is uneven
              (40 / -37 / 40 / 80 / 39px per Figma), so each chapter carries
              its own mt-* below; lg:mt-0 clears it once desktop takes over
              with absolute positioning. */}
          <div ref={stageRef} className="flex flex-col lg:block lg:h-full">
            <div
              data-chapter="intro"
              className="flex flex-col justify-between gap-6 lg:absolute lg:inset-x-0 lg:top-0 lg:max-w-[1470px] lg:px-[50px] lg:py-20 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase leading-[1.4] tracking-wide">
                <span aria-hidden="true">→</span>
                {eyebrow}
              </p>
              {/* Not shown in the mobile design — only the eyebrow appears above the portrait there. */}
              <p className="hidden max-w-[382px] font-sans text-base leading-[1.4] text-alabaster/80 lg:block">
                {intro}
              </p>
            </div>

            {/* 313×392 fixed box + mx-auto, matching the Figma mobile frame
                exactly (it isn't width/aspect-ratio driven there, unlike
                desktop's height-driven sizing). */}
            <div
              data-chapter="portrait"
              className="relative mx-auto mt-10 h-[392px] w-[313px] shrink-0 overflow-hidden bg-paper lg:mx-0 lg:mt-0 lg:absolute lg:left-1/2 lg:top-[9%] lg:h-[70%] lg:w-auto lg:aspect-[557/726] lg:max-w-[370px] lg:-translate-x-1/2"
            >
              <Image
                src="/images/portrait-founder.jpg"
                alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
                fill
                sizes="(min-width: 1024px) 420px, 60vw"
                className="object-cover object-[center_15%] block"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-[53.313%] to-ink lg:from-[50%] lg:to-ink/80" />
            </div>

            {/* -37px pulls the name up into the portrait's own bottom fade,
                exactly like the Figma mobile frame — the fade is solid ink
                by that point, so it reads as a clean gap, not an overlap. */}
            <p
              data-chapter="name"
              className="mt-15 lg:mt-[-57px] mx-auto max-w-2xl text-center font-serif text-[48px] leading-[0.9] sm:text-6xl lg:mt-0 lg:absolute lg:inset-x-0 lg:top-[54%] lg:text-display"
            >
              {name}
            </p>

            <div
              data-chapter="stats"
              className="mt-20 mx-auto flex w-[313px] flex-col items-center divide-y divide-smoky/20 lg:mt-0 lg:mx-0 lg:w-auto lg:flex-row lg:justify-between lg:divide-y-0 lg:absolute lg:bottom-20 lg:left-1/2 lg:-translate-x-1/2"
            >
              {stats.map((stat, index) => {
                const hasPlus = stat.value.endsWith("+");
                const digits = hasPlus
                  ? stat.value.slice(0, -1).trim()
                  : stat.value;
                return (
                  <div
                    key={stat.label}
                    className={`flex w-full flex-col items-center px-[10px] py-6 text-center lg:w-[374.5px] lg:gap-2 lg:px-8 lg:py-10
                    ${index === 1 ? "lg:!translate-y-10 lg:border-x lg:border-smoky/20" : ""}
                    ${index === 0 ? "lg:!translate-y-5 border-t lg:border-t-0 lg:border-l lg:border-smoky/20" : ""}
                    ${index === 2 ? "lg:!translate-y-5 border-smoky/20 border-b lg:border-b-0 lg:border-r lg:border-smoky/20" : ""}
                    `}
                  >
                    <p className="font-serif uppercase leading-none">
                      <span className="text-[70px] leading-none lg:text-8xl">
                        {digits}
                      </span>
                      {hasPlus && (
                        <span className="text-[40px] leading-none lg:text-8xl">
                          {" +"}
                        </span>
                      )}
                    </p>
                    <p className="font-serif text-xl lg:text-lg">
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
              className="mt-20 flex flex-col justify-between gap-[17px] lg:mt-0 lg:gap-6 lg:absolute lg:inset-x-0 lg:top-0 lg:max-w-[1470px] lg:px-[50px] lg:py-20 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase leading-[1.4] tracking-wide">
                <span aria-hidden="true">→</span>
                {background.eyebrow}
              </p>
              <div className="flex max-w-[383px] flex-col gap-3 font-sans text-base font-medium leading-[1.4] text-alabaster/80 lg:gap-4 lg:leading-[1.5]">
                {background.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <p
              data-chapter="quote"
              className="mt-[39px] indent-[3ch] font-serif text-2xl leading-[1.2] sm:text-4xl lg:mt-0 lg:indent-[calc(50vw-185px)] lg:max-w-[1470px] lg:px-[50px] lg:mx-auto lg:leading-[1.25] lg:absolute lg:inset-x-0 lg:bottom-[3%] lg:text-[56px]"
            >
              “{quote}”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
