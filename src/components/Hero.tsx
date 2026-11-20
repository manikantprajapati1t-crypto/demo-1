import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToId } from "../lib/gsap";
import { IMG } from "../data/images";
import { brand } from "../config/brand";
import { SmartImage } from "./ui/SmartImage";
import { SplitText } from "./ui/Reveal";
import { Button, Magnetic } from "./ui/Button";
import { Mandala, Paisley } from "./ui/Ornaments";
import { useReady } from "./ui/Ready";

const Craft3D = lazy(() => import("./three/Craft3D"));

export function Hero({ onImageLoaded }: { onImageLoaded: () => void }) {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const bgScale = useRef<HTMLDivElement>(null);
  const bgScroll = useRef<HTMLDivElement>(null);
  const bgMouse = useRef<HTMLDivElement>(null);
  const objScroll = useRef<HTMLDivElement>(null);
  const objMouse = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const ready = useReady();

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.set(bg.current, { clipPath: "inset(14% 24% 14% 24% round 48px)" });
      gsap.set(bgScale.current, { scale: 1.45 });
      gsap.set(objMouse.current, { autoAlpha: 0, scale: 0.6, y: 80 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 30 });

      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .to(bg.current, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.9, ease: "expo.inOut" }, 0)
        .to(bgScale.current, { scale: 1.04, duration: 2.8 }, 0)
        .to(objMouse.current, { autoAlpha: 1, scale: 1, y: 0, duration: 2 }, 1)
        .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.12 }, 1.3);

      // scroll parallax
      const st = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(bgScroll.current, { yPercent: 16, ease: "none", scrollTrigger: st });
      gsap.to(objScroll.current, { yPercent: -22, ease: "none", scrollTrigger: st });
      gsap.to(content.current, { yPercent: -14, autoAlpha: 0.1, ease: "none", scrollTrigger: st });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (ready) tl.current?.play();
  }, [ready]);

  // Mouse-follow perspective
  useEffect(() => {
    if (prefersReducedMotion() || !section.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bx = gsap.quickTo(bgMouse.current, "x", { duration: 1.2, ease: "power3.out" });
    const by = gsap.quickTo(bgMouse.current, "y", { duration: 1.2, ease: "power3.out" });
    const ox = gsap.quickTo(".hero-ornament", "x", { duration: 1.4, ease: "power3.out" });
    const oy = gsap.quickTo(".hero-ornament", "y", { duration: 1.4, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      bx(-nx * 28);
      by(-ny * 20);
      ox(nx * 40);
      oy(ny * 30);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      id="top"
      ref={section}
      aria-label="Introduction"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-forest-deep text-ivory"
    >
      {/* Photograph */}
      <div ref={bg} className="absolute inset-0">
        <div ref={bgScroll} className="absolute inset-x-0 -top-[10%] h-[120%]">
          <div ref={bgMouse} className="absolute -inset-6">
            <div ref={bgScale} className="relative h-full w-full">
              <SmartImage
                src={IMG.hero}
                alt="An Indian potter shaping traditional earthenware pots by hand"
                eager
                w={1800}
                sizes="100vw"
                className="h-full w-full object-cover object-center"
                onLoaded={onImageLoaded}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest/55 to-forest/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-forest-deep/50" />
      </div>

      {/* Decorative floating elements */}
      <div aria-hidden="true" className="hero-ornament pointer-events-none absolute inset-0">
        <Mandala className="absolute -right-[18vw] top-[8%] h-[62vw] w-[62vw] text-ivory/15 md:-right-[8vw] md:top-[6%] md:h-[44vw] md:w-[44vw] md:text-ivory/20" />
        <Paisley className="absolute left-[7%] top-[22%] hidden h-24 w-20 text-terracotta/70 md:block" style={{ ["--r" as string]: "-12deg" }} />
        <Paisley className="absolute bottom-[26%] right-[44%] hidden h-14 w-12 text-ivory/30 lg:block" style={{ ["--r" as string]: "20deg", animationDelay: "-3s" }} />
      </div>

      {/* Floating 3D handicraft object */}
      <div ref={objScroll} className="pointer-events-none absolute right-[-6vw] top-[10%] h-[52vw] w-[52vw] min-h-[250px] min-w-[250px] md:right-[3vw] md:top-[12%] md:h-[min(46vw,78vh)] md:w-[min(46vw,78vh)]">
        <div ref={objMouse} className="h-full w-full">
          <Suspense fallback={null}>
            <Craft3D
              variant="pot"
              followPointer
              label="A rotating 3D model of a hand-painted terracotta pot"
              className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]"
            />
          </Suspense>
        </div>
      </div>

      {/* Copy */}
      <div ref={content} className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-[1500px] px-5 pb-24 md:px-10 md:pb-28">
          <p className="hero-fade eyebrow mb-5 flex items-center gap-4 text-ivory/85 md:mb-7">
            <span className="h-px w-10 bg-terracotta md:w-16" />
            {brand.name} · {brand.tagline}
          </p>
          <h1 className="display-xl max-w-[16ch] text-ivory">
            <SplitText as="span" text="Every Creation" trigger="hero" delay={0.9} className="block" />
            <SplitText as="span" text="Has A *Story.*" trigger="hero" delay={1.1} className="block" accentClassName="italic text-terracotta" />
          </h1>
          <p className="hero-fade mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-ivory/85 md:mt-8 md:text-lg">
            Discover the beauty of Indian craftsmanship, where generations of tradition meet timeless design.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <Magnetic>
              <Button
                href="#collections"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("collections");
                }}
              >
                Explore Collection
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                variant="outline"
                href="#story"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("story");
                }}
              >
                Our Story
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToId("story")}
        aria-label="Scroll to the story"
        className="hero-fade absolute bottom-6 right-5 z-10 flex flex-col items-center gap-3 text-ivory/80 md:bottom-8 md:right-10"
      >
        <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-14 w-px overflow-hidden bg-ivory/25">
          <span className="animate-scroll-line absolute inset-0 bg-terracotta" />
        </span>
      </button>
    </section>
  );
}
