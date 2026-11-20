import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { gsap } from "../lib/gsap";
import { useStore } from "../context/StoreContext";
import { SmartImage } from "./ui/SmartImage";
import { Reveal, SplitText } from "./ui/Reveal";

/** SECTION B — Explore collections (pinned horizontal gallery on desktop,
 *  native snap-scroll on tablet / mobile). */
export function Collections() {
  const { goToCategory } = useStore();
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      t.querySelectorAll<HTMLElement>(".cat-parallax").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
      if (wrap.current) wrap.current.style.overflow = "visible";
      return () => {
        if (wrap.current) wrap.current.style.overflow = "";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={section}
      aria-labelledby="collections-title"
      className="relative overflow-hidden bg-ivory-dark py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0 lg:pt-20"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-col justify-between gap-6 px-5 pb-8 md:px-10 lg:flex-row lg:items-end lg:pb-8">
        <div>
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-4 text-terracotta">
              <span className="h-px w-10 bg-terracotta" />
              Explore Collections
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="Six crafts. *Endless* stories."
            className="display-lg"
          />
        </div>
        <Reveal className="max-w-sm">
          <p className="leading-relaxed text-forest/75">
            Each collection is a living tradition. Scroll to wander through
            them, then step inside the one that calls to you.
          </p>
        </Reveal>
      </div>

      <div ref={wrap} className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-visible">
        <div ref={track} className="flex w-max gap-5 px-5 pb-4 md:gap-7 md:px-10 lg:pr-[10vw]">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <article
                key={c.id}
                className="relative h-[58vh] min-h-[420px] w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:h-[min(60vh,600px)] lg:w-[28vw] xl:w-[25vw]"
              >
                <button
                  onClick={() => goToCategory(c.id)}
                  data-cursor="Explore"
                  aria-label={`Explore ${c.name}`}
                  className="group relative block h-full w-full overflow-hidden rounded-t-[999px] rounded-b-3xl bg-forest text-left text-ivory"
                >
                  <div className="cat-parallax absolute -inset-x-[9%] inset-y-0">
                    <SmartImage
                      src={c.image}
                      alt={c.alt}
                      w={900}
                      sizes="(min-width:1024px) 30vw, 80vw"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.12]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest/20 to-transparent transition-opacity duration-700 group-hover:from-forest-deep" />
                  <div className="absolute inset-0 rounded-t-[999px] rounded-b-3xl ring-1 ring-inset ring-ivory/10 transition-all duration-700 group-hover:ring-terracotta/70" />

                  <span className="eyebrow absolute left-1/2 top-[18%] -translate-x-1/2 text-ivory/80">
                    {String(i + 1).padStart(2, "0")} / 06
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="eyebrow mb-3 text-terracotta">{count} pieces in the demo edit</p>
                    <h3 className="font-serif text-[2rem] leading-[1] md:text-4xl">{c.name}</h3>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="max-w-[16rem] text-sm leading-relaxed text-ivory/80">
                        {c.tagline}
                      </p>
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-terracotta text-ivory transition-all duration-500 group-hover:rotate-45 group-hover:bg-ivory group-hover:text-forest">
                        <ArrowUpRight size={22} />
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}

          <article className="flex h-[58vh] min-h-[420px] w-[78vw] shrink-0 snap-start flex-col justify-center rounded-3xl border border-forest/20 p-8 sm:w-[46vw] lg:h-[min(60vh,600px)] lg:w-[24vw]">
            <p className="eyebrow text-terracotta">Can't decide?</p>
            <h3 className="display-md mt-4">Browse the whole edit.</h3>
            <button
              onClick={() => goToCategory("all")}
              className="link-underline mt-8 inline-flex w-fit items-center gap-3 pb-1 text-sm font-semibold uppercase tracking-[0.18em]"
            >
              View all pieces <ArrowUpRight size={16} />
            </button>
          </article>
        </div>
      </div>

      <div className="mx-auto mt-6 hidden w-full max-w-[1500px] items-center gap-6 px-10 lg:flex">
        <span className="eyebrow text-forest/60">Scroll to explore</span>
        <div className="relative h-px flex-1 bg-forest/15">
          <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-terracotta" style={{ height: 2, top: -0.5 }} />
        </div>
      </div>
    </section>
  );
}
