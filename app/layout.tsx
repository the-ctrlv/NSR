import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "./globals.css";
import { seoKeywords, siteConfig } from "@/lib/content";

const displayFont = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/et-kaliena.woff2", weight: "400", style: "normal" },
    { path: "./fonts/et-kaliena.woff", weight: "400", style: "normal" },
  ],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Stand-in for "ET Begin Movalo Demo" (purchased font not yet supplied) — used
// only for the tight-tracked 01-05 numerals in the NSR Approach section.
const numeralFont = Bebas_Neue({
  variable: "--font-numeral",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  keywords: [...seoKeywords.primary, ...seoKeywords.secondary],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        // Dedicated OG asset (public/images/og-image.png) — the raw hero
        // portrait is a tall, transparent-background cutout, wrong aspect
        // ratio for a social card and inconsistent across platforms that
        // don't composite alpha the same way. This is the same portrait
        // flattened onto the brand ink color at the standard 1200x630
        // OG/Twitter card ratio.
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// viewport-fit: "cover" lets full-bleed sections (Hero etc.) draw under the
// iPhone notch/home-indicator safe areas instead of stopping short of them —
// relevant to those sections actually reaching the true screen edges.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${numeralFont.variable}`}
    >
      <body className="bg-paper font-sans text-ink antialiased">
        <SmoothScroll>{children}</SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  );
}
