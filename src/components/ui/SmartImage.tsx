import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "../../utils/cn";

const WIDTHS = [480, 800, 1200, 1800];

const sized = (src: string, w: number) =>
  src.includes("pexels.com")
    ? `${src}?auto=compress&cs=tinysrgb&w=${w}`
    : src;

/** Branded illustrative fallback if a photograph ever fails to load. */
const FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
    <rect width='400' height='500' fill='#183C32'/>
    <g fill='none' stroke='#F5F0E6' stroke-opacity='.35' stroke-width='1.2'>
      <circle cx='200' cy='230' r='120'/><circle cx='200' cy='230' r='90'/><circle cx='200' cy='230' r='60'/>
      <path d='M200 110c30 40 50 70 50 120s-20 80-50 120c-30-40-50-70-50-120s20-80 50-120z'/>
      <path d='M80 230h240M200 110v240'/>
    </g>
    <circle cx='200' cy='230' r='10' fill='#BC6847'/>
    <text x='200' y='420' text-anchor='middle' font-family='Georgia,serif' font-size='28' fill='#F5F0E6' letter-spacing='8'>KARIGAR</text>
  </svg>`,
)}`;

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  /** Preferred max width of the request */
  w?: number;
  eager?: boolean;
  onLoaded?: () => void;
}

export function SmartImage({
  src,
  alt,
  className,
  style,
  sizes = "100vw",
  w = 1200,
  eager,
  onLoaded,
}: Props) {
  const [stage, setStage] = useState(0); // 0 optimised → 1 raw → 2 fallback
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const isPex = src.includes("pexels.com");

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      onLoaded?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const url = stage === 0 ? sized(src, w) : stage === 1 ? src : FALLBACK;

  return (
    <img
      ref={ref}
      src={url}
      srcSet={
        stage === 0 && isPex
          ? WIDTHS.map((x) => `${sized(src, x)} ${x}w`).join(", ")
          : undefined
      }
      sizes={stage === 0 && isPex ? sizes : undefined}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onLoad={() => {
        setLoaded(true);
        onLoaded?.();
      }}
      onError={() => setStage((s) => Math.min(2, s + 1))}
      style={style}
      className={cn(
        "photo-grade transition-opacity duration-700",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
