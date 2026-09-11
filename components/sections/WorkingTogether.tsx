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
      className="relative isolate overflow-hidden bg-paper py-20 pb-10 text-alabaster lg:h-screen lg:py-20"
      aria-labelledby="working-heading"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-[url('/images/blurred-wt.jpg')] bg-cover bg-center bg-no-repeat"
      />
      <Container className="relative flex h-auto flex-col justify-between gap-6 lg:h-full lg:gap-0">
        <div className="flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-start lg:gap-6">
          <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
            <span aria-hidden="true">→</span>
            {workingTogether.eyebrow}
          </p>
          <h2
            id="working-heading"
            className="font-sans text-[15px] leading-[1.4] opacity-80 lg:max-w-[401px] lg:text-right lg:text-[16px] lg:opacity-100"
          >
            {workingTogether.heading}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 border-y border-alabaster/10 sm:grid-cols-2"
        >
          {workingTogether.models.map((model) => (
            <li
              key={model.index}
              className="relative flex flex-col justify-end items-start gap-2 overflow-hidden border-b border-alabaster/10 px-4 pt-4 pb-[30px] last:border-b-0 sm:gap-6 sm:border-b-0 sm:border-r sm:px-8 sm:py-7 sm:last:border-r-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector numeral */}
              <div className="w-full flex justify-end mb-[-20px] sm:mb-0">
                <img
                  src={numerals[model.index]}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none h-[113px] w-auto block select-none sm:h-[200px] sm:w-auto sm:right-8 sm:top-8"
                />
              </div>
              <div className="relative max-w-[440px]">
                <h3 className="font-serif text-[32px] leading-[1.2] sm:text-4xl lg:text-[48px]">
                  {model.title}
                </h3>
                <p className="mt-1 font-sans text-[15px] font-medium leading-[1.4] sm:mt-5">
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
