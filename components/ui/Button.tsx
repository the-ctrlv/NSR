import type { AnchorHTMLAttributes } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "light" | "dark";
  children: string;
};

export function Button({ href, variant = "light", children, className = "", ...props }: ButtonProps) {
  const styles =
    variant === "light"
      ? "border-ink bg-paper text-ink hover:bg-alabaster"
      : "border-ink bg-ink text-alabaster hover:bg-ink-dim";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-6 whitespace-nowrap border font-serif text-[16px] uppercase tracking-[0.04em] transition-colors duration-300 ${styles} px-8 py-4 ${className}`}
      {...props}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}
