"use client";

import { useLayoutEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
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
      const compact = window.matchMedia("(max-width: 639px)").matches;
      // Per original card: tilt applied once it's no longer the active
      // (front) card — card 1 tilts one way, card 2 the other, card 3 never
      // recedes so its own entry here is unused.
      const rotations = [3, -3, 0];
      const stackHeight = compact ? 680 : 540;
      // Full container height below — the incoming card starts as if
      // arriving from the section below.
      const enterFromY = stackHeight;

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
          // already-arrived cards' rotated corners are never clipped by an
          // overflow-hidden container.
          visibility: index === 0 ? "visible" : "hidden",
          y: index === 0 ? 0 : enterFromY,
          // The front card (index 0) always lands flat; only cards waiting
          // behind it show their tilt. Once a card has arrived it never
          // moves again — only rotation and stacking order change.
          rotation: index === 0 ? 0 : rotations[index % rotations.length],
        });
      };

      cards.forEach((card, index) => setStackState(card, index));

      // Extra pause held after the last card lands, before the section
      // releases — expressed in the same "1 transition = 1 unit" scale as
      // the card-swap steps below, so it stretches the scroll range without
      // slowing the swaps themselves.
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
          // Earlier cards sit deeper in the stack; the immediately previous
          // front card must remain above all older cards.
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-paper py-20 lg:min-h-screen"
      aria-label="NSR in practice"
    >
      <Container>
        <Eyebrow className="mb-10 lg:mb-16">{practiceCases.eyebrow}</Eyebrow>

        <ul
          ref={stackRef}
          className="relative flex min-h-[680px] flex-col gap-6 lg:min-h-[540px]"
        >
          {practiceCases.cases.map((item) => (
            <li
              key={item.title}
              className="relative isolate h-full overflow-hidden border border-hairline bg-paper px-4 pb-4 pt-10 lg:py-20 lg:px-15"
            >
              <GrainOverlay className="opacity-[0.08] mix-blend-overlay" />
              <div className="relative flex gap-8 justify-between lg:gap-14">
                <h3 className="font-serif text-[32px] leading-[1.1] text-ink lg:text-[48px] max-w-sm">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-10 lg:gap-14 max-w-[708px]">
                  <p className="font-serif indent-[100px] text-base leading-[1.2] text-ink lg:text-2xl">
                    {item.intro}
                  </p>

                  <div className="flex flex-col gap-5 sm:flex-row sm:gap-5">
                    <p className="font-serif text-lg leading-none text-ink sm:w-[100px] sm:shrink-0">
                      {item.roleLabel}
                    </p>
                    <div className="flex flex-col gap-3 border-hairline pl-0 font-sans text-[15px] leading-[1.5] text-ink sm:border-l sm:pl-5">
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
                        <div className="flex flex-col gap-3 text-ink/80">
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

              <p className="relative mt-10 font-serif text-lg uppercase text-ink lg:absolute lg:bottom-20 lg:left-20 lg:mt-0">
                {item.counter}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
