"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

type SequentialFlowRevealProps = {
  children: ReactNode;
  className?: string;
  start?: string;
  duration?: number;
  pause?: number;
};

export function SequentialFlowReveal({
  children,
  className = "",
  start = "top 85%",
  duration = 0.4,
  pause = 0.08,
}: SequentialFlowRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-flow-text], [data-flow-arrow]",
        ),
      );
      const texts = elements.filter((element) =>
        element.hasAttribute("data-flow-text"),
      );
      const arrows = elements.filter((element) =>
        element.hasAttribute("data-flow-arrow"),
      );
      const listItems = Array.from(
        root.querySelectorAll<HTMLElement>("[data-flow-list] li"),
      );

      const fillStates = texts.map(() => ({ value: 0 }));
      texts.forEach((text, index) => {
        const updateFill = () => {
          const progress = fillStates[index].value * 100;
          text.style.backgroundImage = `linear-gradient(to right, #1a2437 0%, #1a2437 ${progress}%, #8693a0 ${progress}%, #8693a0 100%)`;
        };

        gsap.set(text, {
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage:
            "linear-gradient(to right, #8693a0 0%, #8693a0 100%)",
        });
        updateFill();
      });
      gsap.set(arrows, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(listItems, { opacity: 0, y: 12 });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root, start, once: true },
      });

      elements.forEach((element) => {
        const isArrow = element.hasAttribute("data-flow-arrow");
        if (isArrow) {
          timeline.to(element, {
            clipPath: "inset(0 0% 0 0)",
            duration,
            ease: "power2.out",
          });
        } else {
          const textIndex = texts.indexOf(element);
          timeline.to(fillStates[textIndex], {
            value: 1,
            duration,
            ease: "none",
            onUpdate: () => {
              const progress = fillStates[textIndex].value * 100;
              element.style.backgroundImage = `linear-gradient(to right, #1a2437 0%, #1a2437 ${progress}%, #8693a0 ${progress}%, #8693a0 100%)`;
            },
          });
        }
        timeline.to({}, { duration: pause });
      });

      timeline.to(listItems, {
        opacity: 1,
        y: 0,
        duration,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, root);

    return () => ctx.revert();
  }, [duration, pause, start]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
