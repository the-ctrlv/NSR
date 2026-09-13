import { footer } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative bg-alabaster py-10 text-ink">
      <div className="mx-auto flex w-full max-w-[1470px] flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left lg:px-[50px]">
        <p className="order-3 font-sans text-sm font-light text-ink sm:order-none">
          {footer.copyright}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- small vector mark, next/image adds no value */}
        <img
          src="/icons/nsr-monogram.svg"
          alt="NSR Mallorca"
          className="order-1 h-10 w-auto brightness-0 sm:order-none sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
        />
        <nav aria-label="Legal" className="order-2 sm:order-none">
          <ul className="flex items-center gap-4 font-sans text-sm text-ink sm:gap-8">
            {footer.links.map((link, i) => (
              <li key={link.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="sm:hidden">
                    |
                  </span>
                )}
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
      </div>
    </footer>
  );
}
