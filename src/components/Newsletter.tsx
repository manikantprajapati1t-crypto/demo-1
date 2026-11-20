import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, SplitText } from "./ui/Reveal";
import { Mandala } from "./ui/Ornaments";
import { brand } from "../config/brand";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** SECTION J (part 1) — Newsletter with validation */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your email address.");
    if (!EMAIL.test(email.trim())) return setError("That doesn't look like a valid email — please check it.");
    setError("");
    setDone(true);
  };

  return (
    <section aria-labelledby="news-title" className="grain relative overflow-hidden bg-terracotta py-24 text-ivory md:py-32">
      <Mandala className="pointer-events-none absolute -right-[12vw] top-1/2 h-[55vw] w-[55vw] -translate-y-1/2 text-ivory/15" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-ivory" /> The Karigar Letter
            </p>
          </Reveal>
          <h2 id="news-title" className="sr-only">Newsletter</h2>
          <SplitText as="p" text="Stories from the *workshop,* in your inbox." className="display-lg font-serif" accentClassName="italic text-forest" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-ivory/90">
              New pieces, maker stories and the occasional behind-the-scenes
              glimpse. Thoughtful, occasional and easy to leave.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-ivory p-8 text-forest md:p-10"
              >
                <CheckCircle2 size={34} className="text-terracotta" />
                <p className="mt-4 font-serif text-3xl">Thank you — that's a valid address.</p>
                <p className="mt-2 text-sm text-forest/70">
                  This is a demo form: nothing was sent or stored. {brand.demoNotice}
                </p>
                <button onClick={() => { setDone(false); setEmail(""); }} className="link-underline mt-5 text-sm font-semibold">
                  Try another address
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
                <label htmlFor="news-email" className="eyebrow text-ivory/90">Email address</label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="news-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="you@example.com"
                    aria-invalid={!!error}
                    aria-describedby="news-msg"
                    className="min-w-0 flex-1 rounded-full border border-ivory/50 bg-transparent px-6 py-4 text-ivory outline-none transition-colors placeholder:text-ivory/60 focus:border-ivory focus:bg-ivory/10"
                  />
                  <button type="submit" className="group flex items-center justify-center gap-3 rounded-full bg-forest px-8 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-forest">
                    Subscribe
                    <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
                <p id="news-msg" role="alert" className="mt-3 min-h-[1.5rem] text-sm font-medium text-ivory">
                  {error}
                </p>
                <p className="text-xs text-ivory/75">By subscribing you'd agree to receive occasional emails. Demo form only.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
