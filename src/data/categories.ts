import { IMG } from "./images";

export type CategoryId =
  | "pottery"
  | "wood"
  | "brass"
  | "textiles"
  | "jewellery"
  | "paintings";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  tagline: string;
  image: string;
  alt: string;
}

export const categories: Category[] = [
  {
    id: "pottery",
    name: "Handmade Pottery",
    short: "Pottery",
    tagline: "Wheel-thrown clay, fired the old way.",
    image: IMG.catPottery,
    alt: "Rows of handmade terracotta clay pots from an Indian market",
  },
  {
    id: "wood",
    name: "Wooden Handicrafts",
    short: "Wood",
    tagline: "Carved by hand from seasoned timber.",
    image: IMG.catWood,
    alt: "An artisan carving a wooden sculpture in an Indian workshop",
  },
  {
    id: "brass",
    name: "Brass & Metal Art",
    short: "Brass & Metal",
    tagline: "Cast, hammered and polished to glow.",
    image: IMG.catBrass,
    alt: "Traditional Indian brass lamps with intricate patterns glowing in warm light",
  },
  {
    id: "textiles",
    name: "Handwoven Textiles",
    short: "Textiles",
    tagline: "Thread by thread on the handloom.",
    image: IMG.catTextiles,
    alt: "An Indian weaver working at a traditional handloom",
  },
  {
    id: "jewellery",
    name: "Handmade Jewellery",
    short: "Jewellery",
    tagline: "Heirloom designs for modern days.",
    image: IMG.catJewellery,
    alt: "Traditional Indian gold jewellery laid out on a red saree",
  },
  {
    id: "paintings",
    name: "Traditional Indian Paintings",
    short: "Paintings",
    tagline: "Folk art that carries centuries of story.",
    image: IMG.catPaintings,
    alt: "An Indian artist painting a Pattachitra folk artwork",
  },
];

export const getCategory = (id: CategoryId) =>
  categories.find((c) => c.id === id)!;
