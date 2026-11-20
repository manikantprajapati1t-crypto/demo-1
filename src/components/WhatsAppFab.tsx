import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../config/brand";

/** Floating WhatsApp CTA (number is a configurable placeholder). */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 left-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-ivory shadow-xl transition-transform duration-500 hover:scale-110"
    >
      <span aria-hidden="true" className="animate-pulse-ring absolute inset-0 rounded-full bg-terracotta" />
      <MessageCircle size={24} className="relative" />
      <span className="pointer-events-none absolute left-16 hidden whitespace-nowrap rounded-full bg-forest px-4 py-2 text-xs font-semibold text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
