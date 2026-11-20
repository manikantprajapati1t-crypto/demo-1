import { useLayoutEffect, useRef } from "react";
import { processStages } from "../data/content";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { ParallaxImage } from "./ui/ParallaxImage";
import { Reveal, SplitText } from "./ui/Reveal";
import { cn } from "../utils/cn";

/** SECTION E — The making process: scroll-driven timeline */
export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrap.current) return;
    const triggers: ScrollTrigger[] = [];
    let ctx: gsap.Context | undefined;
    const reduce = prefersReducedMotion();
    ctx = gsap.context(() => {
      if (!reduce) {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start: "top 60%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>(".stage-text").forEach((el) => {
          gsap.from(el.children, {
            y: 50,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        });
      } else if (line.current) {
        line.current.style.transform = "scaleY(1)";
      }
    }, wrap);
    wrap.current.querySelectorAll<HTMLElement>(".stage").forEach((row) => {
      const dot = row.querySelector<HTMLElement>(".stage-dot");
      triggers.push(
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          onEnter: () => dot?.classList.add("is-active"),
          onLeaveBack: () => dot?.classList.remove("is-active"),
        }),
      );
    });
    return () => {
      triggers.forEach((t) => t.kill());
      ctx?.revert();
    };
  }, []);

  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-hidden bg-ivory-dark py-24 md:py-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-4 text-terracotta">
              <span className="h-px w-10 bg-terracotta" /> The Making Process
              <span className="h-px w-10 bg-terracotta" />
            </p>
          </Reveal>
          <h2 id="process-title" className="sr-only">From design to masterpiece</h2>
          <SplitText as="p" text="From a first sketch to a *masterpiece.*" className="display-lg mt-6 font-serif" />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-forest/75">
              Four slow, deliberate stages. Nothing rushed, nothing automated —
              and every one of them leaves a trace in the finished piece.
            </p>
          </Reveal>
        </div>

        <div ref={wrap} className="relative mt-20 md:mt-32">
          {/* timeline rail */}
          <div aria-hidden="true" className="absolute bottom-0 left-[15px] top-0 w-px bg-forest/15 md:left-1/2">
            <div ref={line} className="h-full w-full origin-top bg-terracotta" style={{ width: 2, marginLeft: -0.5 }} />
          </div>

          <ol className="space-y-24 md:space-y-40">
            {processStages.map((s, i) => (
              <li key={s.no} className="stage relative pl-12 md:pl-0">
                <span
                  aria-hidden="true"
                  className="stage-dot absolute left-[15px] top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-forest/40 bg-ivory-dark transition-all duration-700 md:left-1/2 md:top-1/2 md:-translate-y-1/2 [&.is-active]:scale-150 [&.is-active]:border-terracotta [&.is-active]:bg-terracotta"
                />
                <div className={cn("grid items-center gap-8 md:grid-cols-2 md:gap-28", i % 2 === 1 && "md:[direction:rtl]")}>
                  <div className="stage-text md:[direction:ltr] md:px-0">
                    <span className="outline-text block font-serif text-[6rem] leading-none text-forest/50 md:text-[9rem]">{s.no}</span>
                    <h3 className="display-md -mt-2 md:-mt-4">{s.title}</h3>
                    <p className="mt-5 max-w-md leading-[1.8] text-forest/75">{s.text}</p>
                    <p className="eyebrow mt-6 text-terracotta">{s.note}</p>
                  </div>
                  <div className="md:[direction:ltr]">
                    <ParallaxImage
                      src={s.image}
                      alt={s.alt}
                      className={cn("aspect-[4/3] rounded-3xl", i % 2 === 1 ? "md:rounded-tl-[8rem]" : "md:rounded-tr-[8rem]")}
                      sizes="(min-width:768px) 45vw, 100vw"
                      w={1200}
                      from={i % 2 === 1 ? "right" : "left"}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
