import { ArrowUpRight } from "lucide-react";
import { IMG } from "../data/images";
import { brand } from "../config/brand";
import { SmartImage } from "./ui/SmartImage";
import { Reveal, SplitText } from "./ui/Reveal";
import { InstagramIcon } from "./ui/SocialIcons";
import { cn } from "../utils/cn";

const captions = [
  "Rows of handmade terracotta pots at an Indian market",
  "A lit brass diya glowing on a tray",
  "Silver earrings set with green gemstones",
  "Colourful handmade bead necklaces on display",
  "A craftsman carving a stone statue in Udaipur",
  "An artisan carving wooden sculptures in his workshop",
  "Coloured threads drawn across a handloom",
  "Pottery and clay figurines on display in Vadodara",
];

/** SECTION I — Social-media-inspired image grid */
export function InstaGallery() {
  return (
    <section id="community" aria-labelledby="community-title" className="relative bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-4 flex items-center gap-4 text-terracotta">
                <span className="h-px w-10 bg-terracotta" /> Community
              </p>
            </Reveal>
            <h2 id="community-title" className="sr-only">Follow the craft on Instagram</h2>
            <SplitText as="p" text="Follow the *craft* daily" className="display-lg font-serif" />
          </div>
          <Reveal>
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-lg font-semibold">
              <InstagramIcon size={22} className="text-terracotta" />
              <span className="link-underline pb-0.5">{brand.handle}</span>
              <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2.5 md:mt-16 md:grid-cols-4 md:gap-4">
          {IMG.insta.map((src, i) => (
            <Reveal key={src + i} y={50} delay={(i % 4) * 0.07} className={cn(i === 0 ? "col-span-2 row-span-2" : "")}>
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${captions[i]} — view on Instagram`}
                className="group photo-tint relative block aspect-square h-full w-full overflow-hidden rounded-xl bg-ivory-dark md:rounded-2xl"
              >
                <SmartImage
                  src={src}
                  alt={captions[i]}
                  w={i === 0 ? 1000 : 600}
                  sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.12]"
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest/60 text-ivory opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <InstagramIcon size={30} />
                  <span className="eyebrow text-[0.6rem]">View on Instagram</span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal y={50} delay={0.2}>
            <a
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex aspect-square h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-terracotta p-4 text-center text-ivory transition-colors duration-500 hover:bg-forest md:rounded-2xl"
            >
              <InstagramIcon size={34} />
              <span className="font-serif text-xl leading-tight md:text-3xl">Join the story</span>
              <span className="eyebrow text-[0.6rem]">{brand.handle}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
