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
// The attribute can be scoped to one layout: `="mobile"` or `="desktop"`
// (split at MOBILE_QUERY, the same breakpoint where the button itself moves
// from bottom-centre to the bottom-right corner); a bare attribute applies to
// both.
const HIDE_FROM_SELECTOR = "[data-hide-floating-cta-from]";
const MOBILE_QUERY = "(max-width: 639px)";

// Scroll-direction behaviour: any downward scroll slides the button off the
// bottom of the screen; scrolling back up by at least this many px (measured
// from the deepest point reached) brings it back.
const SHOW_ON_SCROLL_UP_PX = 50;
// How far below its resting spot the button sits while hidden by scrolling
// down — enough to clear the bottom edge of the screen entirely.
const SCROLL_HIDE_Y = 120;

/**
 * The hero's CTA lives here, not inside Hero — `position: fixed` so it stays
 * on screen across every section as the user scrolls the whole site, not
 * just while the hero is in view. It doesn't watch scroll itself for its
 * initial appearance: HeroIntro is the single source of truth for the
 * hero's reveal threshold and dispatches HERO_REVEAL_EVENT at that exact
 * moment, so this button always appears in the same beat as the real
 * headline, never independently. It does watch scroll after that:
 * temporarily hiding itself while a HIDE_ZONE_SELECTOR section is in view,
 * and — once the hero has scrolled past its pin — sliding off the bottom of
 * the screen on any downward scroll, coming back after a short scroll up.
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
    let scrollHidden = false;

    const applyState = () => {
      const visible = revealed && !inHideZone && !pastHideFrom && !scrollHidden;
      gsap.to(el, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : scrollHidden ? SCROLL_HIDE_Y : 20,
        duration: 0.4,
        ease: "sine.inOut",
        pointerEvents: visible ? "auto" : "none",
        overwrite: "auto",
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
    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const appliesToLayout = (el: Element) => {
      const scope = el.getAttribute("data-hide-floating-cta-from");
      if (scope === "mobile") return mobileMq.matches;
      if (scope === "desktop") return !mobileMq.matches;
      return true;
    };
    const updatePastFrom = () => {
      const next = Array.from(fromEls).some(
        (el) => appliesToLayout(el) && el.getBoundingClientRect().top <= 0,
      );
      if (next === pastHideFrom) return;
      pastHideFrom = next;
      applyState();
    };
    updatePastFrom();
    window.addEventListener("scroll", updatePastFrom, { passive: true });
    window.addEventListener("resize", updatePastFrom);
    mobileMq.addEventListener("change", updatePastFrom);

    // Direction tracking is ignored while the hero is still pinned (its top
    // edge sits at the viewport top for the whole pin): the user is scrolling
    // down *through* the reveal animation there, so hiding on every downward
    // tick would make the button flash in and straight back out. Once the
    // hero starts scrolling off the top, direction takes over.
    const heroRoot = document.querySelector("[data-hero-root]");
    let lastY = Math.max(0, window.scrollY);
    let deepestY = lastY;
    const updateDirection = () => {
      // Clamped so iOS rubber-band overscroll above the top doesn't read as
      // scroll movement.
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      if (delta === 0) return;

      let next = scrollHidden;
      if (heroRoot && heroRoot.getBoundingClientRect().top >= -1) {
        next = false;
        deepestY = y;
      } else if (delta > 0) {
        deepestY = y;
        next = true;
      } else if (deepestY - y >= SHOW_ON_SCROLL_UP_PX) {
        next = false;
      }
      if (next === scrollHidden) return;
      scrollHidden = next;
      applyState();
    };
    window.addEventListener("scroll", updateDirection, { passive: true });

    return () => {
      window.removeEventListener(HERO_REVEAL_EVENT, handleReveal);
      zoneObserver.disconnect();
      window.removeEventListener("scroll", updateDirection);
      window.removeEventListener("scroll", updatePastFrom);
      window.removeEventListener("resize", updatePastFrom);
      mobileMq.removeEventListener("change", updatePastFrom);
    };
  }, []);

  return (
    // Positioning lives on this outer wrapper, animation on the inner one:
    // GSAP owns the inner element's transform (the y slide), so centering
    // it with a translate-x class would get overwritten. Mobile: centered
    // along the bottom edge; sm and up: bottom-right corner.
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-[50px]">
      <div
        ref={ref}
        // Starts hidden via plain CSS (opacity-0, translate-y-5, no pointer
        // events) so it's already invisible in the server-rendered HTML —
        // GSAP's gsap.set() below only re-confirms the same state, it isn't
        // what first hides it. Without this, the button paints fully visible
        // for a moment before JS ever runs on a fresh load.
        className="pointer-events-none translate-y-5 opacity-0"
      >
        <Button href="#contact" variant="light">
          Share your situation
        </Button>
      </div>
    </div>
  );
}
