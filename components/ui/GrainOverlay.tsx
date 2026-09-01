import { useId } from "react";

type GrainOverlayProps = {
  className?: string;
  baseFrequency?: number;
  numOctaves?: number;
};

/**
 * Procedural film-grain texture via SVG feTurbulence — no image download,
 * infinitely crisp at any size. Pair with a low opacity + a blend-mode
 * className (e.g. mix-blend-soft-light) on the consumer side.
 */
export function GrainOverlay({
  className = "",
  baseFrequency = 0.85,
  numOctaves = 3,
}: GrainOverlayProps) {
  const filterId = useId();

  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          stitchTiles="stitch"
          result="noise"
        />
        {/* White speckles, alpha channel pushed to higher contrast so the grain actually reads. */}
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3 -1" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
