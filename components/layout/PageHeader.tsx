import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks, siteConfig } from "@/lib/content";

/**
 * Header for standalone subpages (privacy policy, cookie policy). Light
 * background (paper) with the homepage header's spacing, logo size and nav
 * type. Nav links point back at the homepage's
 * in-page anchors since those sections only exist there.
 */
export function PageHeader() {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-ink/20 bg-paper px-4 pt-6 pb-3 text-ink sm:px-10 lg:px-[50px]">
      <Link
        href="/"
        className="flex items-center gap-3"
        aria-label={`${siteConfig.name} — home`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small vector logo, next/image adds no value */}
        <img
          src="/icons/logo-dark.svg"
          alt=""
          aria-hidden="true"
          className="h-[25px] w-auto sm:h-7"
        />
      </Link>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-8 font-sans text-sm font-medium uppercase tracking-wide">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={`/${link.href}`}
                className="transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <MobileNav dark />
    </header>
  );
}
