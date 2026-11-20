import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { brand } from "../../config/brand";
import { useEscape, useLockBody } from "../../hooks/useOverlay";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const content: Record<string, { title: string; body: string[] }> = {
  shipping: {
    title: "Shipping",
    body: [
      brand.policies.shippingNote,
      `Orders above ₹${brand.policies.freeShippingAbove.toLocaleString("en-IN")} ship free (placeholder offer).`,
      "Delivery timelines, carriers and regions served should be added here by the business.",
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    body: [
      `Placeholder policy: unused pieces can be returned within ${brand.policies.returnDays} days of delivery.`,
      "Because every piece is handmade, small variations in colour, grain and finish are natural and are not considered defects.",
      "Add the business's real return conditions and contact process here.",
    ],
  },
  care: {
    title: "Care Guide",
    body: [
      "Clay: wipe with a damp cloth; keep away from sudden temperature changes.",
      "Wood: dust gently; avoid direct sun and damp; oil lightly once a year.",
      "Brass: polish with a soft cloth; a natural patina is part of its character.",
      "Textiles: hand wash in cold water and dry in the shade.",
    ],
  },
  custom: {
    title: "Custom Orders",
    body: [
      "Looking for a commission, bulk gifting or a particular colour or size? Our makers love a good brief.",
      `Reach out on WhatsApp or email ${brand.contact.email} with your idea and timeline.`,
    ],
  },
};

export function PolicyDialog() {
  const { policy, setPolicy } = useStore();
  const close = () => setPolicy(null);
  useLockBody(!!policy);
  useEscape(!!policy, close);
  return <AnimatePresence>{policy && content[policy] && <Box key={policy} id={policy} onClose={close} />}</AnimatePresence>;
}

function Box({ id, onClose }: { id: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  const c = content[id];
  return (
    <motion.div className="fixed inset-0 z-[84] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-forest-deep/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-ivory p-8 text-forest shadow-2xl md:p-10"
      >
        <button data-autofocus onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full hover:bg-forest/10">
          <X size={20} />
        </button>
        <p className="eyebrow text-terracotta">Policy</p>
        <h2 className="mt-2 font-serif text-4xl">{c.title}</h2>
        <div className="mt-5 space-y-3 leading-[1.75] text-forest/80">
          {c.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="mt-6 border-t border-forest/10 pt-4 text-xs text-forest/50">Placeholder content for demonstration.</p>
      </motion.div>
    </motion.div>
  );
}
