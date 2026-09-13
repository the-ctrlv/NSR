"use client";

import { useLayoutEffect, useRef } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks, siteConfig } from "@/lib/content";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";
import { isScrollSnapping } from "@/lib/scrollSnapGuard";

/**
 * Same header markup/spacing as the hero's own (logo, nav, MobileNav) —
 * just fixed and hidden while the hero itself is on screen (it already
 * shows its own copy there) and while scrolling down past it. Scrolling up
 * anywhere past that point slides this one in, so nav is reachable without
 * scrolling all the way back to the top.
 */
export function StickyHeader() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      // The CSS default now hides it (-translate-y-full); with reduced
      // motion we skip the scroll-driven show/hide logic entirely below,
      // so nothing else would ever bring it back. Restore the same
      // "visible at rest" state this had before that CSS default existed.
      gsap.set(el, { yPercent: 0 });
      return;
    }

    gsap.set(el, { yPercent: -100 });

    registerGsap();
    const hero = document.querySelector<HTMLElement>("[data-hero-root]");

    const ctx = gsap.context(() => {
      // Mobile has no sticky header at all — MobileNav's own full-screen
      // panel already covers navigation there.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        let visible = false;
        // Tracked ourselves instead of relying on ScrollTrigger's own
        // self.direction, which flips on ANY sign change no matter how
        // tiny — a momentary sub-pixel reverse blip (Lenis's smoothing
        // easing into its target, or another pinned section's snap
        // animation settling) was enough to flash the header even during
        // an otherwise steady scroll straight down.
        let lastScroll = 0;
        // Net upward distance accumulated since the last downward move —
        // any scroll down resets it to 0, so only a real, sustained upward
        // scroll (not a brief wobble) brings the header back in.
        let upAccum = 0;
        const SHOW_AFTER_UP_PX = 150;

        const setVisible = (next: boolean) => {
          if (next === visible) return;
          visible = next;
          gsap.to(el, {
            yPercent: next ? 0 : -100,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });
        };

        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const heroHeight = hero?.offsetHeight ?? 0;
            const scroll = self.scroll();
            const delta = scroll - lastScroll;
            lastScroll = scroll;

            if (scroll < heroHeight) {
              setVisible(false);
              upAccum = 0;
              return;
            }
            // Another section (AboutFounder) can snap-correct the scroll
            // position backward on its own, well after the user's actual
            // gesture ended — that's not the user scrolling up, so ignore
            // it entirely while it's happening.
            if (isScrollSnapping()) return;
            // Ignore tiny jitter — anything smaller is noise, not a real
            // move in either direction.
            if (Math.abs(delta) < 4) return;

            if (delta < 0) {
              // Scrolling up: accumulate, only reveal once it adds up to a
              // real, sustained upward scroll rather than any small nudge.
              upAccum += -delta;
              if (upAccum > SHOW_AFTER_UP_PX) setVisible(true);
            } else {
              // Any downward move hides it immediately and resets the
              // count — the next reveal needs a fresh 150px of upward
              // scroll, not leftover credit from before.
              upAccum = 0;
              setVisible(false);
            }
          },
        });

        return () => {
          trigger.kill();
        };
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      // Starts translated off-screen above via plain CSS (-translate-y-full)
      // instead of relying on gsap.set() to hide it after mount — otherwise
      // it paints at rest (fully visible, overlapping the hero) for a
      // moment on a fresh load before JS ever runs.
      className="fixed inset-x-0 top-0 z-40 hidden -translate-y-full items-center justify-between gap-6 border-b border-alabaster/20 bg-ink/95 px-6 pt-5 pb-4 text-alabaster backdrop-blur-sm lg:flex lg:px-[50px]"
    >
      <a
        href="#top"
        className="flex items-center gap-3"
        aria-label={`${siteConfig.name} — home`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small vector logo, next/image adds no value */}
        <img
          src="/icons/logo.svg"
          alt=""
          aria-hidden="true"
          className="h-11 w-auto sm:h-9"
        />
      </a>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-8 font-sans text-sm font-medium uppercase tracking-wide">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNav />
    </header>
  );
}
