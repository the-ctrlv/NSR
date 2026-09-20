"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cookieConsent } from "@/lib/content";
import { loadAnalytics } from "@/lib/analytics";

const STORAGE_KEY = "nsr-cookie-consent";

const noopSubscribe = () => () => {};

function noConsentStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === null;
  } catch {
    // Storage blocked (private mode, disabled) — treat as "no choice
    // stored", so the banner still offers the choice for this visit.
    return true;
  }
}

function getStoredConsent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Fixed, bottom-right, shown until the visitor accepts or rejects —
 * standard cookie-consent canon: no auto-dismiss, no close button, the
 * choice is the only way out, and it's remembered so the banner doesn't
 * come back on the next visit. Offset well above FloatingCta's own
 * bottom-right pill (same corner, same edge alignment) so the two never
 * overlap while both happen to be visible.
 */
export function CookieConsent() {
  // useSyncExternalStore rather than a useEffect+setState mount check —
  // this is a one-time synchronous read of external (localStorage) state,
  // exactly what the hook is for. Server snapshot defaults to "don't
  // show" (SSR has no access to localStorage) — a returning visitor with
  // a stored choice then never sees it at all, since the client snapshot
  // agrees on the first real check. A first-time visitor sees it appear
  // right after that check confirms nothing's stored yet, same as how
  // most cookie banners already behave everywhere else on the web —
  // better trade-off than the previous flash-then-vanish, which happened
  // to every returning visitor instead of only ever popping in once for
  // new ones.
  const shouldShow = useSyncExternalStore(
    noopSubscribe,
    noConsentStored,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  // Loads analytics for a RETURNING visitor who already accepted on a
  // previous visit — the click handler below only covers accepting just
  // now, in this session.
  useEffect(() => {
    if (getStoredConsent() === "accepted") loadAnalytics();
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Nothing to persist to — the banner will just reappear next visit.
    }
    if (value === "accepted") loadAnalytics();
    setDismissed(true);
  };

  if (!shouldShow || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-8 z-50 flex flex-col gap-4 border border-hairline bg-paper p-6 shadow-lg sm:inset-x-auto sm:right-8 sm:bottom-8 sm:max-w-[750px] sm:flex-row sm:gap-4 lg:right-[50px] lg:bottom-10"
    >
      <p className="flex-1 font-sans text-base leading-[1.4] text-ink">
        {cookieConsent.body}{" "}
        <a
          href={cookieConsent.policyHref}
          className="font-semibold underline decoration-from-font underline-offset-2 leading-[1.2] text-ink"
        >
          {cookieConsent.policyLabel}
        </a>
      </p>
      <div className="flex shrink-0 h-full gap-3">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="whitespace-nowrap border border-ink bg-ink px-8 py-4 font-serif text-base uppercase tracking-[0.04em] text-alabaster transition-colors duration-300 hover:bg-ink-dim"
        >
          {cookieConsent.accept}
        </button>
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="whitespace-nowrap border border-ink bg-paper px-8 py-4 font-serif text-base uppercase tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-alabaster"
        >
          {cookieConsent.reject}
        </button>
      </div>
    </div>
  );
}
