import { createElement, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { cn } from "../../utils/cn";
import { useReady } from "./Ready";

/* ------------------------------------------------------------------ */
/* SplitText — staggered masked word reveal. *word* = accent (italic)  */
/* ------------------------------------------------------------------ */
interface SplitProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  accentClassName?: string;
  /** "scroll" reveals when entering the viewport; "hero" waits for the loader */
  trigger?: "scroll" | "hero";
  delay?: number;
  stagger?: number;
  start?: string;
}

export function SplitText({
  text,
  as = "h2",
  className,
  accentClassName = "italic text-terracotta",
  trigger = "scroll",
  delay = 0,
  stagger = 0.07,
  start = "top 88%",
}: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const ready = useReady();

  const words = text.split(" ").map((token) => {
    const m = token.match(/^\*(.+)\*([.,!?;:]*)$/);
    return m
      ? { word: m[1] + m[2], accent: true }
      : { word: token, accent: false };
  });

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const inners = el.querySelectorAll(".word-inner");
      const t = gsap.from(inners, {
        yPercent: 120,
        rotate: 4,
        duration: 1.3,
        ease: "expo.out",
        stagger,
        delay,
        paused: true,
      });
      tween.current = t;
      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => t.play(),
        });
      }
    }, el);
    return () => ctx.revert();
  }, [trigger, delay, stagger, start, text]);

  useLayoutEffect(() => {
    if (trigger === "hero" && ready) tween.current?.play();
  }, [ready, trigger]);

  return createElement(
    as,
    { ref, className, "aria-label": text.replace(/\*/g, "") },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span className="word-mask">
          <span className={cn("word-inner", w.accent && accentClassName)}>
            {w.word}
          </span>
        </span>
        {i < words.length - 1 ? " " : null}
      </span>
    )),
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — fade/slide up on scroll                                    */
/* ------------------------------------------------------------------ */
interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  trigger?: "scroll" | "hero";
  start?: string;
}

export function Reveal({
  children,
  className,
  y = 40,
  delay = 0,
  trigger = "scroll",
  start = "top 90%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const ready = useReady();

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const t = gsap.from(el, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        delay,
        paused: true,
      });
      tween.current = t;
      if (trigger === "scroll")
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => t.play(),
        });
    }, el);
    return () => ctx.revert();
  }, [y, delay, trigger, start]);

  useLayoutEffect(() => {
    if (trigger === "hero" && ready) tween.current?.play();
  }, [ready, trigger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrubText — words brighten as you scroll through the paragraph      */
/* ------------------------------------------------------------------ */
export function ScrubText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".scrub-word"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="scrub-word inline-block">
          {w}
          {"\u00A0"}
        </span>
      ))}
    </p>
  );
}
