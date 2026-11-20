import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function Toast() {
  const { toast, openDrawer } = useStore();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex max-w-[92vw] items-center gap-4 rounded-full bg-forest py-3 pl-5 pr-3 text-sm text-ivory shadow-2xl ring-1 ring-ivory/10"
          >
            <CheckCircle2 size={18} className="shrink-0 text-terracotta" />
            <span className="truncate">{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => openDrawer(toast.action!)}
                className="shrink-0 rounded-full bg-terracotta px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ivory hover:text-forest"
              >
                {toast.action === "bag" ? "View bag" : "View"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
