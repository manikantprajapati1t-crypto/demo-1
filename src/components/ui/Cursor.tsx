import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useFinePointer } from "../../hooks/useMedia";

/**
 * Desktop-only interactive cursor follower. The native cursor stays visible
 * for accessibility; the ring grows on interactive elements and shows a
 * label on any element with data-cursor="Label".
 */
export function Cursor() {
  const fine = useFinePointer();
  const wrap = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ hover: boolean; label: string }>({
    hover: false,
    label: "",
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || !wrap.current) return;
    const el = wrap.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      const labelEl = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a,button,input,select,textarea,[role='button']");
      setState({
        hover: !!(labelEl || interactive),
        label: labelEl?.dataset.cursor ?? "",
      });
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine]);

  if (!fine) return null;

  const big = state.label !== "";
  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .3s" }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-terracotta text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-all duration-500 ease-[var(--ease-expo)]"
        style={{
          width: big ? 84 : state.hover ? 54 : 14,
          height: big ? 84 : state.hover ? 54 : 14,
          background: big
            ? "var(--color-terracotta)"
            : state.hover
              ? "color-mix(in srgb, var(--color-terracotta) 22%, transparent)"
              : "var(--color-terracotta)",
        }}
      >
        {big ? state.label : null}
      </div>
    </div>
  );
}
