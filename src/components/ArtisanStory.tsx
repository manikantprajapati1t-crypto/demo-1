import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { artisanChapters } from "../data/content";
import { IMG } from "../data/images";
import { ScrollTrigger, gsap, prefersReducedMotion } from "../lib/gsap";
import { ParallaxImage } from "./ui/ParallaxImage";
import { Reveal, SplitText } from "./ui/Reveal";
import { Mandala } from "./ui/Ornaments";
import { cn } from "../utils/cn";

/** SECTION D — The artisan story: layered intro + sticky storytelling */
export function ArtisanStory() {
  const [active, setActive] = useState(0);
  const chapters = useRef<(HTMLElement | null)[]>([]);
  const layered = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const triggers: ScrollTrigger[] = [];
    chapters.current.forEach((el, i) => {
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
    });
    let ctx: gsap.Context | undefined;
    if (!prefersReducedMotion() && layered.current) {
      ctx = gsap.context(() => {
        gsap.to(".layer-small", {
          yPercent: -22,
          ease: "none",
          scrollTrigger: { trigger: layered.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.from(".layer-quote", {
          y: 60,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".layer-quote", start: "top 90%", once: true },
        });
      }, layered);
    }
    return () => {
      triggers.forEach((t) => t.kill());
      ctx?.revert();
    };
  }, []);

  const c = artisanChapters[active];

  return (
    <section
      id="artisans"
      aria-labelledby="artisans-title"
      className="grain relative overflow-clip bg-forest py-24 text-ivory md:py-40"
    >
      <Mandala className="pointer-events-none absolute -right-[20vw] top-[6%] h-[60vw] w-[60vw] text-ivory/[0.05]" />
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal className="text-center">
          <p className="eyebrow inline-flex items-center gap-4 text-terracotta">
            <span className="h-px w-10 bg-terracotta" /> The Artisan Story
            <span className="h-px w-10 bg-terracotta" />
          </p>
        </Reveal>
        <h2 id="artisans-title" className="sr-only">
          Behind every masterpiece, there is a master artisan.
        </h2>
        <SplitText
          as="p"
          text="Behind Every Masterpiece, There Is A *Master Artisan.*"
          className="display-lg mx-auto mt-6 max-w-5xl text-center font-serif"
        />

        {/* Layered editorial intro */}
        <div ref={layered} className="relative mt-20 md:mt-28">
          <div className="grid gap-8 md:grid-cols-12">
            <ParallaxImage
              src={IMG.workshop}
              alt="A Rajasthani artisan spinning clay at his pottery wheel in Jodhpur"
              className="aspect-[4/3] rounded-3xl md:col-span-9"
              sizes="(min-width:768px) 70vw, 100vw"
              w={1800}
              from="left"
            />
            <div className="layer-small relative md:col-span-3 md:mt-40">
              <ParallaxImage
                src={IMG.workshopSmall}
                alt="A potter moulding a clay pot with both hands"
                className="aspect-[3/4] rounded-t-[999px] rounded-b-2xl shadow-2xl ring-8 ring-forest"
                sizes="(min-width:768px) 25vw, 60vw"
                w={800}
                from="top"
              />
            </div>
          </div>
          <div className="layer-quote relative z-10 mt-8 max-w-md rounded-3xl bg-ivory p-8 text-forest shadow-2xl md:absolute md:-bottom-14 md:left-[6%] md:mt-0">
            <Quote size={26} className="text-terracotta" />
            <p className="mt-3 font-serif text-2xl leading-snug">
              Every piece leaves the workshop carrying a little of the person who made it.
            </p>
            <p className="eyebrow mt-4 text-[0.62rem] text-forest/55">Illustrative demo quote</p>
          </div>
        </div>

        {/* Sticky storytelling */}
        <div className="mt-28 grid gap-10 md:mt-48 lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 flex h-[calc(100vh-9rem)] flex-col justify-between">
              <div className="flex items-baseline gap-4">
                <span className="outline-text font-serif text-[9rem] leading-none text-ivory/60">{c.no}</span>
                <span className="eyebrow text-ivory/50">/ 0{artisanChapters.length}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.no}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="eyebrow text-terracotta">{c.craft}</p>
                  <h3 className="display-md mt-3">{c.title}</h3>
                  <p className="mt-5 max-w-md leading-[1.8] text-ivory/75">{c.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.techniques.map((t) => (
                      <li key={t} className="rounded-full border border-ivory/25 px-4 py-2 text-xs tracking-wider text-ivory/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2" aria-hidden="true">
                {artisanChapters.map((_, i) => (
                  <span key={i} className={cn("h-[3px] flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-terracotta" : "bg-ivory/15")} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-20 lg:col-span-7 lg:space-y-0">
            {artisanChapters.map((ch, i) => (
              <article
                key={ch.no}
                ref={(el) => {
                  chapters.current[i] = el;
                }}
                className="lg:flex lg:min-h-[100vh] lg:flex-col lg:justify-center"
              >
                <ParallaxImage
                  src={ch.image}
                  alt={ch.alt}
                  className={cn("aspect-[4/5] rounded-3xl lg:aspect-[5/6]", i % 2 ? "lg:rounded-t-[999px]" : "")}
                  sizes="(min-width:1024px) 55vw, 100vw"
                  w={1400}
                  from={i % 2 ? "top" : "bottom"}
                >
                  <span className="absolute bottom-4 left-4 rounded-full bg-forest-deep/70 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] backdrop-blur">
                    {ch.caption}
                  </span>
                </ParallaxImage>
                <div className="mt-6 lg:hidden">
                  <p className="eyebrow text-terracotta">{ch.no} · {ch.craft}</p>
                  <h3 className="display-md mt-2">{ch.title}</h3>
                  <p className="mt-3 leading-[1.75] text-ivory/75">{ch.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {ch.techniques.map((t) => (
                      <li key={t} className="rounded-full border border-ivory/25 px-3 py-1.5 text-xs text-ivory/85">{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-ivory/45">
          Artisan profiles and photography are illustrative placeholders — replace them with your makers' real stories.
        </p>
      </div>
    </section>
  );
}
