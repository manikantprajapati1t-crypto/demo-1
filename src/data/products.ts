import { IMG } from "./images";
import type { CategoryId } from "./categories";

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  image: string;
  alt: string;
  badge?: string;
  blurb: string;
  description: string;
  material: string;
  size: string;
  craft: string;
  care: string;
}

/**
 * Demo catalogue — placeholder names, prices and specifications.
 * The first 8 appear in "Featured"; Bestsellers reference ids below.
 */
export const products: Product[] = [
  {
    id: "bundi-urn",
    name: "Bundi Blue-Pattern Urn",
    category: "pottery",
    price: 2450,
    image: IMG.bundiUrn,
    alt: "Handcrafted Rajasthani ceramic pots with intricate white patterns",
    badge: "Bestseller",
    blurb: "Hand-painted slip patterns on a wheel-thrown body.",
    description:
      "A wheel-thrown urn finished with hand-painted slip patterns inspired by Rajasthani pottery traditions. Each piece is slightly different — the small variations are the signature of the hand that made it.",
    material: "Kiln-fired stoneware clay",
    size: "H 28 cm × W 18 cm",
    craft: "Wheel throwing · Slip painting",
    care: "Wipe with a soft damp cloth. Decorative use; not food-safe.",
  },
  {
    id: "karaikudi-pots",
    name: "Hand-Thrown Pot Trio",
    category: "pottery",
    price: 1650,
    image: IMG.karaikudiPots,
    alt: "A variety of handmade clay pots in warm earthen tones",
    blurb: "Three earthen pots in graduated sizes.",
    description:
      "A trio of earthen pots shaped on the wheel and sun-dried before firing. Beautiful as planters, kitchen storage or a quiet shelf arrangement.",
    material: "Natural red clay",
    size: "Set of 3 · H 12–20 cm",
    craft: "Wheel throwing · Sun drying",
    care: "Keep dry when not in use. Plant with a liner for moisture control.",
  },
  {
    id: "carved-ganesha",
    name: "Hand-Carved Ganesha",
    category: "wood",
    price: 6800,
    image: IMG.ganesha,
    alt: "Close-up of a hand-carved wooden Ganesha statue",
    badge: "Heirloom",
    blurb: "Fine chisel detail in seasoned timber.",
    description:
      "Carved from a single block of seasoned timber, this Ganesha carries hours of patient chisel work in every fold and curve. A centrepiece for entrances, studies and shrines.",
    material: "Seasoned hardwood",
    size: "H 30 cm × W 20 cm",
    craft: "Chisel carving · Hand finishing",
    care: "Dust with a dry cloth. Avoid direct sun and damp.",
  },
  {
    id: "deity-sculpture",
    name: "Sheesham Deity Sculpture",
    category: "wood",
    price: 9800,
    image: IMG.deitySculpture,
    alt: "Intricate wooden sculpture of a Hindu deity at an Indian craft fair",
    blurb: "A statement carving with intricate relief.",
    description:
      "A richly detailed relief sculpture, carved and finished by hand. The grain of the timber becomes part of the story — no two sculptures read alike.",
    material: "Solid hardwood",
    size: "H 45 cm × W 25 cm",
    craft: "Relief carving · Oil finishing",
    care: "Dust gently. Re-oil lightly once a year with a natural wood oil.",
  },
  {
    id: "brass-deepam",
    name: "Brass Deepam Oil Lamp",
    category: "brass",
    price: 3950,
    image: IMG.brassLamp,
    alt: "Traditional Indian brass oil lamp with an intricate design, lit indoors",
    badge: "Bestseller",
    blurb: "A lamp that has lit homes for generations.",
    description:
      "A traditional brass oil lamp cast and hand-finished for a warm, enduring glow. Use it for festivals, evenings, or simply as sculptural brass on a console.",
    material: "Solid cast brass",
    size: "H 22 cm × W 12 cm",
    craft: "Sand casting · Hand polishing",
    care: "Polish with tamarind or a soft brass cloth. Avoid harsh abrasives.",
  },
  {
    id: "handloom-throw",
    name: "Handloom Cotton Throw",
    category: "textiles",
    price: 4200,
    image: IMG.handloomThrow,
    alt: "Colourful yarn being woven on a traditional wooden handloom",
    blurb: "Soft, breathable cotton woven on a pit loom.",
    description:
      "Woven in natural cotton with a soft hand and an honest, slightly textured weave. Layer it over a sofa, a bed, or carry it on a cool evening.",
    material: "100% cotton, natural dyes",
    size: "130 cm × 180 cm",
    craft: "Handloom weaving",
    care: "Gentle hand wash in cold water. Dry in shade.",
  },
  {
    id: "kundan-set",
    name: "Kundan Necklace & Earring Set",
    category: "jewellery",
    price: 8900,
    image: IMG.kundanSet,
    alt: "Traditional Indian kundan necklace and earrings set with blue gemstones",
    badge: "Heirloom",
    blurb: "Set stone by stone in a timeless silhouette.",
    description:
      "A kundan-style necklace with matching earrings, set stone by stone by hand. Designed for celebrations and made to be passed down.",
    material: "Gold-plated alloy, glass stones",
    size: "Necklace 42 cm · Earrings 5 cm",
    craft: "Kundan setting · Hand assembly",
    care: "Store in a soft pouch away from moisture and perfume.",
  },
  {
    id: "pattachitra-painting",
    name: "Pattachitra Folk Painting",
    category: "paintings",
    price: 5400,
    image: IMG.pattachitra,
    alt: "Colourful traditional Indian folk art painting with animals and nature",
    blurb: "Mineral colours, fine brushwork, living story.",
    description:
      "A folk painting in the Pattachitra spirit — bold outlines, vivid natural colours and narrative detail. Painted by hand on prepared cloth and ready to frame.",
    material: "Natural pigments on treated cloth",
    size: "40 cm × 60 cm (unframed)",
    craft: "Hand painting · Natural pigments",
    care: "Keep away from direct sun and humidity. Frame behind UV glass.",
  },

  // ——— Additional catalogue (used in Bestsellers) ———
  {
    id: "brass-bells",
    name: "Brass Wind Bells",
    category: "brass",
    price: 1850,
    image: IMG.brassBells,
    alt: "Handmade brass wind chimes hanging in an Indian market",
    badge: "New",
    blurb: "A soft, warm chime for porches and windows.",
    description:
      "Hand-cast brass bells strung into a wind chime with a mellow, unhurried tone. Hang it where the breeze lives.",
    material: "Cast brass",
    size: "L 55 cm",
    craft: "Casting · Hand tuning",
    care: "Wipe with a dry cloth; natural patina will develop over time.",
  },
  {
    id: "festive-bangles",
    name: "Festive Bangle Set",
    category: "jewellery",
    price: 2750,
    image: IMG.bangles,
    alt: "Traditional red and gold Indian bangles with intricate designs",
    blurb: "Red and gold, stacked for celebration.",
    description:
      "A stackable set of traditional red and gold bangles with detailed patterning. Wear all together for festivals or mix with everyday pieces.",
    material: "Lacquered alloy with gold-tone detailing",
    size: "Set of 6 · Medium (2.6)",
    craft: "Hand finishing",
    care: "Keep dry. Store flat in a cloth-lined box.",
  },
  {
    id: "wood-block",
    name: "Hand-Carved Printing Block",
    category: "wood",
    price: 1450,
    image: IMG.woodBlock,
    alt: "An artisan carving a wooden block for hand block printing in Jaipur",
    blurb: "The tool behind a thousand patterns.",
    description:
      "A carved wooden block of the kind used in traditional block printing. Display it as sculpture or use it to stamp your own fabrics.",
    material: "Seasoned wood",
    size: "10 cm × 10 cm",
    craft: "Chisel carving",
    care: "Wipe clean after use. Store dry.",
  },
  {
    id: "brass-diyas",
    name: "Brass Diya Set",
    category: "brass",
    price: 2200,
    image: IMG.brassDiyas,
    alt: "A lit brass diya on a silver tray celebrating Diwali",
    blurb: "A set of four for festivals and quiet evenings.",
    description:
      "Four hand-finished brass diyas that catch candlelight beautifully. Perfect for Diwali, gifting, or everyday ritual.",
    material: "Solid brass",
    size: "Set of 4 · Ø 7 cm",
    craft: "Casting · Hand polishing",
    care: "Polish with a soft cloth. Use with cotton wicks and oil.",
  },
];

export const featuredIds = products.slice(0, 8).map((p) => p.id);

export const bestsellerIds = [
  "brass-deepam",
  "bundi-urn",
  "kundan-set",
  "carved-ganesha",
  "brass-bells",
  "brass-diyas",
  "festive-bangles",
  "pattachitra-painting",
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
