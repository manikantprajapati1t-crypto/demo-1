/**
 * CENTRAL BRAND CONFIGURATION
 * ---------------------------------------------------------------
 * Rebranding this demo for a client? Start here.
 *  - Name, tagline and copy
 *  - The three primary colours (injected into CSS variables at boot)
 *  - Contact / WhatsApp / social placeholders
 *  - Store policies shown in the cart and footer
 * Product and category data live in src/data.
 */
export const brand = {
  name: "KARIGAR",
  tagline: "The Art of Indian Craft",
  handle: "@karigar.demo",
  description:
    "A premium storefront for handmade Indian handicrafts — every piece made by hand, every maker remembered.",

  colors: {
    forest: "#183C32",
    ivory: "#F5F0E6",
    terracotta: "#BC6847",
  },

  // PLACEHOLDER contact details — replace per client.
  contact: {
    email: "hello@karigar.example",
    phone: "+91 00000 00000",
    phoneHref: "+910000000000",
    whatsappNumber: "910000000000", // country code + number, digits only
    whatsappGreeting: "Namaste! I'd love to know more about your handmade pieces.",
    address: "Your Studio Address, City, State, India",
    hours: "Mon – Sat · 10:00 – 18:00 IST",
  },

  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
    pinterest: "https://www.pinterest.com/",
  },

  // PLACEHOLDER policy values — adjust to the real business rules.
  policies: {
    freeShippingAbove: 4999,
    returnDays: 7,
    shippingNote: "Carefully hand-packed in recycled, protective packaging.",
  },

  demoNotice:
    "Demo storefront — no payments are processed and no orders are placed.",
} as const;

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const whatsappLink = (message?: string) =>
  `https://wa.me/${brand.contact.whatsappNumber}?text=${encodeURIComponent(
    message ?? brand.contact.whatsappGreeting,
  )}`;
