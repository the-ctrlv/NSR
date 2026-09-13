"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  // Mobile Safari resizes the viewport (address bar show/hide) on every
  // scroll tick. Without this, ScrollTrigger treats that as a real resize
  // and re-measures every pinned section mid-scroll, which is what reads
  // as a "slideshow"/jumpy glitch on phones — this is GSAP's own documented
  // fix for that class of bug.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
