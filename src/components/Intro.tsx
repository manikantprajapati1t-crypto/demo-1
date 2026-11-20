import { Hand, Leaf, ShieldCheck } from "lucide-react";
import { IMG } from "../data/images";
import { brand } from "../config/brand";
import { scrollToId } from "../lib/gsap";
import { ParallaxImage } from "./ui/ParallaxImage";
import { Reveal, ScrubText, SplitText } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { Mandala, Paisley } from "./ui/Ornaments";

const pillars = [
  {
    icon: Hand,
    title: "Made by hand",
    text: "Shaped, woven, cast or painted by a person — never a production line.",
  },
  {
    icon: ShieldCheck,
    title: "Honest details",
    text: "Material, size, craft and care are listed plainly on every product.",
  },
  {
    icon: Leaf,
    title: "Respect for makers",
    text: "Each craft is credited and its story told — not hidden behind a logo.",
  },
];

/** SECTION A — Brand introduction */
export function Intro() {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="grain relative overflow-hidden bg-ivory py-28 md:py-44"
    >
      <Mandala className="pointer-events-none absolute -left-[22vw] bottom-[8%] h-[60vw] w-[60vw] text-forest/[0.08]" />
      <Paisley
        className="pointer-events-none absolute right-[6%] top-24 hidden h-28 w-24 text-terracotta/60 md:block"
        style={{ ["--r" as string]: "10deg" }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-4 text-terracotta">
              <span className="h-px w-10 bg-terracotta" />
              Our Story
            </p>
            <h2 id="story-title" className="sr-only">
              About {brand.name}
            </h2>
          </Reveal>
          <div className="lg:col-span-9">
            <ScrubText
              className="font-serif text-[2rem] leading-[1.12] text-forest sm:text-5xl md:text-6xl lg:text-[4.4rem]"
              text={`${brand.name} is a home for Indian craft — a place where clay, wood, brass, thread and colour are given their stories back, and every piece you bring home carries the hands that made it.`}
            />
          </div>
        </div>

        <div className="mt-20 grid items-start gap-10 md:mt-32 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ParallaxImage
              src={IMG.clayHands}
              alt="Hands shaping wet clay on a spinning pottery wheel"
              className="aspect-[4/5] rounded-t-[999px] rounded-b-3xl"
              sizes="(min-width:1024px) 40vw, 100vw"
              w={1200}
            />
            <p className="eyebrow mt-4 text-forest/60">Clay · Wheel · Patience</p>
          </div>

          <div className="lg:col-span-4 lg:mt-44">
            <SplitText
              as="h3"
              text="Craft is a *conversation* between hand and material."
              className="display-md"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md leading-[1.8] text-forest/80">
                India's craft traditions are living languages — spoken in
                villages, workshops and courtyards, and handed down by
                example. We tell them slowly and clearly, so the maker is
                never lost between the studio and your home.
              </p>
            </Reveal>
            <ul className="mt-10 space-y-6">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={0.1 * i}>
                  <li className="flex gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest/20 text-terracotta">
                      <p.icon size={20} strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="block font-serif text-2xl">{p.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-forest/70">
                        {p.text}
                      </span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-10">
              <Button
                variant="forest"
                href="#artisans"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("artisans");
                }}
              >
                Meet the artisans
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-3 lg:mt-12">
            <ParallaxImage
              src={IMG.brassDiyas}
              alt="A lit brass diya on a tray, glowing in warm light"
              className="aspect-[3/4] rounded-2xl"
              from="right"
              sizes="(min-width:1024px) 25vw, 100vw"
              w={800}
            />
            <p className="eyebrow mt-4 text-forest/60">Brass · Flame · Ritual</p>
          </div>
        </div>
      </div>
    </section>
  );
}
