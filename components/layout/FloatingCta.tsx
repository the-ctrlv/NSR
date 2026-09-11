"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO_REVEAL_EVENT } from "@/lib/heroReveal";

/**
 * The hero's CTA lives here, not inside Hero — `position: fixed` so it stays
 * on screen across every section as the user scrolls the whole site, not
 * just while the hero is in view. It doesn't watch scroll itself: HeroIntro
 * is the single source of truth for the hero's reveal threshold and
 * dispatches HERO_REVEAL_EVENT at that exact moment, so this button always
 * appears in the same beat as the real headline, never independently.
 */
export function FloatingCta() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: 20, pointerEvents: "none" });

    const handleReveal = (event: Event) => {
      const { revealed } = (event as CustomEvent<{ revealed: boolean }>).detail;
      gsap.to(el, {
        opacity: revealed ? 1 : 0,
        y: revealed ? 0 : 20,
        duration: 0.4,
        ease: "sine.inOut",
        pointerEvents: revealed ? "auto" : "none",
      });
    };

    window.addEventListener(HERO_REVEAL_EVENT, handleReveal);
    return () => window.removeEventListener(HERO_REVEAL_EVENT, handleReveal);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 hidden sm:block sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-[50px]"
    >
      <Button href="#contact" variant="light">
        Share your situation
      </Button>
    </div>
  );
}
