import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { testimonials } from "../data/content";
import { Reveal, SplitText } from "./ui/Reveal";
import { useReducedMotion } from "../hooks/useMedia";
import { cn } from "../utils/cn";

/** SECTION H — Testimonial slider (clearly illustrative demo copy) */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = testimonials.length;

  const go = (next: number) => {
    setDir(next > i || (i === n - 1 && next === 0) ? 1 : -1);
    setI((next + n) % n);
  };

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => {
      setDir(1);
      setI((v) => (v + 1) % n);
    }, 7000);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce, n]);

  const t = testimonials[i];

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden bg-ivory-dark py-24 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -left-4 -top-10 font-serif text-[22rem] leading-none text-terracotta/10 md:left-[6%] md:text-[32rem]">
        “
      </span>
      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-10">
        <Reveal>
          <p className="eyebrow inline-flex items-center gap-4 text-terracotta">
            <span className="h-px w-10 bg-terracotta" /> Kind Words
            <span className="h-px w-10 bg-terracotta" />
          </p>
        </Reveal>
        <h2 id="reviews-title" className="sr-only">Customer testimonials</h2>
        <SplitText as="p" text="Pieces that found *their* homes" className="display-md mt-5 font-serif" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 inline-block rounded-full border border-forest/20 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest/60">
            Illustrative demo reviews — replace with verified customer feedback
          </p>
        </Reveal>

        <div className="relative mt-14 min-h-[360px] md:min-h-[320px]" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Quote size={30} className="mx-auto text-terracotta" />
              <div className="mt-5 flex justify-center gap-1" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={16} className={cn(s < t.rating ? "fill-terracotta text-terracotta" : "text-forest/25")} />
                ))}
              </div>
              <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-[1.65rem] leading-[1.28] md:text-4xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8">
                <span className="font-semibold">{t.name}</span>
                <span className="text-forest/60"> · {t.place}</span>
                <span className="mt-1 block text-sm text-terracotta">on {t.product}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button onClick={() => go(i - 1)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 transition-colors hover:bg-forest hover:text-ivory">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((x, k) => (
              <button
                key={x.name}
                onClick={() => go(k)}
                aria-label={`Show testimonial ${k + 1}`}
                aria-current={k === i}
                className="group flex h-8 items-center"
              >
                <span className={cn("block h-[3px] rounded-full transition-all duration-500", k === i ? "w-10 bg-terracotta" : "w-5 bg-forest/25 group-hover:bg-forest/50")} />
              </button>
            ))}
          </div>
          <button onClick={() => go(i + 1)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 transition-colors hover:bg-forest hover:text-ivory">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
