import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth scroll to a section id, accounting for the fixed header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (prefersReducedMotion()) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "auto" });
    return;
  }
  gsap.to(window, {
    duration: 1.4,
    ease: "expo.inOut",
    scrollTo: { y: el, offsetY: 72, autoKill: true },
  });
}
