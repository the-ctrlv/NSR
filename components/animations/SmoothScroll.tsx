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
      // Nav links (#matters, #about, etc.) go through Lenis's own animated
      // scrollTo instead of the browser's instant hash jump. This has to be
      // Lenis's scroll, not a separate gsap.to(window, {scrollTo}) tween —
      // Lenis already owns the scroll position every frame via the ticker
      // above, so a second RAF loop writing to window.scrollY at the same
      // time would fight it and stutter.
      anchors: { duration: 1.2 },
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

    // ScrollTrigger.config({ ignoreMobileResize: true }) freezes pin
    // measurements against mobile Safari's per-scroll-tick resize events
    // (that's what kills the jumpy "slideshow" jank) — but that also means
    // whatever it measures on the very first pass sticks for the whole
    // session. Right after load, Safari's address bar is often still
    // animating into its resting state, so that first measurement can be
    // taken against a viewport that's momentarily too short, permanently
    // undersizing every pinned section. One refresh after things settle
    // fixes that without reintroducing per-scroll recalculation.
    const settleTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.clearTimeout(settleTimer);
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateScroll);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return children;
}
