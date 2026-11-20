import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, Heart, Plus } from "lucide-react";
import type { Product } from "../../data/products";
import { getCategory } from "../../data/categories";
import { formatINR } from "../../config/brand";
import { useStore } from "../../context/StoreContext";
import { useTilt } from "../../hooks/useTilt";
import { SmartImage } from "../ui/SmartImage";
import { cn } from "../../utils/cn";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openQuickView, addToCart, toggleWish, isWished } = useStore();
  const tilt = useTilt<HTMLDivElement>(8);
  const [added, setAdded] = useState(false);
  const wished = isWished(product.id);

  const add = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
      aria-label={product.name}
    >
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        style={{ transition: "transform .3s ease-out", transformStyle: "preserve-3d" }}
        className="group"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory-dark shadow-[0_1px_0_rgba(24,60,50,0.06)] transition-shadow duration-500 group-hover:shadow-[0_30px_50px_-20px_rgba(24,60,50,0.4)]">
          <button
            onClick={() => openQuickView(product.id)}
            data-cursor="View"
            aria-label={`Quick view: ${product.name}`}
            className="photo-tint absolute inset-0 block overflow-hidden"
          >
            <SmartImage
              src={product.image}
              alt={product.alt}
              w={800}
              sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.1]"
            />
          </button>
          <div ref={tilt.glare} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />

          {product.badge && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ivory/95 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-forest">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => toggleWish(product.id)}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-forest shadow-sm transition-transform duration-300 hover:scale-110"
          >
            <motion.span key={String(wished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }} className="flex">
              <Heart size={18} className={cn(wished && "fill-terracotta text-terracotta")} />
            </motion.span>
          </button>

          <button
            onClick={() => openQuickView(product.id)}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-x-3 bottom-3 hidden translate-y-[130%] items-center justify-center gap-2 rounded-full bg-forest/95 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory opacity-0 backdrop-blur transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 md:flex"
          >
            <Eye size={15} /> Quick view
          </button>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-[0.62rem] text-terracotta">{getCategory(product.category).short}</p>
            <h3 className="mt-1.5 font-serif text-[1.3rem] leading-tight md:text-2xl">{product.name}</h3>
            <p className="mt-1.5 text-sm font-semibold tabular-nums text-forest/80">{formatINR(product.price)}</p>
          </div>
          <button
            onClick={add}
            aria-label={`Add ${product.name} to bag`}
            className={cn(
              "mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
              added
                ? "border-forest bg-forest text-ivory"
                : "border-forest/25 text-forest hover:border-terracotta hover:bg-terracotta hover:text-ivory",
            )}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
