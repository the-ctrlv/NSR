import { footer } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-ink py-10 text-alabaster">
      <div className="mx-auto flex w-full max-w-[1470px] flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left lg:px-[50px]">
        <p className="font-sans text-sm text-alabaster/70">{footer.copyright}</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- small vector logo, next/image adds no value */}
        <img src="/icons/logo.svg" alt="NSR Mallorca" className="h-6 w-auto opacity-80" />
        <nav aria-label="Legal">
          <ul className="flex items-center gap-6 font-sans text-sm text-alabaster/70">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-opacity hover:opacity-100">
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
