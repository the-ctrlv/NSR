import Image from "next/image";
import { HeroIntro } from "@/components/animations/HeroIntro";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { audienceLabels, navLinks, siteConfig } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-ink text-alabaster">
      <HeroIntro>
        {/* Background: portrait, radial vignette, guide lines, film grain */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 620px 470px at 50% 41%, #9aacba 0%, #7a8a99 25%, #5a6879 50%, #3a4658 75%, #2a3547 87.5%, #1a2437 100%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[160%] w-[160%] max-w-none -translate-x-1/2 -translate-y-[40%]">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
            <img
              src="/icons/bg-lines.svg"
              alt=""
              aria-hidden="true"
              data-hero="bg-lines"
              className="block h-full w-full opacity-60"
            />
          </div>
          {/* Grain sits under the portrait so it only shows on the blue background — the portrait PNG is a transparent cutout and occludes it wherever she is opaque. */}
          <GrainOverlay className="opacity-[0.25] mix-blend-overlay" />
          <div
            data-hero="portrait"
            className="absolute inset-x-0 top-[10%] mx-auto h-[95%] w-[45%] min-w-[280px] overflow-hidden"
          >
            <Image
              src="/images/hero-portrait.png"
              alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
              fill
              priority
              // sizes="(min-width: 1024px) 45vw, 80vw"
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-[68%] to-ink/90 to-[90%]" />
        </div>

        {/* Header */}
        <header
          data-hero="chrome"
          className="relative z-10 flex items-center justify-between gap-6 border-b border-alabaster/20 px-6 pt-7 pb-5 sm:px-10 lg:px-[50px]"
        >
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label={`${siteConfig.name} — home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small vector logo, next/image adds no value */}
            <img
              src="/icons/logo.svg"
              alt=""
              aria-hidden="true"
              className="h-11 w-auto sm:h-9"
            />
          </a>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 font-sans text-sm font-medium uppercase tracking-wide">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <MobileNav />
        </header>

        {/* Top row (desktop): partner info (left) + audience labels (right), both directly under the header */}
        <div
          data-hero="chrome"
          className="relative z-10 hidden items-start justify-between gap-6 px-6 pt-8 sm:px-10 lg:flex lg:px-[50px]"
        >
          <div className="max-w-[363px] font-serif text-alabaster">
            <p className="font-sans text-[15px] leading-[1.7]">
              Independent Local Operating Partner
            </p>
            <p className="text-lg uppercase leading-[1.7] tracking-[0.04em]">
              Nataliia Sychenko Romanova
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right font-serif text-lg uppercase">
            {audienceLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>
        </div>

        {/* Audience labels only (mobile/tablet) — top-right, no matching partner-info row at this size */}
        <div
          data-hero="chrome"
          className="relative z-10 flex justify-end px-6 pt-6 sm:px-10 lg:hidden"
        >
          <div className="flex flex-col items-end gap-2 text-right font-serif text-base uppercase text-alabaster">
            {audienceLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-24 sm:px-10 lg:px-[50px]">
          {/* Partner info (mobile/tablet) — centered above the headline, matching the mobile layout */}
          <div
            data-hero="chrome"
            className="mb-6 text-center font-serif text-alabaster lg:hidden"
          >
            <p className="font-sans text-[15px] leading-[1.7]">
              Independent Local Operating Partner
            </p>
            <p className="text-lg uppercase leading-[1.7] tracking-[0.04em]">
              Nataliia Sychenko Romanova
            </p>
          </div>

          <div className="mx-auto flex max-w-[893px] flex-col items-center gap-2 text-center">
            <div className="relative">
              {/* Transient entrance line — blurs into view then dissolves as the real headline sharpens in its place. */}
              <p
                data-hero="ghost"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center whitespace-nowrap font-serif text-[50px] leading-[0.95] text-alabaster sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Complex matters in Mallorca
              </p>
              <h1
                data-hero="headline"
                className="font-serif text-[50px] leading-[0.95] sm:text-6xl md:text-7xl lg:text-display"
              >
                {siteConfig.tagline}
              </h1>
            </div>
            <p
              data-hero="subtext"
              className="max-w-[521px] font-sans text-base leading-[1.4] text-alabaster/90 sm:text-lg"
            >
              {siteConfig.heroSubtext}
            </p>
          </div>
          <div
            data-hero="cta"
            className="mx-auto mt-10 sm:mt-8 sm:ml-auto sm:mr-0 lg:absolute lg:bottom-24 lg:right-[50px] lg:mt-0"
          >
            <Button href="#contact" variant="light">
              Share your situation
            </Button>
          </div>
        </div>

        <a
          data-hero="chrome"
          href="#matters"
          className="group absolute bottom-8 left-6 z-10 hidden items-center gap-3 sm:flex lg:left-[50px]"
          aria-label="Scroll to content"
        >
          <span className="font-sans text-sm text-alabaster [writing-mode:vertical-lr]">
            Scroll down
          </span>
          <span
            className="h-16 w-px animate-pulse bg-alabaster/50"
            aria-hidden="true"
          />
        </a>
      </HeroIntro>
    </section>
  );
}
