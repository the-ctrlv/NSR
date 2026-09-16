import type Lenis from "lenis";

// SmoothScroll owns the single Lenis instance for the whole page. Other
// components that need to briefly pause/resume smooth scrolling (e.g.
// HeroIntro locking scroll until its entrance animation finishes) grab it
// from here instead of each wiring up their own scroll-locking mechanism.
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance() {
  return instance;
}
