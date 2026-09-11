"use client";

import { useLayoutEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { approach, approachSteps } from "@/lib/content";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export function ApproachSteps() {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-approach-step]");

      steps.forEach((step) => {
        // The numeral wrapper and text both start pushed down past the
        // article's own overflow-hidden + bottom border, so they read as
        // rising up out from behind the border line rather than fading in.
        const numeral = step.querySelector<HTMLElement>(
          "[data-approach-numeral]",
        );
        const text = step.querySelector<HTMLElement>("[data-approach-text]");
        const targets = [numeral, text].filter(
          (el): el is HTMLElement => el !== null,
        );
        gsap.set(targets, { y: 56 });

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 85%", once: true },
        });
        if (numeral) {
          timeline.to(numeral, { y: 0, duration: 0.7, ease: "power3.out" });
        }
        if (text) {
          // Text rises half a second after the numeral, not together with it.
          timeline.to(
            text,
            { y: 0, duration: 0.7, ease: "power3.out" },
            "+=0.5",
          );
        }
      });
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="approach"
      className="bg-paper-dim py-20 text-ink lg:py-20"
      aria-labelledby="categories-heading"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[505px_1fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
              <span aria-hidden="true">→</span>
              {approach.eyebrow}
            </p>
            <h2
              id="categories-heading"
              className="mt-24 max-w-[505px] font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-[56px]"
            >
              Different situations.
              <br />
              One operational approach.
            </h2>
          </div>

          <div ref={listRef} className="flex flex-col">
            {approachSteps.map((step, index) => (
              <article
                key={step.number}
                data-approach-step
                className="relative overflow-hidden border-b border-hairline"
              >
                {/* Mobile: shrunk down to a quiet watermark sitting behind
                    the (now full-width) text instead of a large figure
                    pushing it over. Desktop keeps the original large
                    left-hand numeral, text indented to clear it. */}
                <div
                  data-approach-numeral
                  className="absolute right-0 bottom-0 lg:top-1/2 lg:-left-2 lg:top-11 lg:right-auto lg:translate-y-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- exported numeral artwork */}
                  <img
                    src={`/icons/numeral-${step.number}.svg`}
                    alt=""
                    aria-hidden="true"
                    className={`block h-auto lg:translate-x-2 ${index === 0 ? "w-20 lg:w-[122px] lg:translate-y-2" : "w-24 lg:w-40 lg:translate-y-3"}`}
                  />
                </div>
                <div
                  data-approach-text
                  className="relative z-10 flex w-full flex-col gap-1 py-8 lg:ml-50 lg:max-w-[546px] lg:py-0 lg:pt-[70px]"
                >
                  <h3 className="font-serif text-xl leading-none lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[15px] leading-[1.5] text-ink/80 mb-2">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
