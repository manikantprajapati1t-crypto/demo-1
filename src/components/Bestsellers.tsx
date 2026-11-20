import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Heart, Plus } from "lucide-react";
import { bestsellerIds, getProduct } from "../data/products";
import type { Product } from "../data/products";
import { getCategory } from "../data/categories";
import { formatINR } from "../config/brand";
import { useStore } from "../context/StoreContext";
import { prefersReducedMotion } from "../lib/gsap";
import { SmartImage } from "./ui/SmartImage";
import { Reveal, SplitText } from "./ui/Reveal";
import { cn } from "../utils/cn";

/** SECTION F — Bestsellers: drag + arrows + progress */
export function Bestsellers() {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const [state, setState] = useState({ progress: 0, prev: false, next: true });
  const items = bestsellerIds.map((id) => getProduct(id)!).filter(Boolean);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      progress: max > 0 ? el.scrollLeft / max : 0,
      prev: el.scrollLeft > 4,
      next: el.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const slide = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step * 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { down: true, startX: e.clientX, startLeft: scroller.current.scrollLeft, moved: false };
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };
  const up = () => {
    const el = scroller.current;
    drag.current.down = false;
    if (el) {
      el.style.scrollSnapType = "";
      el.style.cursor = "";
    }
    window.setTimeout(() => (drag.current.moved = false), 0);
  };

  return (
    <section id="bestsellers" aria-labelledby="best-title" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-4 flex items-center gap-4 text-terracotta">
                <span className="h-px w-10 bg-terracotta" /> Bestsellers
              </p>
            </Reveal>
            <h2 id="best-title" className="sr-only">Bestselling handmade pieces</h2>
            <SplitText as="p" text="The pieces *everyone* reaches for" className="display-lg max-w-3xl font-serif" />
            <Reveal delay={0.1}>
              <p className="mt-4 text-xs text-forest/50">Demo ranking — replace with the client's real sales data.</p>
            </Reveal>
          </div>
          <div className="flex gap-3" role="group" aria-label="Carousel controls">
            <button onClick={() => slide(-1)} disabled={!state.prev} aria-label="Previous products" className="flex h-14 w-14 items-center justify-center rounded-full border border-forest/25 transition-all duration-500 hover:bg-forest hover:text-ivory disabled:pointer-events-none disabled:opacity-30">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => slide(1)} disabled={!state.next} aria-label="Next products" className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-ivory transition-all duration-500 hover:bg-terracotta disabled:pointer-events-none disabled:opacity-30">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        data-cursor="Drag"
        onScroll={update}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        tabIndex={0}
        role="region"
        aria-label="Bestsellers carousel — use arrow keys to scroll"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") slide(1);
          if (e.key === "ArrowLeft") slide(-1);
        }}
        className="no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory select-none gap-5 overflow-x-auto px-5 pb-6 md:mt-16 md:gap-6 md:px-10 [scroll-padding-inline:1.25rem] md:[scroll-padding-inline:2.5rem]"
      >
        {items.map((p, i) => (
          <BestCard key={p.id} product={p} rank={i + 1} />
        ))}
        <div className="w-2 shrink-0 md:w-10" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-4 max-w-[1500px] px-5 md:px-10">
        <div className="relative h-px bg-forest/15">
          <div className="absolute left-0 top-[-1px] h-[3px] rounded-full bg-terracotta transition-[width,left] duration-200" style={{ width: "22%", left: `${state.progress * 78}%` }} />
        </div>
      </div>
    </section>
  );
}

function BestCard({ product, rank }: { product: Product; rank: number }) {
  const { openQuickView, addToCart, toggleWish, isWished } = useStore();
  const wished = isWished(product.id);
  return (
    <article data-card className="group w-[72vw] shrink-0 snap-start sm:w-[310px] lg:w-[350px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ivory-dark">
        <button onClick={() => openQuickView(product.id)} aria-label={`Quick view: ${product.name}`} className="photo-tint absolute inset-0 block overflow-hidden">
          <SmartImage src={product.image} alt={product.alt} w={800} sizes="(min-width:1024px) 350px, 72vw" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.1]" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep/70 to-transparent" />
        <span aria-hidden="true" className="outline-text pointer-events-none absolute bottom-1 left-4 font-serif text-[5.5rem] leading-none text-ivory/90">
          {String(rank).padStart(2, "0")}
        </span>
        <button
          onClick={() => toggleWish(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 transition-transform hover:scale-110"
        >
          <Heart size={18} className={cn(wished && "fill-terracotta text-terracotta")} />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-[0.62rem] text-terracotta">{getCategory(product.category).short}</p>
          <h3 className="mt-1.5 font-serif text-2xl leading-tight">{product.name}</h3>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-forest/80">{formatINR(product.price)}</p>
        </div>
        <button onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to bag`} className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest/25 transition-all duration-500 hover:border-terracotta hover:bg-terracotta hover:text-ivory">
          <Plus size={18} />
        </button>
      </div>
    </article>
  );
}
