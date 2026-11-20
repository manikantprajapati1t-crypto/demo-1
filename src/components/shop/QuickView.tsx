import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Minus, Plus, ShoppingBag, Truck, X, Undo2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getProduct } from "../../data/products";
import type { Product } from "../../data/products";
import { getCategory } from "../../data/categories";
import { brand, formatINR, whatsappLink } from "../../config/brand";
import { SmartImage } from "../ui/SmartImage";
import { Button } from "../ui/Button";
import { useEscape, useLockBody } from "../../hooks/useOverlay";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { cn } from "../../utils/cn";

export function QuickView() {
  const { quickViewId, openQuickView } = useStore();
  const product = quickViewId ? getProduct(quickViewId) : undefined;
  const close = () => openQuickView(null);
  useLockBody(!!product);
  useEscape(!!product, close);

  return (
    <AnimatePresence>
      {product && <Dialog key={product.id} product={product} onClose={close} />}
    </AnimatePresence>
  );
}

function Dialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toggleWish, isWished, openDrawer } = useStore();
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  const wished = isWished(product.id);

  const specs: [string, string][] = [
    ["Material", product.material],
    ["Size", product.size],
    ["Craft", product.craft],
    ["Care", product.care],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-forest-deep/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-ivory shadow-2xl sm:rounded-3xl md:grid-cols-2"
      >
        <button
          data-autofocus
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-forest shadow transition-transform hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div
          className="photo-tint relative aspect-[4/3] cursor-zoom-in overflow-hidden bg-ivory-dark md:aspect-auto md:min-h-[560px]"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onPointerLeave={() => setZoom(null)}
        >
          <SmartImage
            src={product.image}
            alt={product.alt}
            w={1200}
            sizes="(min-width:768px) 50vw, 100vw"
            eager
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out"
            style={{
              transform: zoom ? "scale(1.7)" : "scale(1)",
              transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
            }}
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em]">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col p-6 md:p-10">
          <p className="eyebrow text-terracotta">{getCategory(product.category).name}</p>
          <h2 className="mt-3 pr-10 font-serif text-4xl leading-[1.02] md:text-5xl">{product.name}</h2>
          <p className="mt-4 font-serif text-3xl tabular-nums">{formatINR(product.price)}</p>
          <p className="mt-1 text-xs text-forest/60">Inclusive of taxes · demo pricing</p>
          <p className="mt-6 leading-[1.75] text-forest/80">{product.description}</p>

          <dl className="mt-6 divide-y divide-forest/10 border-y border-forest/10 text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 py-3">
                <dt className="eyebrow pt-0.5 text-[0.62rem] text-forest/55">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-forest/25" role="group" aria-label="Quantity">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-forest/5">
                <Minus size={16} />
              </button>
              <span aria-live="polite" className="w-8 text-center font-semibold tabular-nums">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-forest/5">
                <Plus size={16} />
              </button>
            </div>
            <Button
              className="flex-1"
              icon={false}
              onClick={() => {
                addToCart(product.id, qty);
                onClose();
                window.setTimeout(() => openDrawer("bag"), 350);
              }}
            >
              <ShoppingBag size={16} /> Add to bag
            </Button>
            <button
              onClick={() => toggleWish(product.id)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest/25 transition-colors hover:border-terracotta"
            >
              <Heart size={18} className={cn(wished && "fill-terracotta text-terracotta")} />
            </button>
          </div>

          <div className="mt-6 grid gap-3 text-xs text-forest/70 sm:grid-cols-2">
            <p className="flex items-start gap-2"><Truck size={15} className="mt-0.5 shrink-0 text-terracotta" /> {brand.policies.shippingNote}</p>
            <p className="flex items-start gap-2"><Undo2 size={15} className="mt-0.5 shrink-0 text-terracotta" /> {brand.policies.returnDays}-day returns (placeholder policy)</p>
          </div>
          <a
            href={whatsappLink(`Hello! I'm interested in "${product.name}" (${formatINR(product.price)}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-5 inline-flex w-fit items-center gap-2 pb-0.5 text-sm font-semibold text-forest"
          >
            <MessageCircle size={16} className="text-terracotta" /> Ask about this piece on WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
