"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      // Lower lerp = slower catch-up to the target position, which reads as
      // more weight/inertia; the reduced wheelMultiplier makes each wheel
      // tick move less on its own, reinforcing that heavier feel.
      lerp: 0.06,
      wheelMultiplier: 0.85,
      syncTouch: true,
      // Nav links (#matters, #about, etc.) go through Lenis's own animated
      // scrollTo instead of the browser's instant hash jump. This has to be
      // Lenis's scroll, not a separate gsap.to(window, {scrollTo}) tween —
      // Lenis already owns the scroll position every frame via the ticker
      // above, so a second RAF loop writing to window.scrollY at the same
      // time would fight it and stutter.
      anchors: { duration: 1.2 },
    });

    const updateScroll = (time: number) => {
      lenis.raf(time * 1000);
    };

    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    gsap.ticker.add(updateScroll);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateScroll);
      lenis.destroy();
    };
  }, []);

  return children;
}
