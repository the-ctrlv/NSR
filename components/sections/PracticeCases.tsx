"use client";

import { useLayoutEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
// import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { practiceCases } from "@/lib/content";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export function PracticeCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!section || !stack || prefersReducedMotion()) return;

    const cards = Array.from(stack.children) as HTMLElement[];
    if (cards.length < 2) return;

    registerGsap();
    const ctx = gsap.context(() => {
      // Rebuilt per breakpoint via matchMedia (not a one-time
      // window.matchMedia().matches snapshot) so a real width change —
      // rotating the phone, resizing the window — tears down and rebuilds
      // the whole pinned sequence with the right stack height for that
      // size, instead of leaving a stale ScrollTrigger whose measurements
      // (frozen at mount) drift out of sync with what invalidateOnRefresh
      // recalculates. That drift is what read as the section jumping /
      // flashing white mid-scroll on mobile.
      const mm = gsap.matchMedia();

      const build = (stackHeight: number) => {
        // Per original card: tilt applied once it's no longer the active
        // (front) card — card 1 tilts one way, card 2 the other, card 3
        // never recedes so its own entry here is unused.
        const rotations = [1.5, -1.5, 0];
        // A full viewport height below (not just the stack's own, often
        // shorter, height) — otherwise the incoming card starts close
        // enough to its resting spot that flipping it to visible reads as
        // "just appears" rather than genuinely sliding up from off-screen.
        const enterFromY = Math.max(stackHeight, window.innerHeight);

        gsap.set(stack, {
          position: "relative",
          minHeight: stackHeight,
        });
        gsap.set(cards, {
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          willChange: "transform",
        });

        const setStackState = (card: HTMLElement, index: number) => {
          gsap.set(card, {
            zIndex: cards.length - index,
            // Cards not yet "arrived" are hidden outright (not just faded —
            // visibility, so it's an instant on/off switch, no fade) and
            // parked below their spot, so nothing peeks out early and the
            // already-arrived cards' rotated corners are never clipped by
            // an overflow-hidden container.
            visibility: index === 0 ? "visible" : "hidden",
            y: index === 0 ? 0 : enterFromY,
            // The front card (index 0) always lands flat; only cards
            // waiting behind it show their tilt. Once a card has arrived it
            // never moves again — only rotation and stacking order change.
            rotation: index === 0 ? 0 : rotations[index % rotations.length],
          });
        };

        cards.forEach((card, index) => setStackState(card, index));

        // Extra pause held after the last card lands, before the section
        // releases — expressed in the same "1 transition = 1 unit" scale
        // as the card-swap steps below, so it stretches the scroll range
        // without slowing the swaps themselves.
        const HOLD = 0.5;
        const timelineUnits = cards.length - 1 + HOLD;

        const timeline = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${timelineUnits * 110}%`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let frontIndex = 1; frontIndex < cards.length; frontIndex += 1) {
          const position = frontIndex - 1;

          timeline
            .set(
              cards[frontIndex],
              {
                zIndex: cards.length + frontIndex,
                visibility: "visible",
              },
              position,
            )
            .to(
              cards[frontIndex],
              {
                y: 0,
                rotation: 0,
              },
              position,
            );

          cards.slice(0, frontIndex).forEach((card, depth) => {
            // Earlier cards sit deeper in the stack; the immediately
            // previous front card must remain above all older cards.
            const stackDepth = frontIndex - depth;
            timeline.to(
              card,
              {
                zIndex: cards.length - stackDepth,
                rotation: rotations[depth % rotations.length],
              },
              position,
            );
          });
        }

        timeline.to({}, { duration: HOLD });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set(stack, { clearProps: "position,minHeight" });
          gsap.set(cards, {
            clearProps:
              "position,inset,transformOrigin,willChange,visibility,y,rotation,zIndex",
          });
        };
      };

      mm.add("(max-width: 639px)", () => build(680));
      mm.add("(min-width: 640px)", () => build(540));
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hide-floating-cta
      className="relative h-screen overflow-hidden bg-paper"
      aria-label="NSR in practice"
    >
      {/* Pinned to the top edge, independent of the card stack's own
          vertical centering below — was previously part of the same
          centered flex column, which dragged it down with the stack
          instead of anchoring it to the top of the section. */}
      <Container className="h-screen py-10 lg:py-20 pb-5 sm:pb-10 xl:pb-20 flex flex-col">
        {/* No standalone title in this design (just the eyebrow label above
            the card stack) — a visually-hidden h2 still gives the section a
            real heading for screen readers and search engines. */}
        <h2 className="sr-only">{practiceCases.eyebrow}</h2>
        <Eyebrow className="mb-2 lg:mb-8">{practiceCases.eyebrow}</Eyebrow>
        <div className="flex flex-grow items-center justify-center">
          <ul
            ref={stackRef}
            className="relative flex min-h-[600px] h-fit lg:min-h-[680px] flex-col gap-6 sm:min-h-[540px] w-[calc(100%+16px)] translate-x-[-8px] lg:translate-x-0 lg:w-full"
          >
            {practiceCases.cases.map((item) => (
              <li
                key={item.title}
                className="relative isolate flex h-full flex-col justify-between overflow-hidden border border-hairline bg-paper px-4 pb-4 pt-6 sm:px-8 sm:pt-10 sm:pb-8 md:pt-14 md:pb-12 lg:block lg:py-15 lg:px-15"
              >
                {/* <GrainOverlay className="opacity-[0.08] mix-blend-overlay" /> */}
                <div className="relative flex flex-col gap-2 sm:gap-6 md:gap-9 lg:flex-row lg:justify-between lg:gap-6 xl:gap-14">
                  <h3 className="font-serif text-2xl sm:text-[32px] leading-[1.1] text-ink sm:text-[40px] lg:max-w-sm lg:text-[48px]">
                    {item.title}
                  </h3>

                  <div className="flex flex-col gap-4 lg:gap-14 max-w-[708px]">
                    <p
                      className={
                        // The "Experience" case's opening sentence used to
                        // stand out in large serif type — same style as the
                        // body text below it now, no separate emphasis.
                        item.roleLabel === "Experience"
                          ? "font-sans text-[14px] leading-[1.5] text-ink/80"
                          : "font-serif indent-[100px] text-base sm:text-lg leading-[1.2] text-ink sm:text-xl lg:text-2xl"
                      }
                    >
                      {item.intro}
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-5">
                      <p className="font-serif text-lg leading-none text-ink sm:w-[100px] sm:shrink-0">
                        {item.roleLabel}
                      </p>
                      <div className="flex flex-col gap-3 lg:border-l lg:border-hairline font-sans text-[14px] leading-[1.5] text-ink lg:pl-5">
                        {"lead" in item && item.lead && (
                          <p className="font-semibold">{item.lead}</p>
                        )}
                        {"list" in item && item.list && (
                          <ul className="list-disc pl-5 text-ink">
                            {item.list.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        )}
                        {"paragraphs" in item && item.paragraphs && (
                          <div className="flex flex-col gap-2 text-ink/80">
                            {item.paragraphs.map((p) => (
                              <p key={p}>{p}</p>
                            ))}
                          </div>
                        )}
                        {"body" in item && item.body && (
                          <p className="text-ink/80">{item.body}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="relative font-serif text-lg uppercase leading-[1.4] text-ink lg:absolute lg:bottom-20 lg:left-20">
                  {item.counter}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
