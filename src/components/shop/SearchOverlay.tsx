import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { products } from "../../data/products";
import { categories, getCategory } from "../../data/categories";
import { formatINR } from "../../config/brand";
import { useStore } from "../../context/StoreContext";
import { SmartImage } from "../ui/SmartImage";
import { useEscape, useLockBody } from "../../hooks/useOverlay";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const close = () => setSearchOpen(false);
  useLockBody(searchOpen);
  useEscape(searchOpen, close);
  return <AnimatePresence>{searchOpen && <Sheet onClose={close} />}</AnimatePresence>;
}

function Sheet({ onClose }: { onClose: () => void }) {
  const { openQuickView, showInShop, goToCategory } = useStore();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products.filter((p) =>
      [p.name, p.blurb, p.material, p.craft, getCategory(p.category).name].join(" ").toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <motion.div className="fixed inset-0 z-[88]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search the collection"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[90svh] overflow-y-auto bg-ivory px-5 pb-10 pt-6 shadow-2xl md:px-10"
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 border-b-2 border-forest pb-3">
            <Search size={26} className="shrink-0 text-terracotta" />
            <input
              data-autofocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim()) showInShop(q.trim());
              }}
              placeholder="Search the collection…"
              aria-label="Search products"
              className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-forest/35 md:text-5xl"
            />
            <button onClick={onClose} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-forest/10">
              <X size={22} />
            </button>
          </div>

          {!q.trim() ? (
            <div className="mt-8">
              <p className="eyebrow text-forest/55">Browse by craft</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onClose();
                      window.setTimeout(() => goToCategory(c.id), 350);
                    }}
                    className="rounded-full border border-forest/20 px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-terracotta hover:text-terracotta"
                  >
                    {c.short}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6" aria-live="polite">
              <p className="eyebrow text-forest/55">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              {results.length === 0 ? (
                <p className="py-10 font-serif text-3xl text-forest/70">No pieces match “{q}”.</p>
              ) : (
                <ul className="mt-3 divide-y divide-forest/10">
                  {results.slice(0, 6).map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          onClose();
                          window.setTimeout(() => openQuickView(p.id), 350);
                        }}
                        className="group flex w-full items-center gap-5 py-3 text-left"
                      >
                        <span className="photo-tint relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ivory-dark">
                          <SmartImage src={p.image} alt={p.alt} w={200} sizes="64px" className="h-full w-full object-cover" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-serif text-2xl leading-tight transition-colors group-hover:text-terracotta">{p.name}</span>
                          <span className="text-xs uppercase tracking-[0.16em] text-forest/55">{getCategory(p.category).short}</span>
                        </span>
                        <span className="font-semibold tabular-nums">{formatINR(p.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {results.length > 0 && (
                <button onClick={() => showInShop(q.trim())} className="link-underline mt-5 inline-flex items-center gap-3 pb-1 text-sm font-semibold uppercase tracking-[0.18em]">
                  View all in the shop <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
