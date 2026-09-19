import Image from "next/image";
import { HeroIntro } from "@/components/animations/HeroIntro";
// import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { audienceLabels, navLinks, siteConfig } from "@/lib/content";

export function Hero() {
  return (
    <section
      data-hero-root
      className="relative isolate flex h-[100lvh] w-full flex-col overflow-hidden bg-ink text-alabaster"
    >
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
          <div className="absolute left-1/2 top-[80%] h-[80%] w-[80%] max-w-none -translate-x-1/2 -translate-y-[40%]">
            {/* Two independent line graphics layered in the same spot,
                each spun by HeroIntro at its own speed (see data-hero
                below) for a subtle multi-speed parallax instead of one
                flat rotation. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
            <img
              src="/icons/bg-line.svg"
              alt=""
              aria-hidden="true"
              data-hero="bg-lines-1"
              className="absolute inset-0 block h-full w-full opacity-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
            <img
              src="/icons/bg-line-2.svg"
              alt=""
              aria-hidden="true"
              data-hero="bg-lines-2"
              className="absolute inset-0 block h-full w-full opacity-60"
            />
          </div>
          {/* Grain sits under the portrait so it only shows on the blue background — the portrait PNG is a transparent cutout and occludes it wherever she is opaque. */}
          {/* <GrainOverlay className="opacity-[0.25] mix-blend-overlay" /> */}
          <div
            data-hero="portrait"
            // Starts at the same scale/origin GSAP's fromTo() below animates
            // FROM (1.42, origin 50% 15%) via plain CSS, so there's nothing
            // to snap to when JS runs — otherwise it paints at its default
            // scale (1, i.e. already settled) for a moment before hydration,
            // then visibly jumps up to 1.42 the instant gsap.fromTo() applies
            // its starting state, before easing back down.
            className="absolute inset-x-0 top-[10%] isolate mx-auto h-[95%] w-full origin-[50%_15%] scale-[1.42] sm:w-[45%] md:w-[64%] lg:w-[45%] min-w-[280px] overflow-hidden"
          >
            <Image
              src="/images/hero-portrait.png"
              alt="Nataliia Sychenko Romanova, independent local operating partner at NSR Mallorca"
              fill
              priority
              // Matches the portrait wrapper's own breakpoints above
              // (sm:w-[45%] md:w-[58%] lg:w-[45%]) — without this,
              // next/image falls back to a 100vw sizes default and serves
              // the largest breakpoint image at every viewport, which
              // hurts LCP on this priority image.
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 64vw, (min-width: 640px) 45vw, 100vw"
              className="object-contain"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[65vh] bg-gradient-to-b from-ink/0 from-0% to-ink to-[78%] sm:from-[55%] sm:to-ink/97 sm:to-[85%]" />
        </div>

        {/* Header */}
        <header
          data-hero="chrome"
          className="relative z-10 flex items-center justify-between gap-6 border-b border-alabaster/20 px-4 pt-6 pb-3 sm:px-10 lg:px-[50px]"
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
              className="h-[25px] w-auto sm:h-7"
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
            <p className="text-lg uppercase leading-[1.7] tracking-[0.02em]">
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
          className="relative z-10 flex justify-end px-4 pt-[30px] sm:px-10 lg:hidden"
        >
          <div className="flex flex-col items-end gap-2 text-right font-serif text-base uppercase leading-[1.4] text-alabaster">
            {audienceLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-24 sm:px-10 lg:px-[50px]">
          {/* Partner info (mobile/tablet) — centered above the headline, matching the mobile layout */}
          <div
            data-hero="chrome"
            className="mx-auto mb-5 max-w-[277px] text-center font-serif text-alabaster lg:hidden"
          >
            <p className="font-sans text-[15px] leading-[1.7]">
              Independent Local Operating Partner
            </p>
            <p className="text-lg uppercase leading-[1.7] tracking-[0.02em]">
              Nataliia Sychenko Romanova
            </p>
          </div>

          <div className="mx-auto flex max-w-[893px] flex-col items-center gap-2 text-center">
            <div className="relative">
              {/* Transient entrance line — blurs into view then dissolves as the real headline sharpens in its place. Mirrors the headline text/sizing exactly so the two align during the morph. */}
              <p
                data-hero="ghost"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-center font-serif text-[clamp(2.25rem,calc(14vw_-_8px),3.125rem)] leading-none text-alabaster sm:text-6xl md:text-6xl lg:text-display xl:whitespace-nowrap"
              >
                {siteConfig.tagline}
              </p>
              <h1
                data-hero="headline"
                className="font-serif text-[clamp(2.25rem,calc(14vw_-_8px),3.125rem)] leading-none sm:text-6xl md:text-6xl lg:text-display"
              >
                {siteConfig.tagline2}
              </h1>
            </div>
            <p
              data-hero="subtext"
              className="max-w-[521px] font-sans text-base leading-[1.4] text-alabaster/90 sm:text-lg"
            >
              {siteConfig.heroSubtext}
            </p>
          </div>
        </div>

        <a
          data-hero="chrome"
          href="#matters"
          className="group absolute left-4 top-[100px] z-10 flex flex-col items-center gap-3 sm:left-6 sm:top-auto sm:bottom-8 lg:left-[50px]"
          aria-label="Scroll to content"
        >
          <span className="font-sans text-sm leading-[1.6] text-alabaster [writing-mode:vertical-lr]">
            Scroll down
          </span>
          <span
            className="relative block h-[60px] w-px overflow-hidden bg-alabaster/20 sm:h-16"
            aria-hidden="true"
          >
            <span className="absolute inset-x-0 top-0 h-1/3 animate-[scroll-line_2s_ease-in-out_infinite] bg-alabaster" />
          </span>
        </a>
      </HeroIntro>
    </section>
  );
}
