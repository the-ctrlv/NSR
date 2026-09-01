import { footer } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative bg-alabaster py-10 text-ink">
      <div className="mx-auto flex w-full max-w-[1470px] flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left lg:px-[50px]">
        <p className="font-sans text-sm font-light text-ink">{footer.copyright}</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- small vector mark, next/image adds no value */}
        <img
          src="/icons/nsr-monogram.svg"
          alt="NSR Mallorca"
          className="h-10 w-auto sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
        />
        <nav aria-label="Legal">
          <ul className="flex items-center gap-8 font-sans text-sm text-ink">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-opacity hover:opacity-70">
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
