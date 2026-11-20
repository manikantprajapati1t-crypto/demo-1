import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { brand } from "../config/brand";
import { gsap, prefersReducedMotion, scrollToId } from "../lib/gsap";
import { useStore } from "../context/StoreContext";
import { useReady } from "./ui/Ready";
import { useEscape, useLockBody } from "../hooks/useOverlay";
import { cn } from "../utils/cn";

export const NAV_LINKS = [
  { id: "story", label: "Our Story" },
  { id: "collections", label: "Collections" },
  { id: "shop", label: "Shop" },
  { id: "artisans", label: "Artisans" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M24 5c7 8 13 13 13 22a13 13 0 0 1-26 0c0-9 6-14 13-22z" />
      <path d="M24 17c4 5 6.5 8 6.5 12.5a6.5 6.5 0 0 1-13 0c0-4.500 2.500-7.500 6.500-12.500z" />
      <path d="M8 43h32" />
    </svg>
  );
}

export function Navbar() {
  const { cartCount, wishlist, openDrawer, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const ready = useReady();

  useLockBody(open);
  useEscape(open, () => setOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 450);
    return () => window.clearTimeout(t);
  }, [cartCount]);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !bar.current) return;
    const t = gsap.from(bar.current, { yPercent: -100, autoAlpha: 0, duration: 1.2, ease: "expo.out", paused: true, delay: 0.4 });
    (bar.current as HTMLElement & { _t?: gsap.core.Tween })._t = t;
  }, []);
  useEffect(() => {
    if (ready) (bar.current as (HTMLElement & { _t?: gsap.core.Tween }) | null)?._t?.play();
  }, [ready]);

  const go = (id: string) => {
    if (open) {
      setOpen(false);
      window.setTimeout(() => scrollToId(id), 450);
    } else scrollToId(id);
  };

  const light = !scrolled && !open; // ivory text over the hero

  return (
    <>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,box-shadow,padding,color] duration-500",
          scrolled
            ? "bg-ivory/90 py-3 text-forest shadow-[0_1px_0_rgba(24,60,50,0.1)] backdrop-blur-xl"
            : "bg-transparent py-5 md:py-7",
          light ? "text-ivory" : open ? "text-ivory" : "text-forest",
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 md:px-10">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
            className="flex items-center gap-3"
            aria-label={`${brand.name} — home`}
          >
            <LogoMark className="h-8 w-8 text-terracotta" />
            <span className="leading-none">
              <span className="block font-serif text-2xl font-semibold tracking-[0.28em] md:text-[1.7rem]">
                {brand.name}
              </span>
              <span className="mt-1 hidden text-[0.56rem] font-medium uppercase tracking-[0.34em] opacity-70 sm:block">
                {brand.tagline}
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  className="link-underline pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.2em]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 md:gap-2">
            <IconBtn label="Search products" onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </IconBtn>
            <IconBtn label={`Wishlist, ${wishlist.length} items`} onClick={() => openDrawer("wishlist")} className="hidden sm:flex">
              <Heart size={20} />
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </IconBtn>
            <IconBtn label={`Shopping bag, ${cartCount} items`} onClick={() => openDrawer("bag")}>
              <motion.span animate={bump ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.45 }} className="flex">
                <ShoppingBag size={20} />
              </motion.span>
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </IconBtn>
            <IconBtn
              label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </IconBtn>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[65] flex flex-col justify-between overflow-y-auto bg-forest px-6 pb-10 pt-28 text-ivory lg:hidden"
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className="flex items-baseline gap-4 border-b border-ivory/10 py-3 font-serif text-4xl"
                  >
                    <span className="eyebrow text-terracotta">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex items-center justify-between text-sm text-ivory/70">
              <button
                onClick={() => {
                  setOpen(false);
                  openDrawer("wishlist");
                }}
                className="flex items-center gap-2"
              >
                <Heart size={16} /> Wishlist ({wishlist.length})
              </button>
              <span>{brand.contact.email}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  className,
  ...rest
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  "aria-expanded"?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn("relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-current/10", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[0.62rem] font-bold leading-none text-ivory">
      {children}
    </span>
  );
}
