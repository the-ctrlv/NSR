import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/content";

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
  description: siteConfig.description,
  keywords: [
    "Mallorca concierge",
    "Mallorca relocation",
    "local operating partner Mallorca",
    "property management Mallorca",
    "private client services Mallorca",
  ],
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
        url: "/images/hero-portrait.png",
        width: 1200,
        height: 798,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/hero-portrait.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${numeralFont.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
