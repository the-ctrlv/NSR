"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import { realityReveal } from "@/lib/content";

const { eyebrow, intro, lines, statement } = realityReveal;

function Heading({
  tone,
  ballRef,
  eyebrowRef,
  introRef,
}: {
  tone: "ink" | "alabaster";
  ballRef?: React.RefObject<HTMLDivElement | null>;
  eyebrowRef?: React.RefObject<HTMLParagraphElement | null>;
  introRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-6 lg:flex-row lg:justify-between lg:gap-10 ${
        tone === "ink" ? "text-ink" : "text-alabaster"
      }`}
    >
      <p
        ref={eyebrowRef}
        className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide"
      >
        <span aria-hidden="true">→</span>
        {eyebrow}
      </p>
      {ballRef && (
        <div
          ref={ballRef}
          className={`absolute left-1/2 top-1/2 z-10 aspect-square w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:w-[280px] ${
            tone === "ink" ? "bg-alabaster" : "bg-ink"
          }`}
        />
      )}
      <div ref={introRef} className="max-w-[382px] space-y-3">
        <p className="font-serif text-xl leading-[1.3] lg:text-[22px]">
          {intro.heading.split("NO ONE").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span className="uppercase">NO ONE</span>}
            </span>
          ))}
        </p>
        <p className="font-sans text-[15px] leading-[1.4] opacity-80 lg:text-[16px]">
          {intro.body}
        </p>
      </div>
    </div>
  );
}

export function RealityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLUListElement>(null);

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
          visibility: "hidden",
          clipPath: "circle(76px at 50% 50%)",
        });
        const lineTexts = linesRef.current
          ? Array.from(
              linesRef.current.querySelectorAll<HTMLElement>(
                "[data-reality-line]",
              ),
            )
          : [];
        gsap.set(lineTexts, { opacity: 0, y: 28 });
        gsap.set(ballRef.current, {
          scale: 1,
          y: 0,
          transformOrigin: "50% 50%",
        });

        const setRevealOrigin = () => {
          const ball = ballRef.current;
          const afterBounds = after.getBoundingClientRect();
          if (!ball) return;

          const ballBounds = ball.getBoundingClientRect();
          const originX =
            ballBounds.left + ballBounds.width / 2 - afterBounds.left;
          const originY =
            ballBounds.top + ballBounds.height / 2 - afterBounds.top;
          after.style.clipPath = `circle(76px at ${originX}px ${originY}px)`;
        };

        setRevealOrigin();

        const radius = { value: 76 };
        let contentShown = false;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=180%",
          scrub: 0.4,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setRevealOrigin,
          onUpdate: (self) => {
            const contentProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - 0.05) / 0.2,
            );
            const revealProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - 0.34) / 0.66,
            );
            const shouldShowContent = self.progress >= 0.25;
            if (shouldShowContent !== contentShown) {
              contentShown = shouldShowContent;
              gsap.to(lineTexts, {
                opacity: shouldShowContent ? 1 : 0,
                y: shouldShowContent ? 0 : 28,
                duration: 0.35,
                ease: "power2.out",
                overwrite: true,
              });
            }
            gsap.set(ballRef.current, {
              scale: 1 - contentProgress * 0.46,
              y: -contentProgress * window.innerHeight * 0.2,
              opacity: revealProgress > 0 ? 0 : 1,
            });

            after.style.visibility = revealProgress > 0 ? "visible" : "hidden";
            radius.value = 76 + revealProgress * window.innerWidth * 1.5;
            const ball = ballRef.current;
            const afterBounds = after.getBoundingClientRect();
            if (!ball) return;

            const ballBounds = ball.getBoundingClientRect();
            const originX =
              ballBounds.left + ballBounds.width / 2 - afterBounds.left;
            const originY =
              ballBounds.top + ballBounds.height / 2 - afterBounds.top;
            after.style.clipPath = `circle(${radius.value}px at ${originX}px ${originY}px)`;
          },
        });

        return () => {
          trigger.kill();
          gsap.set(after, { clearProps: "position,inset,visibility,clipPath" });
          gsap.set([eyebrowRef.current, introRef.current, ballRef.current], {
            clearProps: "opacity,scale,y,transformOrigin",
          });
          gsap.set(lineTexts, { clearProps: "opacity,y" });
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      aria-label="The Mallorca reality"
    >
      <div ref={pinRef} className="relative isolate">
        {/* Before: light state — the fragmented reality */}
        <div className="flex min-h-screen flex-col justify-between gap-16 bg-paper-dim px-6 py-20 sm:px-10 lg:px-[50px]">
          <Heading
            tone="ink"
            ballRef={ballRef}
            eyebrowRef={eyebrowRef}
            introRef={introRef}
          />
          <ul
            ref={linesRef}
            className="mx-auto flex w-full max-w-[863px] flex-col text-ink"
          >
            {lines.map((line) => (
              <li
                key={line}
                className="overflow-hidden border-b border-hairline py-6 text-center font-serif text-[28px] leading-[1.2] sm:text-[32px] lg:text-line"
              >
                <span className="block overflow-hidden" data-reality-line>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* After: dark state — the resolved statement. Desktop-only per the mobile design, which
            never shows this screen; on desktop it's revealed via the scroll-driven circle wipe. */}
        <div
          ref={afterRef}
          className="hidden min-h-screen flex-col gap-40 bg-ink px-6 py-20 sm:px-10 lg:flex lg:px-[50px]"
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
