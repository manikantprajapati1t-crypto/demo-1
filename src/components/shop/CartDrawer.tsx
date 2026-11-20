import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import type { DrawerTab } from "../../context/StoreContext";
import { getProduct } from "../../data/products";
import { brand, formatINR, whatsappLink } from "../../config/brand";
import { SmartImage } from "../ui/SmartImage";
import { useEscape, useLockBody } from "../../hooks/useOverlay";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { cn } from "../../utils/cn";

export function CartDrawer() {
  const { drawer, closeDrawer } = useStore();
  useLockBody(!!drawer);
  useEscape(!!drawer, closeDrawer);
  return <AnimatePresence>{drawer && <Panel key="panel" tab={drawer} />}</AnimatePresence>;
}

function Panel({ tab }: { tab: DrawerTab }) {
  const { openDrawer, closeDrawer, cart, wishlist, cartTotal, cartCount, setQty, removeFromCart, addToCart, toggleWish, openQuickView } =
    useStore();
  const [demoMsg, setDemoMsg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);

  const threshold = brand.policies.freeShippingAbove;
  const remaining = Math.max(0, threshold - cartTotal);
  const waMessage =
    `Hello! I'd like to enquire about these pieces:\n` +
    cart.map((l) => `• ${getProduct(l.id)?.name} × ${l.qty}`).join("\n") +
    `\nSubtotal: ${formatINR(cartTotal)}`;

  return (
    <motion.div className="fixed inset-0 z-[85]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div
        className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag and wishlist"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 flex h-full w-full max-w-[470px] flex-col bg-ivory shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
          <div role="tablist" aria-label="Bag or wishlist" className="flex gap-1 rounded-full bg-forest/[0.06] p-1">
            {(["bag", "wishlist"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => openDrawer(t)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                  tab === t ? "bg-forest text-ivory" : "text-forest/70 hover:text-forest",
                )}
              >
                {t === "bag" ? <ShoppingBag size={14} /> : <Heart size={14} />}
                {t === "bag" ? `Bag (${cartCount})` : `Wishlist (${wishlist.length})`}
              </button>
            ))}
          </div>
          <button data-autofocus onClick={closeDrawer} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-forest/10">
            <X size={20} />
          </button>
        </div>

        {tab === "bag" ? (
          <>
            {cart.length > 0 && (
              <div className="border-b border-forest/10 px-6 py-4 text-sm">
                <p>
                  {remaining > 0 ? (
                    <>Add <strong>{formatINR(remaining)}</strong> more for free shipping <span className="text-forest/50">(placeholder offer)</span></>
                  ) : (
                    <strong className="text-terracotta">Free shipping unlocked ✦</strong>
                  )}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-forest/10">
                  <motion.div className="h-full bg-terracotta" animate={{ width: `${Math.min(100, (cartTotal / threshold) * 100)}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <Empty icon={<ShoppingBag size={28} />} title="Your bag is empty" text="Pieces you add will appear here." />
              ) : (
                <ul className="divide-y divide-forest/10">
                  <AnimatePresence initial={false}>
                    {cart.map((l) => {
                      const p = getProduct(l.id)!;
                      return (
                        <motion.li
                          key={l.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-4 py-5">
                            <div className="photo-tint relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory-dark">
                              <SmartImage src={p.image} alt={p.alt} w={300} sizes="96px" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                                <button onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`} className="shrink-0 rounded-full p-1.5 text-forest/50 transition-colors hover:text-terracotta">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <p className="mt-1 text-sm text-forest/60">{formatINR(p.price)}</p>
                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="flex items-center rounded-full border border-forest/20" role="group" aria-label={`Quantity of ${p.name}`}>
                                  <button aria-label="Decrease quantity" onClick={() => setQty(p.id, l.qty - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-forest/5">
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                                  <button aria-label="Increase quantity" onClick={() => setQty(p.id, l.qty + 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-forest/5">
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <p className="font-semibold tabular-nums">{formatINR(p.price * l.qty)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-forest/10 bg-ivory-dark/60 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow text-forest/60">Subtotal</span>
                  <span className="font-serif text-3xl tabular-nums">{formatINR(cartTotal)}</span>
                </div>
                <p className="mt-1 text-xs text-forest/55">Shipping and taxes would be calculated at checkout.</p>
                <button
                  onClick={() => setDemoMsg(true)}
                  className="mt-4 w-full rounded-full bg-forest py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-terracotta"
                >
                  Proceed to checkout
                </button>
                <AnimatePresence>
                  {demoMsg && (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-start gap-2 overflow-hidden rounded-xl bg-terracotta/10 p-3 text-xs leading-relaxed text-forest"
                    >
                      <ShieldCheck size={16} className="mt-0.5 shrink-0 text-terracotta" />
                      {brand.demoNotice} In a live store, secure checkout would begin here.
                    </motion.p>
                  )}
                </AnimatePresence>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-forest"
                >
                  <MessageCircle size={16} className="text-terracotta" />
                  <span className="link-underline pb-0.5">Enquire on WhatsApp instead</span>
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-6">
            {wishlist.length === 0 ? (
              <Empty icon={<Heart size={28} />} title="Your wishlist is empty" text="Tap the heart on any piece to save it for later." />
            ) : (
              <ul className="divide-y divide-forest/10">
                {wishlist.map((id) => {
                  const p = getProduct(id);
                  if (!p) return null;
                  return (
                    <li key={id} className="flex gap-4 py-5">
                      <button onClick={() => { closeDrawer(); window.setTimeout(() => openQuickView(id), 350); }} aria-label={`Quick view ${p.name}`} className="photo-tint relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory-dark">
                        <SmartImage src={p.image} alt={p.alt} w={300} sizes="96px" className="h-full w-full object-cover" />
                      </button>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                        <p className="mt-1 text-sm text-forest/60">{formatINR(p.price)}</p>
                        <div className="mt-auto flex items-center gap-3 pt-3">
                          <button onClick={() => addToCart(id)} className="rounded-full bg-forest px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-terracotta">
                            Add to bag
                          </button>
                          <button onClick={() => toggleWish(id)} aria-label={`Remove ${p.name} from wishlist`} className="rounded-full p-2 text-terracotta hover:bg-terracotta/10">
                            <Heart size={18} className="fill-terracotta" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}

function Empty({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-forest/20 text-terracotta">{icon}</span>
      <p className="mt-5 font-serif text-3xl">{title}</p>
      <p className="mt-2 max-w-[16rem] text-sm text-forest/65">{text}</p>
    </div>
  );
}
