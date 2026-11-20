/* Minimal brand glyphs (lucide v1 no longer ships brand icons). */
type P = { size?: number; className?: string };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const InstagramIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" />
  </svg>
);

export const YoutubeIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
  </svg>
);

export const PinterestIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M11 16.5l1.6-6.4M9.3 12.2c-.6-2.3 1-4 3-4 1.9 0 3 1.3 3 2.8 0 2-1.2 3.4-2.7 3.4-.8 0-1.4-.5-1.4-1" />
  </svg>
);
