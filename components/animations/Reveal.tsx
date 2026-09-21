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
    if (!node) return;
    if (prefersReducedMotion()) {
      // Drop the pre-hidden inline state below — no animation is coming to
      // reveal it.
      node.style.opacity = "";
      node.style.transform = "";
      return;
    }

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

  // Rendered already hidden (and offset) so the server HTML never paints the
  // content at rest before hydration runs gsap.set() — that paint-then-hide
  // is the visible flash/jump on load. Stagger mode animates the children
  // instead of the wrapper, so it can't be pre-hidden this way.
  const style = stagger
    ? undefined
    : { opacity: 0, transform: `translateY(${y}px)` };

  if (as === "ul") {
    return (
      <ul ref={ref} className={className} style={style}>
        {children}
      </ul>
    );
  }

  if (as === "ol") {
    return (
      <ol ref={ref} className={className} style={style}>
        {children}
      </ol>
    );
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
