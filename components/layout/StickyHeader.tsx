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
    if (!el || prefersReducedMotion()) return;

    gsap.set(el, { yPercent: -100 });

    registerGsap();
    const hero = document.querySelector<HTMLElement>("[data-hero-root]");

    const ctx = gsap.context(() => {
      // Mobile has no sticky header at all — MobileNav's own full-screen
      // panel already covers navigation there.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        let visible = false;

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
            if (self.scroll() < heroHeight) {
              setVisible(false);
              return;
            }
            setVisible(self.direction === -1);
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
      className="fixed inset-x-0 top-0 z-40 hidden items-center justify-between gap-6 border-b border-alabaster/20 bg-ink/95 px-6 pt-5 pb-4 text-alabaster backdrop-blur-sm lg:flex lg:px-[50px]"
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
