"use client";

import { useLayoutEffect, useRef } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { workingTogether } from "@/lib/content";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

const numerals: Record<string, string> = {
  "01": "/icons/numeral-01-big.svg",
  "02": "/icons/numeral-02-big.svg",
};

export function WorkingTogether() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      // One-time settle: the background is slightly over-zoomed as the
      // section scrolls into view, then eases down to its resting scale.
      gsap.fromTo(
        bg,
        { scale: 1.45 },
        {
          scale: 1.35,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        },
      );

      // Continuous parallax drift for as long as the section is in view —
      // the resting 1.35 scale keeps this wider range from ever showing an
      // edge.
      gsap.fromTo(
        bg,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-screen overflow-hidden bg-paper py-20 text-alabaster"
      aria-labelledby="working-heading"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-[url('/images/blurred-wt.jpg')] bg-cover bg-center bg-no-repeat"
      />
      <Container className="relative flex flex-col justify-between h-full">
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
            <span aria-hidden="true">→</span>
            {workingTogether.eyebrow}
          </p>
          <h2
            id="working-heading"
            className="max-w-[401px] font-sans text-base leading-[1.4] lg:text-right lg:text-[16px]"
          >
            {workingTogether.heading}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 border-y border-hairline/10 sm:grid-cols-2"
        >
          {workingTogether.models.map((model) => (
            <li
              key={model.index}
              className="relative flex flex-col justify-end items-start gap-6 overflow-hidden border-b border-hairline/10 px-4 py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:px-8 sm:last:border-r-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector numeral */}
              <div className="w-full flex justify-end">
                <img
                  src={numerals[model.index]}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none h-[200px] block select-none  sm:right-8 sm:top-8"
                />
              </div>
              <div className="relative max-w-[440px]">
                <h3 className="font-serif text-[32px] leading-[1.2] sm:text-4xl lg:text-[48px]">
                  {model.title}
                </h3>
                <p className="mt-5 font-sans text-[15px] font-medium leading-[1.4]">
                  {model.body}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
