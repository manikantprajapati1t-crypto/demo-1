import { useSyncExternalStore } from "react";

/** Reactive matchMedia hook. */
export function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () =>
  useMedia("(prefers-reduced-motion: reduce)");

export const useFinePointer = () =>
  useMedia("(hover: hover) and (pointer: fine)");
