"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

type Tag = "div" | "ul" | "ol";

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  /** Stagger the direct children instead of animating the wrapper as one block. */
  stagger?: number;
  drawSelector?: string;
  start?: string;
};

export function Reveal({
  children,
  as = "div",
  className,
  y = 28,
  duration = 0.9,
  delay = 0,
  stagger,
  drawSelector,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(
    null,
  );

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const targets = stagger ? gsap.utils.toArray(node.children) : node;
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start, once: true },
      });

      if (drawSelector) {
        const drawnTargets = gsap.utils.toArray<HTMLElement>(
          node.querySelectorAll(drawSelector),
        );
        gsap.set(drawnTargets, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(drawnTargets, {
          clipPath: "inset(0 0% 0 0)",
          duration,
          delay,
          stagger,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start, once: true },
        });
      }
    }, node);

    return () => ctx.revert();
  }, [y, duration, delay, stagger, drawSelector, start]);

  if (as === "ul") {
    return (
      <ul ref={ref} className={className}>
        {children}
      </ul>
    );
  }

  if (as === "ol") {
    return (
      <ol ref={ref} className={className}>
        {children}
      </ol>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
