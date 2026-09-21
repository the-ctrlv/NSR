"use client";

import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { setLenisInstance } from "@/lib/lenisInstance";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Browsers restore the previous scroll position on a plain reload, which
  // fights with all the scroll-position-driven pins/reveals on this page —
  // always start fresh at the top instead.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      // Lower lerp = slower catch-up to the target position, which reads as
      // more weight/inertia; the reduced wheelMultiplier makes each wheel
      // tick move less on its own, reinforcing that heavier feel.
      lerp: 0.045,
      wheelMultiplier: 0.8,
      // Smoothing only applies to wheel input — touch/swipe scrolls natively
      // on mobile. Intercepting touch here fights with the pinned
      // ScrollTrigger sections on real phones and reads as a jumpy
      // "slideshow" while scrolling.
      syncTouch: false,
      // Nav links (#matters, #about, etc.) jump straight to the target, no
      // animation. They still go through Lenis (not the browser's native
      // hash jump) so Lenis's own scroll position stays in sync and doesn't
      // snap back on the next frame.
      anchors: { immediate: true },
    });
    setLenisInstance(lenis);

    const updateScroll = (time: number) => {
      lenis.raf(time * 1000);
    };

    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    gsap.ticker.add(updateScroll);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    // Every pinned section (Hero, RealityReveal x2, AboutFounder,
    // PracticeCases) measures its start/end from the page layout at the
    // moment it was created. If anything above it changes height afterwards
    // — web fonts swapping in, lazy images settling, a section re-flowing —
    // those measurements go stale, and the pins fire at the wrong scroll
    // positions: content "teleports" you into a later section's animation.
    // So re-measure whenever the page's total height actually changes, plus
    // once fonts and the load event have settled. Debounced, and deferred
    // while a scroll is in flight so a refresh never lands mid-gesture.
    let refreshTimer = 0;
    let lastHeight = document.documentElement.scrollHeight;
    const scheduleRefresh = (delay = 250) => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (lenis.isScrolling) {
          scheduleRefresh(250);
          return;
        }
        lastHeight = document.documentElement.scrollHeight;
        ScrollTrigger.refresh();
      }, delay);
    };

    // ScrollTrigger.config({ ignoreMobileResize: true }) (see lib/gsap.ts)
    // freezes pin measurements against mobile Safari's per-scroll-tick
    // resize events, so whatever it measures first sticks — which is why
    // this refresh has to be triggered explicitly rather than by resize.
    scheduleRefresh(500);
    window.addEventListener("load", () => scheduleRefresh(100), { once: true });
    void document.fonts?.ready.then(() => scheduleRefresh(100));

    const heightObserver = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      // Pin spacers legitimately grow the page once; only react to real
      // changes since the last refresh, not to our own refresh's output.
      if (Math.abs(height - lastHeight) > 2) scheduleRefresh();
    });
    heightObserver.observe(document.body);

    return () => {
      window.clearTimeout(refreshTimer);
      heightObserver.disconnect();
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateScroll);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return children;
}
