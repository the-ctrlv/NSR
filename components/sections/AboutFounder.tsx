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
 * Pinned, step-based scroll sequence matching the Figma storyboard (node
 * 149:7978, "Property 1=0..4"): the section stays exactly one viewport tall
 * and the portrait settles in once, then each scroll gesture steps the
 * content below it to the next frame — name → stats → background + quote.
 * On mobile and under reduced motion it degrades to a plain stacked,
 * fully static section.
 */
export function AboutFounder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const portrait = pin.querySelector<HTMLElement>(
          '[data-chapter="portrait"]',
        );
        const topSlot = pin.querySelector<HTMLElement>('[data-slot="top"]');
        const bottomSlot = pin.querySelector<HTMLElement>(
          '[data-slot="bottom"]',
        );

        const els: Record<ChapterKey, HTMLElement | null> = {
          intro: pin.querySelector('[data-chapter="intro"]'),
          name: pin.querySelector('[data-chapter="name"]'),
          stats: pin.querySelector('[data-chapter="stats"]'),
          background: pin.querySelector('[data-chapter="background"]'),
          quote: pin.querySelector('[data-chapter="quote"]'),
        };

        const slots = [topSlot, bottomSlot].filter((el): el is HTMLElement =>
          Boolean(el),
        );
        const chapters = Object.values(els).filter((el): el is HTMLElement =>
          Boolean(el),
        );

        gsap.set(pin, { height: "100vh", overflow: "hidden" });
        gsap.set(slots, { display: "grid" });
        gsap.set(chapters, { gridArea: "1 / 1", opacity: 0, y: 16 });
        // Anchor top/bottom slots to the container's edges instead of the
        // normal flex flow, so tall content overlaps the portrait rather
        // than pushing past the pinned 100vh section.
        if (topSlot) gsap.set(topSlot, { position: "absolute", top: 0, left: 0, right: 0 });
        if (bottomSlot) {
          gsap.set(bottomSlot, { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 });
        }
        if (portrait) {
          gsap.set(portrait, {
            position: "absolute",
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: 1.08,
          });
        }

        let step = 0;
        const showFrame = (index: number) => {
          const frame = FRAMES[index];
          const visible = new Set<ChapterKey>([frame.top, frame.bottom]);
          (Object.keys(els) as ChapterKey[]).forEach((key) => {
            const el = els[key];
            if (!el) return;
            if (visible.has(key)) {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
              });
            } else {
              gsap.to(el, {
                opacity: 0,
                y: -12,
                filter: "blur(16px)",
                duration: 0.45,
                ease: "power2.in",
              });
            }
          });
        };

        if (portrait)
          gsap.to(portrait, { opacity: 1, scale: 1, duration: 1, delay: 0.1 });
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
            const index = Math.min(
              FRAMES.length - 1,
              Math.round(self.progress / segment),
            );
            if (index !== step) {
              step = index;
              showFrame(step);
            }
          },
        });

        return () => {
          trigger.kill();
          gsap.set(pin, { clearProps: "height,overflow" });
          gsap.set(slots, { clearProps: "display,position,top,bottom,left,right,zIndex" });
          gsap.set(chapters, { clearProps: "gridArea,opacity,y,filter" });
          if (portrait) {
            gsap.set(portrait, {
              clearProps: "position,top,left,xPercent,yPercent,opacity,scale",
            });
          }
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
        className="relative isolate overflow-hidden py-24 lg:min-h-screen lg:py-32"
      >
        <GrainOverlay className="opacity-[0.12] mix-blend-overlay" />

        <Container className="relative z-10 flex flex-col gap-16 lg:h-full lg:justify-center lg:gap-12">
          <div data-slot="top" className="flex flex-col gap-16">
            <div
              data-chapter="intro"
              className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
                <span aria-hidden="true">→</span>
                {eyebrow}
              </p>
              <p className="max-w-[382px] font-sans text-base leading-[1.4] text-alabaster/80">
                {intro}
              </p>
            </div>

            <div
              data-chapter="background"
              className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start"
            >
              <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
                <span aria-hidden="true">→</span>
                {background.eyebrow}
              </p>
              <div className="flex max-w-[383px] flex-col gap-4 font-sans text-base leading-[1.5] text-alabaster/80">
                {background.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
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

          <div data-slot="bottom" className="flex flex-col gap-16">
            <p
              data-chapter="name"
              className="text-center font-serif text-4xl leading-[0.95] sm:text-6xl lg:text-display"
            >
              {name}
            </p>

            <div
              data-chapter="stats"
              className="grid grid-cols-1 divide-y divide-alabaster/15 border-y border-alabaster/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-2 px-8 py-10 text-center"
                >
                  <p className="font-serif text-7xl uppercase leading-none lg:text-8xl">
                    {stat.value}
                  </p>
                  <p className="font-serif text-lg">{stat.label}</p>
                  {"detail" in stat && stat.detail && (
                    <p className="font-sans text-sm text-alabaster/70">
                      {stat.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p
              data-chapter="quote"
              className="mx-auto max-w-[1000px] text-center font-serif text-3xl leading-[1.25] sm:text-4xl lg:text-[56px]"
            >
              “{quote}”
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
