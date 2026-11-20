import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { cn } from "../../utils/cn";
import { SmartImage } from "./SmartImage";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  w?: number;
  /** Clip-path mask reveal on entering the viewport */
  reveal?: boolean;
  /** Vertical parallax strength in % (0 disables) */
  parallax?: number;
  /** Direction the mask opens from */
  from?: "bottom" | "top" | "left" | "right";
  children?: ReactNode;
}

const CLIPS = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Image with masked reveal + scroll parallax. Parent controls aspect ratio. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  w,
  reveal = true,
  parallax = 7,
  from = "bottom",
  children,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !wrap.current || !inner.current) return;
    const ctx = gsap.context(() => {
      const img = inner.current!.querySelector("img");
      if (reveal) {
        gsap.from(wrap.current, {
          clipPath: CLIPS[from],
          duration: 1.5,
          ease: "expo.inOut",
          scrollTrigger: { trigger: wrap.current, start: "top 88%", once: true },
        });
        if (img)
          gsap.from(img, {
            scale: 1.35,
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: wrap.current, start: "top 88%", once: true },
          });
      }
      if (parallax > 0) {
        gsap.fromTo(
          inner.current,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, wrap);
    return () => ctx.revert();
  }, [reveal, parallax, from]);

  return (
    <div
      ref={wrap}
      className={cn("photo-tint relative overflow-hidden bg-forest/15", className)}
    >
      <div
        ref={inner}
        className="absolute inset-x-0 -top-[9%] h-[118%] will-change-transform"
      >
        <SmartImage
          src={src}
          alt={alt}
          sizes={sizes}
          w={w}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
      {children}
    </div>
  );
}
