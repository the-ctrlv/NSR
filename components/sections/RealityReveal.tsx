"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";
import { realityReveal } from "@/lib/content";

const { eyebrow, intro, lines, statement } = realityReveal;

function Heading({ tone }: { tone: "ink" | "alabaster" }) {
  return (
    <div
      className={`flex flex-col items-start gap-6 lg:flex-row lg:justify-between lg:gap-10 ${
        tone === "ink" ? "text-ink" : "text-alabaster"
      }`}
    >
      <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
        <span aria-hidden="true">→</span>
        {eyebrow}
      </p>
      <div className="max-w-[382px] space-y-3">
        <p className="font-serif text-xl leading-[1.3] lg:text-[22px]">
          {intro.heading.split("NO ONE").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span className="uppercase">NO ONE</span>}
            </span>
          ))}
        </p>
        <p className="font-sans text-[15px] leading-[1.4] opacity-80 lg:text-[16px]">{intro.body}</p>
      </div>
    </div>
  );
}

export function RealityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const after = afterRef.current;
    if (!section || !pin || !after || prefersReducedMotion()) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(after, {
          position: "absolute",
          inset: 0,
          clipPath: "circle(0vmax at 50% 42%)",
        });

        const radius = { value: 0 };
        gsap.to(radius, {
          value: 150,
          ease: "none",
          onUpdate: () => {
            after.style.clipPath = `circle(${radius.value}vmax at 50% 42%)`;
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            scrub: 0.4,
            pin,
            anticipatePin: 1,
          },
        });

        return () => {
          gsap.set(after, { clearProps: "position,inset,clipPath" });
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" aria-label="The Mallorca reality">
      <div ref={pinRef} className="relative isolate">
        {/* Before: light state — the fragmented reality */}
        <div className="flex min-h-screen flex-col justify-center gap-16 bg-paper px-6 py-24 sm:px-10 lg:px-[70px]">
          <Heading tone="ink" />
          <ul className="mx-auto flex w-full max-w-[863px] flex-col text-ink">
            {lines.map((line) => (
              <li
                key={line}
                className="border-b border-hairline py-6 text-center font-serif text-[28px] leading-[1.2] sm:text-[32px] lg:text-line"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* After: dark state — the resolved statement. Desktop-only per the mobile design, which
            never shows this screen; on desktop it's revealed via the scroll-driven circle wipe. */}
        <div
          ref={afterRef}
          className="hidden min-h-screen flex-col justify-center gap-16 bg-ink px-6 py-24 sm:px-10 lg:flex lg:px-[70px]"
        >
          <Heading tone="alabaster" />
          <p className="mx-auto max-w-[825px] text-center font-serif text-[32px] uppercase leading-[1.25] text-alabaster sm:text-[42px] lg:text-statement">
            {statement}
          </p>
        </div>
      </div>
    </section>
  );
}
