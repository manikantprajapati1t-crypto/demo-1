import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { categories, getCategory } from "../../data/categories";
import { featuredIds, products } from "../../data/products";
import type { SortKey } from "../../context/StoreContext";
import { useStore } from "../../context/StoreContext";
import { Reveal, SplitText } from "../ui/Reveal";
import { ProductCard } from "./ProductCard";
import { cn } from "../../utils/cn";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A – Z" },
];

/** SECTION C — Featured products with filtering, sorting and search */
export function FeaturedProducts() {
  const { category, setCategory, sort, setSort, query, setQuery } = useStore();

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    // With an active search we look across the whole demo catalogue.
    let l = q ? products : products.filter((p) => featuredIds.includes(p.id));
    if (category !== "all") l = l.filter((p) => p.category === category);
    if (q)
      l = l.filter((p) =>
        [p.name, p.blurb, p.material, p.craft, getCategory(p.category).name]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    const sorted = [...l];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category, sort, query]);

  const reset = () => {
    setCategory("all");
    setQuery("");
    setSort("featured");
  };

  return (
    <section id="shop" aria-labelledby="shop-title" className="relative bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-4 flex items-center gap-4 text-terracotta">
                <span className="h-px w-10 bg-terracotta" />
                The Edit
              </p>
            </Reveal>
            <h2 id="shop-title" className="sr-only">Featured handmade products</h2>
            <SplitText as="p" text="Featured *handmade* pieces" className="display-lg font-serif" />
          </div>
          <Reveal className="max-w-md">
            <p className="leading-relaxed text-forest/75">
              Eight pieces chosen for their craft, character and the
              care that went into them. Tap any piece to see how it was made.
            </p>
          </Reveal>
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-col gap-5 border-y border-forest/15 py-5 md:mt-16">
          <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {[{ id: "all" as const, short: "All" }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-all duration-500",
                  category === c.id
                    ? "border-forest bg-forest text-ivory"
                    : "border-forest/20 text-forest hover:border-terracotta hover:text-terracotta",
                )}
              >
                {c.short}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex-1 sm:max-w-sm">
              <span className="sr-only">Search products</span>
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pottery, brass, silk…"
                className="w-full rounded-full border border-forest/20 bg-transparent py-3 pl-11 pr-10 text-sm outline-none transition-colors placeholder:text-forest/40 focus:border-terracotta"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full hover:bg-forest/10"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p aria-live="polite" className="text-sm text-forest/60">
                {list.length} {list.length === 1 ? "piece" : "pieces"}
              </p>
              <label className="relative">
                <span className="sr-only">Sort products</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none rounded-full border border-forest/20 bg-ivory py-3 pl-5 pr-11 text-[0.72rem] font-semibold uppercase tracking-[0.14em] outline-none focus:border-terracotta"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </label>
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-4xl">Nothing here — yet.</p>
            <p className="mt-3 text-forest/70">Try a different search or category.</p>
            <button onClick={reset} className="link-underline mt-6 text-sm font-semibold uppercase tracking-[0.18em]">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
