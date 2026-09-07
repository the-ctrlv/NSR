"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

type TextFillRevealProps = {
  lines: readonly string[];
  id?: string;
  className?: string;
  lineClassName?: string;
  start?: string;
  end?: string;
};

export function TextFillReveal({
  lines,
  id,
  className = "",
  lineClassName = "",
  start = "top 70%",
  end = "top 30%",
}: TextFillRevealProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    registerGsap();
    const lineElements = Array.from(root.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      const progressValues = lineElements.map(() => ({ value: 0 }));
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          end,
          scrub: 0.35,
        },
      });

      lineElements.forEach((line, index) => {
        const updateLine = () => {
          const progress = progressValues[index].value * 100;
          line.style.backgroundImage = `linear-gradient(to right, #1a2437 0%, #1a2437 ${progress}%, #8693a0 ${progress}%, #8693a0 100%)`;
        };

        gsap.set(line, {
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage:
            "linear-gradient(to right, #8693a0 0%, #8693a0 100%)",
        });
        timeline.to(
          progressValues[index],
          { value: 1, duration: 1, ease: "none", onUpdate: updateLine },
          index,
        );
      });
    }, root);

    return () => ctx.revert();
  }, [start, end, lines.length]);

  return (
    <h2 ref={rootRef} id={id} className={className}>
      {lines.map((line) => (
        <span key={line} className={`block ${lineClassName}`}>
          {line}
        </span>
      ))}
    </h2>
  );
}
