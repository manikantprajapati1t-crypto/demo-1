import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToId } from "../lib/gsap";
import { IMG } from "../data/images";
import { SmartImage } from "./ui/SmartImage";
import { Reveal, SplitText } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { Paisley } from "./ui/Ornaments";

/** SECTION G — Heritage banner. The photograph expands to full-bleed on scroll. */
export function Heritage() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { clipPath: "inset(12% 8% 12% 8% round 40px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 95%", end: "top 15%", scrub: true },
        },
      );
      gsap.fromTo(
        inner.current,
        { yPercent: -9, scale: 1.18 },
        {
          yPercent: 9,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="heritage"
      ref={section}
      aria-labelledby="heritage-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-forest py-24 text-ivory"
    >
      <div ref={frame} className="absolute inset-0 bg-forest-deep">
        <div ref={inner} className="absolute inset-x-0 -top-[10%] h-[120%]">
          <SmartImage
            src={IMG.heritage}
            alt="An elderly Indian artisan shaping a clay pot on an outdoor pottery wheel"
            w={1800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/80 via-forest/50 to-forest-deep/90" />
      </div>

      <Paisley className="pointer-events-none absolute left-[6%] top-[14%] hidden h-28 w-24 text-terracotta/70 md:block" style={{ ["--r" as string]: "-8deg" }} />
      <Paisley className="pointer-events-none absolute bottom-[16%] right-[7%] hidden h-20 w-16 text-ivory/30 md:block" style={{ ["--r" as string]: "16deg", animationDelay: "-2s" }} />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 text-center md:px-10">
        <Reveal>
          <p className="eyebrow inline-flex items-center gap-4 text-ivory/85">
            <span className="h-px w-10 bg-terracotta" /> Heritage Experience
            <span className="h-px w-10 bg-terracotta" />
          </p>
        </Reveal>
        <h2 id="heritage-title" className="sr-only">More than art. A legacy of generations.</h2>
        <SplitText
          as="p"
          text="More Than Art. A Legacy Of *Generations.*"
          className="display-xl mx-auto mt-8 max-w-[14ch] font-serif md:max-w-[17ch]"
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ivory/85">
            Behind every wheel, loom and chisel is a lineage — skills taught by
            watching, perfected by repeating, and carried forward by choosing to
            keep making.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="terracotta" href="#artisans" onClick={(e) => { e.preventDefault(); scrollToId("artisans"); }}>
            Meet the makers
          </Button>
          <Button variant="outline" href="#shop" onClick={(e) => { e.preventDefault(); scrollToId("shop"); }}>
            Shop the collection
          </Button>
        </Reveal>

        <ul className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 border-t border-ivory/20 pt-8 text-center md:mt-24">
          {["Made by hand", "Made with intention", "Made to last"].map((t) => (
            <li key={t} className="font-serif text-xl italic text-ivory/90 md:text-3xl">{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
