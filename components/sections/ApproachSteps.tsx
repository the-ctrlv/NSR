"use client";

import { useLayoutEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { approach, approachSteps } from "@/lib/content";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";
import { TextFillReveal } from "../animations/TextFillReveal";

export function ApproachSteps() {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-approach-step]");

      steps.forEach((step, index) => {
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
          // A per-card delay so steps that cross the trigger threshold in
          // the same scroll gesture still land one at a time, in order,
          // instead of firing together.
          delay: index * 0.15,
          scrollTrigger: { trigger: step, start: "top 85%", once: true },
        });
        if (numeral) {
          // Both start at the timeline's own t=0 — numeral and text rise
          // together as one beat instead of the numeral landing first.
          timeline.to(numeral, { y: 0, duration: 0.5, ease: "power3.out" }, 0);
        }
        if (text) {
          timeline.to(text, { y: 0, duration: 0.6, ease: "power3.out" }, 0);
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
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-10 xl:grid-cols-[505px_1fr] xl:gap-20">
          <div>
            <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
              <span aria-hidden="true">→</span>
              {approach.eyebrow}
            </p>
            <TextFillReveal
              id="categories-heading"
              lines={["Different situations.", "One operational.", "approach"]}
              className="mt-24 max-w-[505px] font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-[56px]"
            />
          </div>

          <div ref={listRef} className="flex flex-col">
            {approachSteps.map((step, index) => (
              <article
                key={step.number}
                data-approach-step
                className="relative overflow-hidden border-b border-hairline"
              >
                {/* Mobile: large numeral watermark top-left (matching the
                    Figma mobile frame), text indented to clear it. Desktop
                    keeps the original large left-hand numeral in the same
                    spirit, text indented further to clear it. */}
                <div
                  data-approach-numeral
                  className="absolute left-0 top-6 lg:top-1/2 lg:-left-2 lg:top-11 lg:right-auto lg:translate-y-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- exported numeral artwork */}
                  <img
                    src={`/icons/numeral-${step.number}-mob.svg`}
                    alt=""
                    aria-hidden="true"
                    className={`block h-auto sm:w-32 lg:hidden ${index === 0 ? "w-20" : "w-24"}`}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- exported numeral artwork */}
                  <img
                    src={`/icons/numeral-${step.number}.svg`}
                    alt=""
                    aria-hidden="true"
                    className={`hidden h-auto lg:block lg:translate-x-2 ${index === 0 ? "lg:w-[122px] lg:translate-y-2" : "lg:w-40 lg:translate-y-3"}`}
                  />
                </div>
                <div
                  data-approach-text
                  className="relative z-10 flex w-full flex-col gap-1 pt-16 pb-8 pl-8 sm:pt-20 sm:pl-12 lg:ml-16 lg:max-w-[420px] lg:py-0 lg:pt-[70px] lg:pb-0 lg:pl-0 xl:ml-50 xl:max-w-[546px]"
                >
                  <h3 className="font-serif text-2xl leading-none sm:text-3xl lg:text-2xl">
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
