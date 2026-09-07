"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Staged hero entrance, matching the Figma storyboard (Frame 1000001971→1973):
 * background settles first, then chrome (header/labels) fades in, then the
 * transient "Complex matters in Mallorca" line reads clearly for a beat before
 * the real headline rolls in to replace it, then subtext/CTA follow.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const bgLines = root.querySelector<HTMLElement>('[data-hero="bg-lines"]');
    const portrait = root.querySelector<HTMLElement>('[data-hero="portrait"]');
    const chrome = root.querySelectorAll<HTMLElement>('[data-hero="chrome"]');
    const ghost = root.querySelector<HTMLElement>('[data-hero="ghost"]');
    const headline = root.querySelector<HTMLElement>('[data-hero="headline"]');
    const rest = root.querySelectorAll<HTMLElement>(
      '[data-hero="subtext"], [data-hero="cta"]',
    );
    const mainContent = headline
      ? [headline, ...Array.from(rest)]
      : Array.from(rest);

    if (prefersReducedMotion()) {
      if (ghost) ghost.style.display = "none";
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      // Ambient background motion — slow, endless, independent of the entrance timeline.
      if (bgLines) {
        gsap.to(bgLines, {
          rotation: 360,
          duration: 180,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      }

      // Portrait starts oversized and settles to rest size immediately,
      // ahead of (and independent from) the delayed chrome/headline timeline.
      if (portrait) {
        gsap.fromTo(
          portrait,
          { scale: 1.42, transformOrigin: "50% 15%" },
          { scale: 1, duration: 1.4, ease: "power3.out", delay: 0.5 },
        );
      }

      gsap.set(chrome, { opacity: 0, y: 12 });
      if (ghost) gsap.set(ghost, { opacity: 0, y: 24 });
      if (headline) gsap.set(headline, { opacity: 0, y: 24 });
      gsap.set(rest, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        delay: 0.8,
        defaults: { ease: "power3.out" },
      });

      tl.to(chrome, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 });

      if (ghost) {
        // First line rolls in and reads clearly on its own for a beat.
        tl.to(ghost, { opacity: 1, y: 0, duration: 0.45 }, "<0.1").to(
          ghost,
          { opacity: 0, y: -28, duration: 0.55, ease: "sine.inOut" },
          "+=0.3",
        );
      }

      tl.to(
        mainContent,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0,
          ease: "sine.inOut",
        },
        ghost ? "<+=0.1" : "+=0.1",
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
