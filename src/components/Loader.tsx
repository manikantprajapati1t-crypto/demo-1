import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { brand } from "../config/brand";

interface Props {
  heroLoaded: boolean;
  onReady: () => void;
  onDone: () => void;
}

/** Elegant page-loading animation: drawn lotus mark, counter, curtain lift. */
export function Loader({ heroLoaded, onReady, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [minDone, setMinDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const finished = useRef(false);
  const progress = useRef({ v: 0 });
  const reduce = prefersReducedMotion();

  // intro + fake progress
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from(".ld-path", {
          strokeDashoffset: 1,
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.12,
        });
        gsap.from(".ld-letter", {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          delay: 0.3,
        });
        gsap.from(".ld-sub", { autoAlpha: 0, y: 12, duration: 1, delay: 1, ease: "power3.out" });
      }
      gsap.to(progress.current, {
        v: 88,
        duration: reduce ? 0.5 : 2.2,
        ease: "power2.out",
        onUpdate: () => setPct(Math.round(progress.current.v)),
      });
    }, root);
    const t1 = window.setTimeout(() => setMinDone(true), reduce ? 500 : 2000);
    const t2 = window.setTimeout(() => setTimedOut(true), 5500);
    return () => {
      ctx.revert();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduce]);

  // finish once hero image + min time are satisfied
  useEffect(() => {
    if (finished.current || !minDone || !(heroLoaded || timedOut)) return;
    finished.current = true;
    const tl = gsap.timeline();
    tl.to(progress.current, {
      v: 100,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setPct(Math.round(progress.current.v)),
    });
    if (reduce) {
      tl.add(onReady).to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: onDone });
    } else {
      tl.to(".ld-content", { autoAlpha: 0, y: -24, duration: 0.6, ease: "power3.in" }, "+=0.15")
        .add(onReady, "+=0.1")
        .to(root.current, {
          yPercent: -100,
          duration: 1.3,
          ease: "expo.inOut",
          onComplete: onDone,
        }, "<");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDone, heroLoaded, timedOut]);

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest text-ivory"
    >
      <div className="ld-content flex flex-col items-center">
        <svg viewBox="0 0 80 80" width="84" height="84" fill="none" stroke="#BC6847" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <path className="ld-path" pathLength={1} strokeDasharray={1} d="M40 8c11 12 20 20 20 34a20 20 0 0 1-40 0c0-14 9-22 20-34z" />
          <path className="ld-path" pathLength={1} strokeDasharray={1} d="M40 22c6 8 10 13 10 21a10 10 0 0 1-20 0c0-8 4-13 10-21z" />
          <path className="ld-path" pathLength={1} strokeDasharray={1} d="M12 66h56" />
        </svg>
        <div className="mt-8 flex overflow-hidden font-serif text-5xl tracking-[0.3em] md:text-6xl" aria-hidden="true">
          {brand.name.split("").map((l, i) => (
            <span key={i} className="ld-letter inline-block pr-[0.15em]">
              {l}
            </span>
          ))}
        </div>
        <p className="ld-sub eyebrow mt-4 text-ivory/70">{brand.tagline}</p>
      </div>
      <div className="ld-content absolute bottom-8 left-0 right-0 flex items-end justify-between px-6 md:px-12">
        <span className="eyebrow text-ivory/50">Loading the collection</span>
        <span className="font-serif text-6xl leading-none tabular-nums text-ivory/90 md:text-8xl">
          {String(pct).padStart(2, "0")}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ivory/10">
        <div className="h-full bg-terracotta" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
