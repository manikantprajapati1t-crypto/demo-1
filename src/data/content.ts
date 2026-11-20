import { IMG } from "./images";

export interface ArtisanChapter {
  no: string;
  craft: string;
  title: string;
  text: string;
  techniques: string[];
  image: string;
  alt: string;
  caption: string;
}

/** Illustrative storytelling — replace with the client's real makers. */
export const artisanChapters: ArtisanChapter[] = [
  {
    no: "01",
    craft: "Clay",
    title: "The Potter's Wheel",
    text: "Before dawn, the wheel starts to turn. The potter reads the clay with her palms — its moisture, its mood — and lets a form rise as it has risen in her family for generations.",
    techniques: ["Wheel throwing", "Slip decoration", "Open firing"],
    image: IMG.potterHands,
    alt: "Close-up of hands shaping clay on a spinning pottery wheel",
    caption: "Hands shaping clay on the wheel",
  },
  {
    no: "02",
    craft: "Wood",
    title: "The Carver's Patience",
    text: "A block of seasoned timber, a set of worn chisels. The carver doesn't force the wood; he listens to its grain, removing only what is not yet the story.",
    techniques: ["Chisel carving", "Relief work", "Natural oil finish"],
    image: IMG.woodCarver,
    alt: "A craftsman sitting cross-legged working with wood in a traditional Indian workshop",
    caption: "A carver at work in his workshop",
  },
  {
    no: "03",
    craft: "Thread",
    title: "The Weaver's Rhythm",
    text: "The loom keeps its own music — the clack of the shuttle, the sigh of the beater. Each metre of cloth is an afternoon of patience, counted in thousands of passes.",
    techniques: ["Handloom weaving", "Natural dyeing", "Hand finishing"],
    image: IMG.weaver,
    alt: "An Indian woman weaving on a traditional loom in a workspace",
    caption: "A weaver at the handloom",
  },
  {
    no: "04",
    craft: "Colour",
    title: "The Painter's Line",
    text: "Fine brushes, mineral colour, a steady breath. In folk painting, a single unbroken line can carry a myth — drawn the way it was taught, and still entirely alive.",
    techniques: ["Folk painting", "Natural pigments", "Fine brushwork"],
    image: IMG.painter,
    alt: "An Indian artist painting a vibrant folk art mural with intricate patterns",
    caption: "An artist painting a folk mural",
  },
];

export interface ProcessStage {
  no: string;
  title: string;
  text: string;
  note: string;
  image: string;
  alt: string;
}

export const processStages: ProcessStage[] = [
  {
    no: "01",
    title: "Design",
    text: "Every piece begins as a sketch, a memory or a motif carried down through families. Patterns are drawn, tested and refined long before a tool touches the material.",
    note: "Motif · Sketch · Pattern",
    image: IMG.woodBlock,
    alt: "An artisan carefully carving a pattern into a wooden block",
  },
  {
    no: "02",
    title: "Materials",
    text: "Local clay, seasoned timber, recycled brass and natural dyes. Materials are chosen for how they age and how they feel in the hand, not for how fast they can be shaped.",
    note: "Clay · Wood · Brass · Cotton",
    image: IMG.terracottaStack,
    alt: "A pile of terracotta pots amidst ashes after traditional firing",
  },
  {
    no: "03",
    title: "Craftsmanship",
    text: "Wheel, loom, chisel, hammer, brush. This is the slow part — the part that can't be rushed, automated or faked — and the reason each piece is a little bit different.",
    note: "Wheel · Loom · Chisel · Brush",
    image: IMG.clayHands,
    alt: "Hands shaping clay on a spinning pottery wheel in India",
  },
  {
    no: "04",
    title: "Masterpiece",
    text: "Each finished piece is inspected, signed off by its maker and wrapped with care, ready to begin a new story in your home.",
    note: "Inspected · Wrapped · Delivered",
    image: IMG.bundiUrn,
    alt: "A collection of finished Rajasthani ceramic pots with white patterns",
  },
];

export interface Testimonial {
  name: string;
  place: string;
  product: string;
  quote: string;
  rating: number;
}

/** Clearly illustrative copy. */
export const testimonials: Testimonial[] = [
  {
    name: "Aanya R.",
    place: "Bengaluru",
    product: "Brass Deepam Oil Lamp",
    quote:
      "It has a weight and warmth that factory brass simply doesn't. It sits on our console and quietly changes the whole room.",
    rating: 5,
  },
  {
    name: "Rohan M.",
    place: "Mumbai",
    product: "Bundi Blue-Pattern Urn",
    quote:
      "I loved reading about who made it before it even arrived. The tiny variations in the painting make it feel like it belongs to us.",
    rating: 5,
  },
  {
    name: "Meera S.",
    place: "Jaipur",
    product: "Handloom Cotton Throw",
    quote:
      "Soft, honest and beautifully made. The packaging was thoughtful and the details on the product page matched exactly what I received.",
    rating: 5,
  },
  {
    name: "Karan & Ila",
    place: "Delhi",
    product: "Hand-Carved Ganesha",
    quote:
      "We bought it as a housewarming gift. The carving detail is extraordinary — people pick it up and immediately ask where it's from.",
    rating: 5,
  },
  {
    name: "Priya N.",
    place: "Chennai",
    product: "Kundan Necklace Set",
    quote:
      "Elegant without being heavy. It photographed beautifully and felt like an heirloom the moment I opened the box.",
    rating: 4,
  },
];

export const marqueeWords = [
  "Hand-thrown",
  "Hand-woven",
  "Hand-carved",
  "Hand-cast",
  "Hand-painted",
  "Hand-set",
];
