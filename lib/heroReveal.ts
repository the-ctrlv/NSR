// HeroIntro owns the hero's pin + scroll threshold and is the single source
// of truth for "has the real headline swapped in yet" — it dispatches
// HERO_REVEAL_EVENT on `window` at that exact moment. FloatingCta (the CTA
// button, rendered outside the hero so it can be position:fixed site-wide)
// just listens for that event instead of computing its own threshold, so the
// two can never drift out of sync with each other.
export const HERO_PIN_END = "+=90%";
export const HERO_REVEAL_AT = 0.15;
export const HERO_REVEAL_EVENT = "hero-reveal";
