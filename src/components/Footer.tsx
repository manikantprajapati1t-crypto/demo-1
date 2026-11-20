import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { brand, whatsappLink } from "../config/brand";
import { categories } from "../data/categories";
import { scrollToId } from "../lib/gsap";
import { useStore } from "../context/StoreContext";
import { LogoMark, NAV_LINKS } from "./Navbar";
import { Button, Magnetic } from "./ui/Button";
import { FacebookIcon, InstagramIcon, PinterestIcon, YoutubeIcon } from "./ui/SocialIcons";

const socials = [
  { label: "Instagram", href: brand.social.instagram, icon: InstagramIcon },
  { label: "Facebook", href: brand.social.facebook, icon: FacebookIcon },
  { label: "YouTube", href: brand.social.youtube, icon: YoutubeIcon },
  { label: "Pinterest", href: brand.social.pinterest, icon: PinterestIcon },
];

/** SECTION J (part 2) — Footer, contact CTA, policies */
export function Footer() {
  const { goToCategory, setPolicy } = useStore();
  const policies = [
    ["shipping", "Shipping"],
    ["returns", "Returns & Exchanges"],
    ["care", "Care Guide"],
    ["custom", "Custom Orders"],
  ] as const;

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest-deep text-ivory">
      {/* Contact CTA */}
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-24 md:px-10 md:pt-32">
        <div className="grid items-end gap-10 border-b border-ivory/15 pb-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-4 text-terracotta">
              <span className="h-px w-10 bg-terracotta" /> Get in touch
            </p>
            <h2 className="display-lg font-serif">
              Looking for something <em className="text-terracotta">one of a kind?</em>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-ivory/70">
              Gifting, custom commissions or questions about a piece — we'd love to hear from you.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Magnetic>
              <Button href={whatsappLink()} external icon={false}>
                <MessageCircle size={17} /> WhatsApp us
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="outline" href={`mailto:${brand.contact.email}`} icon={false}>
                <Mail size={17} /> Email
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-9 w-9 text-terracotta" />
              <span className="font-serif text-3xl font-semibold tracking-[0.26em]">{brand.name}</span>
            </div>
            <p className="eyebrow mt-3 text-[0.6rem] text-ivory/60">{brand.tagline}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">{brand.description}</p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brand.name} on ${s.label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 transition-all duration-500 hover:border-terracotta hover:bg-terracotta"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop by craft">
            <h3 className="eyebrow mb-5 font-sans text-terracotta">Shop</h3>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <button onClick={() => goToCategory(c.id)} className="link-underline pb-0.5 text-ivory/80 hover:text-ivory">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-12">
            <nav aria-label="Explore">
              <h3 className="eyebrow mb-5 font-sans text-terracotta">Explore</h3>
              <ul className="space-y-3 text-sm">
                {NAV_LINKS.filter((l) => l.id !== "contact").map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollToId(l.id); }} className="link-underline pb-0.5 text-ivory/80 hover:text-ivory">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="eyebrow mb-5 font-sans text-terracotta">Help</h3>
            <ul className="space-y-3 text-sm">
              {policies.map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => setPolicy(id)} className="link-underline pb-0.5 text-ivory/80 hover:text-ivory">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3 text-sm text-ivory/70">
              <li className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-terracotta" /> <a className="link-underline" href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></li>
              <li className="flex items-start gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-terracotta" /> <a className="link-underline" href={`tel:${brand.contact.phoneHref}`}>{brand.contact.phone}</a></li>
              <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" /> {brand.contact.address}</li>
            </ul>
            <p className="mt-3 text-xs text-ivory/45">{brand.contact.hours}</p>
          </div>
        </div>

        {/* Wordmark */}
        <p aria-hidden="true" className="outline-text select-none text-center font-serif text-[22vw] font-medium leading-[0.8] tracking-[0.04em] text-ivory/20 md:text-[19vw]">
          {brand.name}
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ivory/15 pt-6 text-xs text-ivory/55 md:flex-row">
          <p>© {new Date().getFullYear()} {brand.name}. {brand.demoNotice}</p>
          <button onClick={() => scrollToId("top")} className="group flex items-center gap-2 font-semibold uppercase tracking-[0.18em] hover:text-ivory">
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-terracotta group-hover:bg-terracotta">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
