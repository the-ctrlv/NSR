// Coordinates a pinned/snapped ScrollTrigger section (currently
// AboutFounder's step sequence) with StickyHeader: while a snap correction
// is actively animating the scroll position after the user lets go mid-step,
// that's not the user scrolling — it's GSAP moving the page for them. If
// StickyHeader read that as a direction change, an automatic backward snap
// correction would flash the header even during an otherwise steady
// downward scroll. Any section that snaps should call setScrollSnapping
// around its own snap animation; anything that cares about "is the page
// scrolling because of me, not a snap" can check isScrollSnapping().
let snapping = false;

export function setScrollSnapping(next: boolean) {
  snapping = next;
}

export function isScrollSnapping() {
  return snapping;
}
