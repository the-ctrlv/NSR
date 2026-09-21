"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO_REVEAL_EVENT } from "@/lib/heroReveal";

// Any section that shouldn't have this button floating on top of it (e.g.
// NSR in Practice, whose own pinned card doesn't want a competing CTA) can
// opt in just by adding this attribute — no wiring back into FloatingCta.
// Hidden only while that particular section is in view; visible again once
// scrolled past it.
const HIDE_ZONE_SELECTOR = "[data-hide-floating-cta]";

// A one-way version of the above: once the viewport has scrolled down to (or
// past) this section's top edge, the button stays hidden for the rest of the
// page — it only comes back if the user scrolls back up above this point.
const HIDE_FROM_SELECTOR = "[data-hide-floating-cta-from]";

/**
 * The hero's CTA lives here, not inside Hero — `position: fixed` so it stays
 * on screen across every section as the user scrolls the whole site, not
 * just while the hero is in view. It doesn't watch scroll itself for its
 * initial appearance: HeroIntro is the single source of truth for the
 * hero's reveal threshold and dispatches HERO_REVEAL_EVENT at that exact
 * moment, so this button always appears in the same beat as the real
 * headline, never independently. It does watch scroll for one thing after
 * that: temporarily hiding itself while a HIDE_ZONE_SELECTOR section is in
 * view, so it never sits on top of a section that doesn't want it.
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

    let revealed = false;
    let inHideZone = false;
    let pastHideFrom = false;

    const applyState = () => {
      const visible = revealed && !inHideZone && !pastHideFrom;
      gsap.to(el, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 20,
        duration: 0.4,
        ease: "sine.inOut",
        pointerEvents: visible ? "auto" : "none",
      });
    };

    const handleReveal = (event: Event) => {
      revealed = (event as CustomEvent<{ revealed: boolean }>).detail.revealed;
      applyState();
    };
    window.addEventListener(HERO_REVEAL_EVENT, handleReveal);

    const zones = document.querySelectorAll(HIDE_ZONE_SELECTOR);
    const intersecting = new Set<Element>();
    const zoneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }
        inHideZone = intersecting.size > 0;
        applyState();
      },
      { threshold: 0.3 },
    );
    zones.forEach((zone) => zoneObserver.observe(zone));

    // Read from the scroll position directly instead of an IntersectionObserver
    // on a 0px sliver: an instant jump (nav anchor links no longer animate)
    // can carry a section's top edge across the viewport top between two
    // frames without it ever intersecting the sliver, so the observer never
    // fired and the button stayed visible. "Top edge at or above the
    // viewport top" is a pure function of the current position, so it can't
    // be missed however the scroll got there.
    const fromEls = document.querySelectorAll(HIDE_FROM_SELECTOR);
    const updatePastFrom = () => {
      const next = Array.from(fromEls).some(
        (el) => el.getBoundingClientRect().top <= 0,
      );
      if (next === pastHideFrom) return;
      pastHideFrom = next;
      applyState();
    };
    updatePastFrom();
    window.addEventListener("scroll", updatePastFrom, { passive: true });
    window.addEventListener("resize", updatePastFrom);

    return () => {
      window.removeEventListener(HERO_REVEAL_EVENT, handleReveal);
      zoneObserver.disconnect();
      window.removeEventListener("scroll", updatePastFrom);
      window.removeEventListener("resize", updatePastFrom);
    };
  }, []);

  return (
    <div
      ref={ref}
      // Starts hidden via plain CSS (opacity-0, translate-y-5, no pointer
      // events) so it's already invisible in the server-rendered HTML —
      // GSAP's gsap.set() below only re-confirms the same state, it isn't
      // what first hides it. Without this, the button paints fully visible
      // for a moment before JS ever runs on a fresh load.
      className="pointer-events-none fixed bottom-6 right-6 z-50 hidden translate-y-5 opacity-0 sm:block sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-[50px]"
    >
      <Button href="#contact" variant="light">
        Share your situation
      </Button>
    </div>
  );
}
