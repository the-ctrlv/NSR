"use client";

import { useEffect, useId, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type GrainOverlayProps = {
  className?: string;
  baseFrequency?: number;
  numOctaves?: number;
  /** Speckle colour as 0-1 RGB. White by default; darker values stop the grain from brightening the surface. */
  tint?: [number, number, number];
};

/**
 * Procedural film-grain texture via SVG feTurbulence — no image download,
 * infinitely crisp at any size. Pair with a low opacity + a blend-mode
 * className (e.g. mix-blend-soft-light) on the consumer side. The noise
 * pattern re-seeds itself on an interval so the grain flickers like real
 * film stock instead of sitting static.
 */
export function GrainOverlay({
  className = "",
  baseFrequency = 0.85,
  numOctaves = 3,
  tint = [1, 1, 1],
}: GrainOverlayProps) {
  const filterId = useId();
  const [seed, setSeed] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // TEMP: mobile jank test — grain fully suppressed below lg to see whether
  // it's a contributor. Remove this once the test is done either way.
  const [suppressedForTest, setSuppressedForTest] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only viewport check for a temporary diagnostic toggle
      setSuppressedForTest(true);
    }
  }, []);

  // There are several of these on the page (one per card in some sections),
  // and re-seeding is a real SVG-filter recompute, not a cheap style
  // change — reseeding every one of them on a timer regardless of scroll
  // position was a constant background cost and a real source of jank on
  // mobile. Only run the loop while this particular instance is on screen.
  useEffect(() => {
    const el = svgRef.current;
    if (!el || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setSeed((s) => (s + 1) % 100);
    }, 90);
    return () => window.clearInterval(id);
  }, [isVisible]);

  if (suppressedForTest) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          seed={seed}
          stitchTiles="stitch"
          result="noise"
        />
        {/* Speckles (white unless `tint` says otherwise), alpha channel pushed to higher contrast so the grain actually reads. */}
        <feColorMatrix in="noise" type="matrix" values={`0 0 0 0 ${tint[0]}  0 0 0 0 ${tint[1]}  0 0 0 0 ${tint[2]}  0 0 0 3 -1`}
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
