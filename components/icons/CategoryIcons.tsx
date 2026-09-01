type IconProps = {
  className?: string;
};

/** Private client affairs — a balanced scale of aligned personal matters. */
export function PrivateIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <path
        d="M50 24v52M32 34h36M32 66h36M32 34l-8 16 8 8M68 34l8 16-8 8M32 66l-8-16M68 66l8-16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Property — a simple architectural roofline. */
export function PropertyIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <path
        d="M28 52 50 30l22 22M34 46v26h32V46"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M46 72V58h8v14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Business & local operations — connected nodes / network of operators. */
export function BusinessIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <circle cx="50" cy="32" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="66" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="68" cy="66" r="6" stroke="currentColor" strokeWidth="1" />
      <path
        d="M50 38v10M45 51 36 61M55 51l9 10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small four-point sparkle used as a tag separator, echoing the hero starburst mark. */
export function Sparkle({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5 0 6 4 10 5 6 6 5 10 4 6 0 5 4 4Z" />
    </svg>
  );
}
