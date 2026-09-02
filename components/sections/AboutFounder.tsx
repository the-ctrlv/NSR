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
import { Container } from "@/components/ui/Container";
import { founderReveal } from "@/lib/content";

const { eyebrow, intro, name, stats, background, quote } = founderReveal;

type ChapterKey = "intro" | "name" | "stats" | "background" | "quote";

// Three discrete on-screen frames, matching the Figma storyboard's chapters —
// one scroll gesture steps from one frame to the next, it never scrubs smoothly.
const FRAMES: { top: ChapterKey; bottom: ChapterKey }[] = [
  { top: "intro", bottom: "name" },
  { top: "intro", bottom: "stats" },
  { top: "background", bottom: "quote" },
];

/**
 * Desktop (lg+): pinned, step-based scroll sequence matching the Figma
 * storyboard (node 149:7978, "Property 1=0..4") — the section stays exactly
 * one viewport tall, the portrait settles in once, and each scroll gesture
 * steps the content around it to the next frame (name → stats →
 * background + quote), via a JS grid-row stack applied only at lg+.
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
        const portrait = stage.querySelector<HTMLElement>('[data-chapter="portrait"]');
        const els: Record<ChapterKey, HTMLElement | null> = {
          intro: stage.querySelector('[data-chapter="intro"]'),
          name: stage.querySelector('[data-chapter="name"]'),
          stats: stage.querySelector('[data-chapter="stats"]'),
          background: stage.querySelector('[data-chapter="background"]'),
          quote: stage.querySelector('[data-chapter="quote"]'),
        };
        const chapters = Object.values(els).filter((el): el is HTMLElement => Boolean(el));
        const topGroup = [els.intro, els.background].filter((el): el is HTMLElement => Boolean(el));
        const bottomGroup = [els.name, els.stats, els.quote].filter((el): el is HTMLElement => Boolean(el));

        // Three stacked rows (top text / portrait / bottom text) instead of
        // relying on DOM order, so the mobile markup order above can stay
        // the natural reading order while desktop still overlaps each group.
        gsap.set(stage, { display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "auto auto auto" });
        gsap.set(topGroup, { gridColumn: 1, gridRow: 1, gridArea: "1 / 1" });
        if (portrait) gsap.set(portrait, { gridColumn: 1, gridRow: 2, gridArea: "2 / 1" });
        gsap.set(bottomGroup, { gridColumn: 1, gridRow: 3, gridArea: "3 / 1" });
        gsap.set(chapters, { opacity: 0, y: 16 });
        if (portrait) gsap.set(portrait, { opacity: 0, scale: 1.08 });

        let step = 0;
        const showFrame = (index: number) => {
          const frame = FRAMES[index];
          const visible = new Set<ChapterKey>([frame.top, frame.bottom]);
          (Object.keys(els) as ChapterKey[]).forEach((key) => {
            const el = els[key];
            if (!el) return;
            if (visible.has(key)) {
              gsap.to(el, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" });
            } else {
              gsap.to(el, { opacity: 0, y: -12, filter: "blur(16px)", duration: 0.45, ease: "power2.in" });
            }
          });
        };

        if (portrait) gsap.to(portrait, { opacity: 1, scale: 1, duration: 1, delay: 0.1 });
        showFrame(0);

        const snapPoints = FRAMES.map((_, i) => i / (FRAMES.length - 1));

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${FRAMES.length * 100}%`,
          pin,
          anticipatePin: 1,
          snap: { snapTo: snapPoints, duration: 0.4, ease: "power2.inOut" },
          onUpdate: (self) => {
            const segment = 1 / (FRAMES.length - 1);
            const index = Math.min(FRAMES.length - 1, Math.round(self.progress / segment));
            if (index !== step) {
              step = index;
              showFrame(step);
            }
          },
        });

        return () => {
          trigger.kill();
          gsap.set(pin, { clearProps: "height,overflow" });
          gsap.set(stage, { clearProps: "display,gridTemplateColumns,gridTemplateRows" });
          gsap.set(chapters, { clearProps: "gridColumn,gridRow,gridArea,opacity,y,filter" });
          if (portrait) gsap.set(portrait, { clearProps: "gridColumn,gridRow,gridArea,opacity,scale" });
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink text-alabaster" aria-label="The person behind NSR">
      <div ref={pinRef} className="relative isolate overflow-hidden py-24 lg:min-h-screen lg:py-32">
        <GrainOverlay className="opacity-[0.12] mix-blend-overlay" />

        <Container className="relative z-10">
          <div ref={stageRef} className="flex flex-col gap-16 lg:h-full lg:justify-center lg:gap-12">
            <div data-chapter="intro" className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
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
              className="relative mx-auto aspect-[371/484] w-full max-w-[300px] shrink-0 overflow-hidden sm:max-w-[371px]"
            >
              <Image
                src="/images/founder-portrait.jpg"
                alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
                fill
                sizes="(min-width: 1024px) 371px, 60vw"
                className="object-cover object-[center_15%] block"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-[43%] to-ink/70" />
            </div>

            <p
              data-chapter="name"
              className="text-center font-serif text-[48px] leading-[0.95] sm:text-6xl lg:text-display"
            >
              {name}
            </p>

            <div
              data-chapter="stats"
              className="grid grid-cols-1 divide-y divide-alabaster/15 border-y border-alabaster/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 px-8 py-10 text-center">
                  <p className="font-serif text-[70px] uppercase leading-none lg:text-8xl">{stat.value}</p>
                  <p className="font-serif text-xl lg:text-lg">{stat.label}</p>
                  {"detail" in stat && stat.detail && (
                    <p className="font-sans text-sm text-alabaster/70">{stat.detail}</p>
                  )}
                </div>
              ))}
            </div>

            <div data-chapter="background" className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
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
              className="mx-auto max-w-[1000px] text-center font-serif text-2xl leading-[1.25] sm:text-4xl lg:text-[56px]"
            >
              “{quote}”
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
