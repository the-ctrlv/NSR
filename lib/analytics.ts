"use client";

// Google Consent Mode v2 (https://developers.google.com/tag-platform/security/guides/consent):
// the gtag script itself loads unconditionally and immediately (Google's
// own recommendation — it needs to be present to receive the consent
// signal at all), but every storage/tracking grant starts denied.
// CookieConsent.tsx calls updateConsent() with the visitor's actual choice
// once they answer the banner; until then GA4 only records
// cookieless "consent" pings, no personal data, no cookies. Per the
// approved SEO brief, GA4 must respect the consent choice, and no personal
// message content or form-field values are ever sent as event params.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

function gtag(...args: unknown[]) {
  window.dataLayer!.push(args);
}

/**
 * Loads the gtag script and sets the default consent state to denied.
 * Safe to call unconditionally on app mount — this alone sends no cookies
 * and identifies no one; it's what lets Google Analytics later receive an
 * actual consent update from this same page.
 */
export function initAnalytics() {
  if (initialized || !GA_MEASUREMENT_ID || typeof window === "undefined") {
    return;
  }
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  // Default MUST be set before config/js — it's what makes every later
  // gtag call (from this or any other tag) start out denied rather than
  // granted, for every visitor, everywhere, until updateConsent() below
  // says otherwise. `wait_for_update` gives updateConsent() a 500ms window
  // to arrive first on a visitor who already has a stored choice, so the
  // very first ping already reflects it instead of firing denied once.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

/** Called once the visitor answers the cookie banner, in either direction. */
export function updateConsent(granted: boolean) {
  if (!initialized || typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

// Supporting-event tracking — WhatsApp/email/LinkedIn clicks etc. This
// site has no on-page form, so there's no "form submission" primary
// conversion to track yet; wire that up the same way once a form exists.
export function trackEvent(name: string, params?: Record<string, string>) {
  if (!initialized || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
