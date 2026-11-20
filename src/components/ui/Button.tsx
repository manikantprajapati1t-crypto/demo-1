import { useRef } from "react";
import type { ReactNode, MouseEvent, PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { cn } from "../../utils/cn";

/* Magnetic wrapper — element drifts toward the pointer (mouse only) */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const leave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)" });

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("inline-block", className)}
    >
      {children}
    </span>
  );
}

type Variant = "terracotta" | "ivory" | "outline" | "outline-dark" | "forest";

const VARIANTS: Record<Variant, string> = {
  terracotta: "bg-terracotta text-ivory",
  ivory: "bg-ivory text-forest",
  forest: "bg-forest text-ivory",
  outline: "border border-ivory/60 text-ivory",
  "outline-dark": "border border-forest/40 text-forest",
};
const FILLS: Record<Variant, string> = {
  terracotta: "bg-forest",
  ivory: "bg-terracotta",
  forest: "bg-terracotta",
  outline: "bg-ivory",
  "outline-dark": "bg-forest",
};
const HOVER_TEXT: Record<Variant, string> = {
  terracotta: "group-hover:text-ivory",
  ivory: "group-hover:text-ivory",
  forest: "group-hover:text-ivory",
  outline: "group-hover:text-forest",
  "outline-dark": "group-hover:text-ivory",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  icon?: boolean;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

/** Pill CTA with a sliding colour-fill hover. */
export function Button({
  children,
  variant = "terracotta",
  href,
  onClick,
  icon = true,
  className,
  external,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 disabled:opacity-50",
    VARIANTS[variant],
    className,
  );
  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:rounded-none",
          FILLS[variant],
        )}
      />
      <span
        className={cn(
          "relative z-10 flex items-center gap-3 transition-colors duration-500",
          HOVER_TEXT[variant],
        )}
      >
        {children}
        {icon && (
          <ArrowUpRight
            size={16}
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </span>
    </>
  );

  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {body}
      </a>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {body}
    </button>
  );
}
