"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import {
  HERO_PIN_END,
  HERO_REVEAL_AT,
  HERO_REVEAL_EVENT,
} from "@/lib/heroReveal";
import { getLenisInstance } from "@/lib/lenisInstance";

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

    const bgLines1 = root.querySelector<HTMLElement>(
      '[data-hero="bg-lines-1"]',
    );
    const bgLines2 = root.querySelector<HTMLElement>(
      '[data-hero="bg-lines-2"]',
    );
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
      // Chrome/headline/subtext start at opacity 0 via a plain CSS rule
      // (see app/globals.css) so there's no flash of the final text before
      // GSAP takes over — but with reduced motion we skip the entrance
      // timeline entirely, so nothing else ever un-hides them. Restore
      // full visibility explicitly instead of leaving that to the timeline.
      gsap.set([...Array.from(chrome), ...mainContent], {
        opacity: 1,
        y: 0,
      });
      // Portrait now starts scaled up via CSS (see Hero.tsx) to match
      // gsap.fromTo()'s starting point below — with reduced motion we skip
      // that tween entirely, so it would otherwise stay stuck oversized
      // forever. Settle it to its normal rest scale explicitly.
      if (portrait) gsap.set(portrait, { scale: 1 });
      return;
    }

    registerGsap();

    // Scroll stays locked from the moment the hero mounts until the intro
    // timeline below (chrome fade-in + the transient headline) has fully
    // played — otherwise a fast scroller can blow straight through the
    // entrance before it even finishes. document.body's overflow is the
    // native fallback (also covers touch, which Lenis doesn't intercept —
    // see SmoothScroll's syncTouch: false); lenis.stop()/.start() pauses the
    // wheel-driven virtual scroll itself so its internal target position
    // doesn't drift out of sync while locked. Lenis is created in
    // SmoothScroll's useEffect, which — unlike this layout effect — hasn't
    // necessarily run yet at this exact point, so the stop() call is
    // deferred a frame (same reasoning as the refresh() deferrals below).
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => getLenisInstance()?.stop());
    let scrollUnlocked = false;
    const unlockScroll = () => {
      if (scrollUnlocked) return;
      scrollUnlocked = true;
      document.body.style.overflow = "";
      getLenisInstance()?.start();
    };

    const ctx = gsap.context(() => {
      // Ambient background motion — slow, endless, independent of the
      // entrance timeline. Two layers spinning at different speeds AND
      // opposite directions instead of one flat rotation, so they drift
      // in and out of alignment.
      if (bgLines1) {
        gsap.to(bgLines1, {
          rotation: 360,
          duration: 180,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      }
      if (bgLines2) {
        gsap.to(bgLines2, {
          rotation: -360,
          duration: 260,
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
      if (ghost) gsap.set(ghost, { opacity: 0, y: 50 });
      if (headline) gsap.set(headline, { opacity: 0, y: 24 });
      gsap.set(rest, { opacity: 0, y: 20 });

      // Entrance: chrome fades in, the transient line rolls in and holds —
      // no auto-dissolve, it just sits there until the user scrolls.
      const introTl = gsap.timeline({
        delay: 0.8,
        defaults: { ease: "power3.out" },
        onComplete: unlockScroll,
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
        // If the user scrolls past the reveal threshold fast, right after
        // load, this can start while introTl's own ghost-reveal tween above
        // is still running — two independent, uncoordinated timelines
        // fighting over the same element's opacity, which read as the
        // ghost line and the real headline both staying visible, overlapping
        // each other. (Tried `overwrite: true` on this timeline's own tweens
        // for this — turns out GSAP's overwrite check runs at tween
        // CREATION time, not at play time, and mainTl is built synchronously
        // right after introTl, before introTl has even started — so it just
        // killed the ghost-reveal tween immediately, before it ever got a
        // chance to run, and the ghost line never appeared at all.) Killing
        // introTl only once mainTl actually starts playing is the correct
        // timing — introTl has normally long since finished by then anyway,
        // so this is a no-op in the common case.
        onStart: () => introTl.kill(),
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
            // Deferred a frame: calling refresh() synchronously here can
            // land mid-way through another component's own ScrollTrigger
            // setup (every section on this page creates at least one on
            // mount), which intermittently threw GSAP's internal
            // "Cannot read properties of undefined (reading 'end')" —
            // a known race from refreshing while the global trigger list
            // is still being built elsewhere. One frame is enough for the
            // rest of the page's mount-time ScrollTrigger.create() calls to
            // finish first.
            requestAnimationFrame(() => self.refresh());
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
      // Same deferral as onToggle above — let every other section's
      // mount-time ScrollTrigger.create() calls finish first.
      if (isMobile) requestAnimationFrame(() => trigger.refresh());

      // Parallax: only once the hero's pin-spacer is actually done and the
      // section is scrolling normally off the top of the viewport — the
      // portrait sinks down, same idea as WorkingTogether's background
      // drift. A separate trigger, not reusing the pin trigger's own
      // progress, since that one only spans the pin itself and sits at 1
      // for its whole exit — it never reflects this later phase.
      // `start: () => trigger.end` reads the pin trigger's actual resolved
      // end position (a real scroll offset in px) — HERO_PIN_END itself is
      // a "+=90%" string, valid as an `end` value relative to that
      // trigger's own `start`, but meaningless as a `start` value here with
      // nothing to be relative to. `end: "bottom top"` runs it for the
      // section's entire exit, all the way until it's fully scrolled out of
      // view.
      //
      // This is built as a real tween passed via `animation`, not a manual
      // gsap.set() inside onUpdate — with no attached animation, `scrub`
      // doesn't actually do anything, and self.progress is always the raw,
      // instantaneous value. That's what caused the reported bug: scrolling
      // through the pin-spacer (before this trigger's own start) somehow
      // still left something "building up", which then dumped out all at
      // once the moment the pin let go. With an attached animation, GSAP
      // maps the tween's own progress directly and exclusively to this
      // trigger's [start, end] window — it's hard-clamped to 0 for the
      // entire pin phase, with nothing to accumulate, and scrub's lag/
      // inertia applies correctly once real scrolling begins past start.
      const parallaxTrigger = portrait
        ? ScrollTrigger.create({
            trigger: section,
            start: () => trigger.end,
            // "bottom top" measured this section's bottom edge while it's
            // also the target of the pin above — with a pin-spacer in play,
            // that resolved to a position barely past `start`, so the whole
            // range collapsed to ~100-200px and progress hit 1 almost
            // immediately. Defining `end` the same way as `start` — a
            // function, offset by one more viewport height past the pin's
            // own end — sidesteps that ambiguity and reliably covers the
            // section's actual exit distance.
            end: () => trigger.end + window.innerHeight,
            scrub: 3.5,
            animation: gsap.to(portrait, {
              yPercent: 18,
              // power2.inOut eased the start too, so the portrait barely
              // moved for the first bit of scrolling — power2.out instead
              // starts at full speed right away and only eases off at the
              // very end.
              ease: "power2.out",
            }),
          })
        : null;

      return () => {
        trigger.kill();
        parallaxTrigger?.kill();
      };
    }, root);

    return () => {
      ctx.revert();
      // Defensive: if this ever unmounts before the intro finished (it
      // normally doesn't — Hero is static for the page's lifetime), don't
      // leave scroll stuck locked.
      unlockScroll();
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
