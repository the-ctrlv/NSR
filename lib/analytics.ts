"use client";

// Loaded only after cookie consent is accepted (see CookieConsent.tsx) —
// per the approved SEO brief, GA4 must respect the consent choice, and no
// personal message content or form-field values are ever sent as event
// params.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

export function loadAnalytics() {
  if (loaded || !GA_MEASUREMENT_ID || typeof window === "undefined") return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

// Supporting-event tracking — WhatsApp/email/LinkedIn clicks etc. This
// site has no on-page form, so there's no "form submission" primary
// conversion to track yet; wire that up the same way once a form exists.
export function trackEvent(name: string, params?: Record<string, string>) {
  if (!loaded || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
