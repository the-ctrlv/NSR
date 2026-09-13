"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO_PIN_END, HERO_REVEAL_AT, HERO_REVEAL_EVENT } from "@/lib/heroReveal";

/**
 * Staged hero entrance, matching the Figma storyboard (Frame 1000001971→1973):
 * background settles first, then chrome (header/labels) fades in, then the
 * transient "Complex matters in Mallorca" line reads clearly and holds. The
 * hero pins itself in place and the swap to the real headline/subtext is
 * gated by a scroll threshold (not a timer) — the section doesn't visibly
 * move, scrolling a little just fires that reveal, and scrolling back up
 * reverses it. The CTA button lives outside the hero entirely (see
 * FloatingCta) so it can stay fixed across the whole site instead of being
 * pinned to this section — it listens for HERO_REVEAL_EVENT (dispatched
 * below) rather than computing its own threshold, so it always appears in
 * the same beat as this headline, never independently.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    // HeroIntro renders as the sole child of Hero's <section> — that section
    // is what needs to pin, but its ref lives one level up in Hero.tsx.
    const section = root.parentElement;
    if (!section) return;

    const bgLines = root.querySelector<HTMLElement>('[data-hero="bg-lines"]');
    const portrait = root.querySelector<HTMLElement>('[data-hero="portrait"]');
    const chrome = root.querySelectorAll<HTMLElement>('[data-hero="chrome"]');
    const ghost = root.querySelector<HTMLElement>('[data-hero="ghost"]');
    const headline = root.querySelector<HTMLElement>('[data-hero="headline"]');
    const rest = root.querySelectorAll<HTMLElement>('[data-hero="subtext"]');
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

      // Entrance: chrome fades in, the transient line rolls in and holds —
      // no auto-dissolve, it just sits there until the user scrolls.
      const introTl = gsap.timeline({
        delay: 0.8,
        defaults: { ease: "power3.out" },
      });

      introTl.to(chrome, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 });

      if (ghost) {
        introTl.to(ghost, { opacity: 1, y: 0, duration: 0.45 }, "<0.1");
      }

      // One snap-in beat, not scrubbed: the transient line slides out while
      // the real headline/subtext slide in together, at a fixed duration,
      // the instant the threshold is crossed — and reverses the same way
      // when scrolled back above it.
      const mainTl = gsap.timeline({
        paused: true,
        defaults: { ease: "sine.inOut" },
      });
      if (ghost) {
        mainTl.to(ghost, { opacity: 0, y: -24, duration: 0.4 }, 0);
      }
      mainTl.to(
        mainContent,
        { opacity: 1, y: 0, duration: 0.4, stagger: 0 },
        0,
      );

      // GSAP's own pin mechanism locks in `height`/`max-height` as inline
      // styles (so a position:fixed pin doesn't collapse) from whatever it
      // measures at that instant — and on a fresh load, that can happen
      // later than creation, on the first scroll tick that actually
      // engages the pin. If mobile Safari's address bar is in a different
      // state at that moment, its measurement can undersize the box.
      // NOTE: an earlier version of this fix re-applied on every
      // ScrollTrigger onRefresh — that fires continuously while the
      // toolbar is mid-animation during a scroll, so it turned into a
      // refresh-loop and the whole page visibly juddered. onToggle only
      // fires once per pin engage/disengage, not per scroll tick, so a
      // single correction there is far safer.
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      const applyFixedHeight = () => {
        if (!isMobile) return;
        const fixedHeight = Math.max(window.innerHeight, window.screen.height);
        section.style.height = `${fixedHeight}px`;
        section.style.maxHeight = `${fixedHeight}px`;
      };

      let revealed = false;
      let heightFixedOnEngage = false;
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: HERO_PIN_END,
        pin: true,
        anticipatePin: 1,
        onToggle: (self) => {
          if (self.isActive && !heightFixedOnEngage) {
            heightFixedOnEngage = true;
            applyFixedHeight();
            self.refresh();
          }
        },
        onUpdate: (self) => {
          const shouldReveal = self.progress >= HERO_REVEAL_AT;
          if (shouldReveal !== revealed) {
            revealed = shouldReveal;
            if (revealed) mainTl.play();
            else mainTl.reverse();
            window.dispatchEvent(
              new CustomEvent(HERO_REVEAL_EVENT, {
                detail: { revealed: shouldReveal },
              }),
            );
          }
        },
      });

      applyFixedHeight();
      if (isMobile) trigger.refresh();

      return () => {
        trigger.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
