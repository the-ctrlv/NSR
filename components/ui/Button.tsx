import type { AnchorHTMLAttributes } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "light" | "dark";
  children: string;
};

export function Button({
  href,
  variant = "light",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const styles =
    variant === "light"
      ? "border-ink bg-paper text-ink hover:bg-alabaster"
      : "border-ink bg-ink text-alabaster hover:bg-ink-dim";

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-6 whitespace-nowrap border font-serif text-[16px] uppercase tracking-[0.04em] transition-colors duration-300 ${styles} px-8 py-4 ${className}`}
      {...props}
    >
      <span className="relative block h-[1.2em] overflow-hidden leading-[1.2]">
        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full"
        >
          {children}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-premium group-hover:translate-x-1.5"
      >
        →
      </span>
    </a>
  );
}
