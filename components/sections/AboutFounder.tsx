"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { founderReveal } from "@/lib/content";

const { eyebrow, intro, name, stats, background, quote } = founderReveal;

// Per-Figma-storyboard placement for the 3 stat columns once they're taken
// out of the grid and pinned directly against the portrait: 12+ sits to its
// left, 4/Languages to its right, and 20+ overlays the photo's own lower
// (gradient-darkened) band rather than sitting in a shared row.
const STAT_POSITION_CLASSES = [
  "lg:absolute lg:left-0 lg:top-1/2 lg:w-[240px] lg:-translate-y-1/2",
  "lg:absolute lg:inset-x-0 lg:top-[68%]",
  "lg:absolute lg:right-0 lg:top-1/2 lg:w-[240px] lg:-translate-y-1/2",
];

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
        const segment = 1 / (STEP_COUNT - 1);

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${(STEP_COUNT - 1) * 100}%`,
          pin,
          anticipatePin: 1,
          snap: {
            snapTo: Array.from({ length: STEP_COUNT }, (_, i) => i * segment),
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
        className="relative isolate overflow-hidden py-24 lg:h-screen lg:py-0"
      >
        {/* <GrainOverlay className="opacity-[0.12] mix-blend-overlay" /> */}

        <Container className="relative z-10 lg:h-full">
          <div
            ref={stageRef}
            className="flex flex-col gap-16 lg:block lg:h-full"
          >
            <div
              data-chapter="intro"
              className="flex flex-col justify-between gap-6 max-w-[1470px] px-6 sm:px-10 lg:px-[50px] py-20 lg:absolute lg:inset-x-0 lg:top-0 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
                <span aria-hidden="true">→</span>
                {eyebrow}
              </p>
              {/* Not shown in the mobile design — only the eyebrow appears above the portrait there. */}
              <p className="hidden max-w-[382px] font-sans text-base leading-[1.4] text-alabaster/80 lg:block">
                {intro}
              </p>
            </div>

            <div
              data-chapter="portrait"
              className="relative mx-auto aspect-[557/726] w-full max-w-[300px] shrink-0 overflow-hidden lg:absolute lg:left-1/2 lg:top-[9%] lg:h-[70%] lg:w-auto lg:max-w-[370px] lg:-translate-x-1/2"
            >
              <Image
                src="/images/portrait-founder.jpg"
                alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
                fill
                sizes="(min-width: 1024px) 420px, 60vw"
                className="object-cover object-[center_15%] block"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-[50%] to-ink/80" />
            </div>

            <p
              data-chapter="name"
              className="text-center font-serif text-[48px] leading-[0.95] sm:text-6xl lg:absolute lg:inset-x-0 lg:top-[54%] lg:text-display max-w-2xl mx-auto"
            >
              {name}
            </p>

            <div
              data-chapter="stats"
              className="flex justify-between absolute bottom-20 left-1/2 translate-x-[-50%]"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`w-[374.5px] flex flex-col items-center gap-2 px-8 py-10 text-center lg:p-0 ${index === 1 ? "border-x border-[#8693A0]/20" : ""}
                    ${index === 0 ? "border-l border-[#8693A0]/20" : ""}
                    ${index === 2 ? "border-r border-[#8693A0]/20" : ""}`}
                >
                  <p className="font-serif text-[70px] uppercase leading-none lg:text-8xl">
                    {stat.value}
                  </p>
                  <p className="font-serif text-xl lg:text-lg">{stat.label}</p>
                  {"detail" in stat && stat.detail && (
                    <p className="font-sans text-sm text-alabaster/70">
                      {stat.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div
              data-chapter="background"
              className="max-w-[1470px] px-6 sm:px-10 lg:px-[50px] py-20 flex flex-col justify-between gap-6 lg:absolute lg:inset-x-0 lg:top-0 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
                <span aria-hidden="true">→</span>
                {background.eyebrow}
              </p>
              <div className="flex max-w-[383px] flex-col gap-4 font-sans text-base font-medium leading-[1.5] text-alabaster/80">
                {background.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <p
              data-chapter="quote"
              className="max-w-[1470px] px-6 sm:px-10 lg:px-[50px] mx-auto indent-[calc(50vw-185px)] font-serif text-2xl leading-[1.25] sm:text-4xl lg:absolute lg:inset-x-0 lg:bottom-[3%] lg:text-[56px]"
            >
              “{quote}”
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
