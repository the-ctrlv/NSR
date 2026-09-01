type EyebrowProps = {
  children: string;
  tone?: "ink" | "alabaster";
  className?: string;
};

export function Eyebrow({ children, tone = "ink", className = "" }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide ${
        tone === "ink" ? "text-ink" : "text-alabaster"
      } ${className}`}
    >
      <span aria-hidden="true">→</span>
      {children}
    </p>
  );
}
