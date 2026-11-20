import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";

/**
 * Lightweight 3D tilt using CSS transforms (mouse only, no layout cost).
 * Returns a ref for the tilting element, optional glare ref, and handlers.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 9) {
  const ref = useRef<T>(null);
  const glare = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max * 1.2).toFixed(2)}deg) translateZ(0)`;
        if (glare.current) {
          glare.current.style.opacity = "1";
          glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.22), transparent 55%)`;
        }
      });
    },
    [max],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (glare.current) glare.current.style.opacity = "0";
  }, []);

  return { ref, glare, onPointerMove, onPointerLeave };
}
