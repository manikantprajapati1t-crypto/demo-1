import { cn } from "../../utils/cn";

/** Slowly rotating mandala line-art — decorative only. */
export function Mandala({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      className={cn("animate-spin-slow", className)}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" strokeDasharray="1 4" />
      <circle cx="100" cy="100" r="84" />
      <circle cx="100" cy="100" r="58" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="30" />
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / 16} 100 100)`}>
          <path d="M100 16c7 14 7 26 0 42-7-16-7-28 0-42z" />
          <circle cx="100" cy="10" r="1.6" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

/** Floating paisley (buta) motif — decorative only. */
export function Paisley({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={cn("animate-float", className)}
      style={style}
      aria-hidden="true"
    >
      <path d="M52 6C84 20 96 62 66 96c-20 22-52 14-52-14 0-24 26-30 34-12 6 14-8 22-16 10" />
      <path d="M52 22C72 34 78 60 60 80" strokeDasharray="1 5" />
      <circle cx="66" cy="44" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Lotus-petal divider. */
export function LotusDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 12h44M76 12h44" />
      <path d="M60 3c6 5 8 10 0 18-8-8-6-13 0-18zM48 8c8 2 10 8 8 13-8-1-11-6-8-13zM72 8c-8 2-10 8-8 13 8-1 11-6 8-13z" />
    </svg>
  );
}
