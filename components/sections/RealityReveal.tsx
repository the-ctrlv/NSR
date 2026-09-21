"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
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
      className={`flex flex-col items-start gap-8 lg:flex-row lg:justify-between lg:gap-10 ${
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
          className={`absolute left-1/2 top-[-124px] z-10 aspect-square w-[204px] -translate-x-1/2 rounded-full lg:top-1/2 lg:w-[280px] lg:-translate-y-1/2 ${
            tone === "ink" ? "bg-paper-dim" : "bg-ink"
          }`}
        />
      )}
      <div ref={introRef} className="max-w-[382px] space-y-2">
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
  const statementRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const after = afterRef.current;
    if (!section || !pin || !after || prefersReducedMotion()) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: ball sits statically at its (formerly animated) smallest,
      // highest position — no shrink/rise animation anymore — then fades
      // out as the circle wipe (sourced from its position) grows to cover
      // the screen, a slow, held scroll-scrubbed sequence.
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
        gsap.set(statementRef.current, { opacity: 0, y: 48 });
        // Ball no longer shrinks/rises with scroll — it sits statically at
        // what used to be its fully-progressed end state (contentProgress
        // === 1), i.e. already at its smallest size and highest position.
        gsap.set(ballRef.current, {
          scale: 0.54,
          y: -window.innerHeight * 0.2,
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

        // Independent of the pin/wipe sequence below — previously this
        // text only faded in once scroll progress inside the pin reached
        // 18%, which meant the section had to already be fully pinned
        // (100% in view) before it appeared. Fires when the section is
        // about half scrolled into view, well before the pin ever
        // engages — "top 70%" fired too early (the section is barely
        // peeking in), so the fade played out before it was actually in
        // clear view and just read as already-appeared by the time it was
        // looked at. Not `once` — reverses on the way back out too, so
        // scrolling past it again (either direction) replays the same
        // fade instead of it just staying visible forever after the
        // first time.
        const linesRevealTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          onEnter: () => {
            gsap.to(lineTexts, {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          },
          onLeaveBack: () => {
            gsap.to(lineTexts, {
              opacity: 0,
              y: 28,
              duration: 0.3,
              ease: "power2.inOut",
              overwrite: true,
            });
          },
        });

        const radius = { value: 76 };
        let statementShown = false;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: 0.4,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setRevealOrigin,
          onUpdate: (self) => {
            const revealProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - 0.38) / 0.55,
            );
            const shouldShowStatement = revealProgress >= 0.08;
            if (shouldShowStatement !== statementShown) {
              statementShown = shouldShowStatement;
              gsap.to(statementRef.current, {
                opacity: shouldShowStatement ? 1 : 0,
                y: shouldShowStatement ? 0 : 48,
                duration: 0.55,
                delay: shouldShowStatement ? 0.5 : 0,
                ease: "power3.out",
                overwrite: true,
              });
            }
            // Scale/position no longer animate here — the ball stays put at
            // the static state set above; only its fade before the wipe
            // remains scroll-driven.
            gsap.set(ballRef.current, {
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
          linesRevealTrigger.kill();
          gsap.set(after, { clearProps: "position,inset,visibility,clipPath" });
          gsap.set([eyebrowRef.current, introRef.current, ballRef.current], {
            clearProps: "opacity,scale,y,transformOrigin",
          });
          gsap.set(lineTexts, { clearProps: "opacity,y" });
          gsap.set(statementRef.current, { clearProps: "opacity,y" });
        };
      });

      // Mobile: the ball never moves or resizes — it stays put (peeking from
      // the top) and the circle wipe grows outward from exactly that spot,
      // painting over it. Reveal is compressed into roughly one swipe's
      // worth of scroll instead of the desktop's long held scrub.
      mm.add("(max-width: 1023.98px)", () => {
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
        gsap.set(statementRef.current, { opacity: 0, y: 48 });

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

        // Same early, independent, reversible reveal as desktop — fires
        // when the section is about half scrolled into view, instead of
        // waiting for the pin to fully engage first, and reverses on the
        // way back out so it replays on re-entry.
        const linesRevealTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          onEnter: () => {
            gsap.to(lineTexts, {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: "power2.out",
              overwrite: true,
            });
          },
          onLeaveBack: () => {
            gsap.to(lineTexts, {
              opacity: 0,
              y: 28,
              duration: 0.2,
              ease: "power2.inOut",
              overwrite: true,
            });
          },
        });

        const radius = { value: 76 };
        let statementShown = false;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=65%",
          scrub: 0.25,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setRevealOrigin,
          onUpdate: (self) => {
            const revealProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - 0.16) / 0.55,
            );
            const shouldShowStatement = revealProgress >= 0.2;
            if (shouldShowStatement !== statementShown) {
              statementShown = shouldShowStatement;
              gsap.to(statementRef.current, {
                opacity: shouldShowStatement ? 1 : 0,
                y: shouldShowStatement ? 0 : 48,
                duration: 0.4,
                delay: shouldShowStatement ? 0.15 : 0,
                ease: "power3.out",
                overwrite: true,
              });
            }

            // The ball itself never moves or resizes on mobile — it just
            // fades out (opacity only) right as the wipe's leading edge
            // reaches it, since its z-index otherwise sits above the wipe.
            gsap.set(ballRef.current, { opacity: revealProgress > 0 ? 0 : 1 });

            after.style.visibility = revealProgress > 0 ? "visible" : "hidden";
            // The origin sits near the top edge here (not centered like on
            // desktop), so the circle has to reach much further to cover the
            // bottom corners — scale off innerHeight, not innerWidth.
            radius.value = 76 + revealProgress * window.innerHeight * 1.25;
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
          linesRevealTrigger.kill();
          gsap.set(after, { clearProps: "position,inset,visibility,clipPath" });
          gsap.set([eyebrowRef.current, introRef.current, ballRef.current], {
            clearProps: "opacity,y",
          });
          gsap.set(lineTexts, { clearProps: "opacity,y" });
          gsap.set(statementRef.current, { clearProps: "opacity,y" });
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
      <div ref={pinRef} className="relative isolate overflow-hidden">
        {/* Before: light state — the fragmented reality */}
        <div className="flex min-h-[100lvh] flex-col justify-between gap-16 bg-paper-dim px-4 pt-[70px] pb-20 sm:px-10 lg:px-[50px] lg:pt-20">
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

        {/* After: dark state — the resolved statement, revealed via the scroll-driven circle wipe
            on every breakpoint. Positioned absolute+invisible by default so it never adds to page
            flow before JS (or under prefers-reduced-motion) takes over. */}
        <div
          ref={afterRef}
          className="invisible absolute inset-0 isolate flex flex-col justify-between gap-16 bg-ink px-4 pt-[70px] pb-[70px] sm:px-10 lg:justify-between lg:gap-20 lg:px-[50px] lg:py-20"
        >
          <GrainOverlay className="-z-10 opacity-[0.22] mix-blend-overlay" />
          <Heading tone="alabaster" />
          {/* `justify-center` on the parent centers the whole flex group
              (Heading + statement + anything else) as one block — no
              per-item space distribution, no flex-1/absolute tricks to
              fight with content overflow or flex-shrink collapsing empty
              spacers. Whatever's in this column just stacks with a normal
              gap and the group centers together. */}
          <h2
            ref={statementRef}
            className="mx-auto max-w-[825px] text-center font-serif text-[40px] uppercase leading-[1.2] text-alabaster sm:text-[42px] lg:text-statement"
          >
            {statement}
          </h2>
          <div className="hidden lg:block h-[54px]"></div>
        </div>
      </div>
    </section>
  );
}
