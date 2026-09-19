import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks, siteConfig } from "@/lib/content";

/**
 * Static light header for standalone subpages (privacy policy, etc.) — not
 * animated in like Hero's own header, and not the dark sticky header that
 * rides above the homepage's ink hero. Nav links point back at the
 * homepage's in-page anchors since these sections only exist there.
 */
export function PageHeader() {
  return (
    <header className="border-b border-ink/20 bg-paper px-6 py-5 text-ink sm:px-10 lg:px-[50px] lg:py-6">
      <div className="mx-auto flex w-full max-w-[1470px] items-center justify-between">
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
            className="h-8 w-auto sm:h-[30px]"
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
      </div>
    </header>
  );
}
