import { lazy, Suspense, useState } from "react";
import { Eye, MoveHorizontal } from "lucide-react";
import { Reveal, SplitText } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { Mandala } from "./ui/Ornaments";
import { useStore } from "../context/StoreContext";
import { getProduct } from "../data/products";
import { formatINR } from "../config/brand";
import { cn } from "../utils/cn";
import type { CraftVariant } from "./three/Craft3D";

const Craft3D = lazy(() => import("./three/Craft3D"));

const OBJECTS: Record<
  CraftVariant,
  { tab: string; productId: string; title: string; text: string; facts: string[] }
> = {
  pot: {
    tab: "Hand-painted Pot",
    productId: "bundi-urn",
    title: "A pot that remembers the hand.",
    text: "Banded with triangles, dots and lines in the spirit of Rajasthani slip painting. Turn it — the pattern never repeats the same way twice.",
    facts: ["Wheel-thrown clay", "Slip-painted bands", "Kiln fired"],
  },
  lamp: {
    tab: "Brass Deepam",
    productId: "brass-deepam",
    title: "A lamp that lights a lineage.",
    text: "Cast in solid brass, its profile hasn't changed in centuries because it didn't need to. Spin it and watch the light travel along every ring.",
    facts: ["Sand-cast brass", "Engraved rings", "Hand polished"],
  },
};

/** Featured 3D section — lightweight Three.js object you can drag. */
export function ObjectStudy() {
  const [variant, setVariant] = useState<CraftVariant>("lamp");
  const { openQuickView, addToCart } = useStore();
  const o = OBJECTS[variant];
  const p = getProduct(o.productId)!;

  return (
    <section
      id="atelier"
      aria-labelledby="atelier-title"
      className="relative overflow-hidden bg-forest py-24 text-ivory md:py-36"
    >
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 text-ivory/[0.06] md:h-[70vw] md:w-[70vw]" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-5 md:px-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-4 text-terracotta">
              <span className="h-px w-10 bg-terracotta" />
              In The Round
            </p>
          </Reveal>
          <h2 id="atelier-title" className="sr-only">
            Explore a handmade object in 3D
          </h2>
          <SplitText key={variant} as="p" text={o.title} className="display-lg font-serif" accentClassName="italic text-terracotta" />
          <p className="mt-6 max-w-lg leading-[1.8] text-ivory/75">{o.text}</p>

          <div role="group" aria-label="Choose an object" className="mt-8 inline-flex rounded-full border border-ivory/20 p-1">
            {(Object.keys(OBJECTS) as CraftVariant[]).map((k) => (
              <button
                key={k}
                aria-pressed={variant === k}
                onClick={() => setVariant(k)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500",
                  variant === k ? "bg-terracotta text-ivory" : "text-ivory/70 hover:text-ivory",
                )}
              >
                {OBJECTS[k].tab}
              </button>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {o.facts.map((f) => (
              <li key={f} className="rounded-full border border-ivory/20 px-4 py-2 text-xs tracking-wider text-ivory/80">
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="terracotta" onClick={() => addToCart(p.id)} icon={false}>
              Add to bag · {formatINR(p.price)}
            </Button>
            <Button variant="outline" onClick={() => openQuickView(p.id)} icon={false}>
              <Eye size={16} /> Quick view
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            data-cursor="Drag"
            className="relative mx-auto aspect-square w-full max-w-[640px] cursor-grab active:cursor-grabbing"
          >
            <Suspense fallback={null}>
              <Craft3D
                key={variant}
                variant={variant}
                interactive
                label={`Interactive 3D model of a handmade ${o.tab}. Drag to rotate.`}
                className="h-full w-full"
              />
            </Suspense>
            <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-8 w-[55%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-2xl" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ivory/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ivory/80 backdrop-blur">
              <MoveHorizontal size={14} /> Drag to rotate
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
