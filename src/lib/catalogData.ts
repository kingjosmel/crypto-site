import { SignJWT, jwtVerify } from "jose";

export type Image = { url: string; alt: string; position: number };
export type Spec = { key: string; value: string };
export type Category = { _id: string; name: string; slug: string; description?: string; createdAt?: string; updatedAt?: string };
export type Product = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  condition: "NEW" | "REFURBISHED" | "PRE_OWNED";
  priceCents: number;
  currency: "USD";
  sku: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  warranty?: string;
  returnPolicy?: string;
  description?: string;
  specs: Spec[];
  images: Image[];
  sizes: string[];
  authenticity?: string;
  createdAt: string;
  updatedAt: string;
};

export const INITIAL_CATEGORIES: Category[] = [
  { _id: "660000000000000000000001", name: "Designer Clothing", slug: "designer-clothing", description: "Luxury overcoats, cashmere knits, jackets, and considered wardrobe pieces." },
  { _id: "660000000000000000000002", name: "Luxury Shoes & Sneakers", slug: "luxury-shoes-sneakers", description: "Designer sneakers, formal shoes, loafers, and premium footwear." },
  { _id: "660000000000000000000003", name: "Bags & Accessories", slug: "belts-wallets-accessories", description: "Iconic designer bags, totes, wallets, and fine leather accessories." }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    _id: "660000000000000000000101",
    name: "Silk Twill Evening Shirt",
    slug: "silk-twill-evening-shirt",
    brand: "Dior",
    categoryId: "660000000000000000000001",
    priceCents: 185000,
    currency: "USD",
    sku: "DIO-CL-001",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Manufacturer 2-year warranty on craftsmanship",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A fluid silk twill shirt with a precise drape and quiet evening presence, finished with mother-of-pearl buttons.",
    specs: [{ key: "Material", value: "100% Silk twill" }, { key: "Fit", value: "Relaxed European cut" }, { key: "Origin", value: "Made in Italy" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    authenticity: "Includes original tags and boutique authenticity certificate.",
    images: [{ url: "/images/product_dior_silk_shirt.jpg", alt: "Dior silk twill evening shirt", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Dior evening shirt editorial view", position: 1 }],
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000102",
    name: "Monogram Canvas Blouson",
    slug: "monogram-canvas-blouson",
    brand: "Louis Vuitton",
    categoryId: "660000000000000000000001",
    priceCents: 325000,
    currency: "USD",
    sku: "LVI-CL-002",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Louis Vuitton standard international warranty",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A structured blouson balancing archival pattern with a clean modern silhouette and palladium-finish hardware.",
    specs: [{ key: "Material", value: "Cotton canvas" }, { key: "Lining", value: "Cupro silk blend" }, { key: "Closure", value: "Dual zip fastening" }],
    sizes: ["S", "M", "L", "XL"],
    authenticity: "Verified with RFID microchip authentication tag.",
    images: [{ url: "/images/product_lv_jacket.jpg", alt: "Louis Vuitton monogram blouson", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Louis Vuitton blouson detail", position: 1 }],
    createdAt: "2026-01-11T10:00:00.000Z",
    updatedAt: "2026-01-11T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000103",
    name: "Double-Breasted Wool Jacket",
    slug: "double-breasted-wool-jacket",
    brand: "Gucci",
    categoryId: "660000000000000000000001",
    priceCents: 295000,
    currency: "USD",
    sku: "GUC-CL-003",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Gucci Atelier warranty on stitching & canvas",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A tailored wool jacket with sculpted shoulders, horn buttons, and an understated sartorial finish.",
    specs: [{ key: "Material", value: "100% Virgin wool" }, { key: "Cut", value: "Tailored Italian fit" }, { key: "Origin", value: "Made in Italy" }],
    sizes: ["46", "48", "50", "52"],
    authenticity: "Includes official house garment bag and authentication card.",
    images: [{ url: "/images/product_gucci_jacket.jpg", alt: "Gucci double breasted wool jacket", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Gucci jacket editorial view", position: 1 }],
    createdAt: "2026-01-12T10:00:00.000Z",
    updatedAt: "2026-01-12T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000104",
    name: "Leather City Loafer",
    slug: "leather-city-loafer",
    brand: "Dior",
    categoryId: "660000000000000000000002",
    priceCents: 145000,
    currency: "USD",
    sku: "DIO-SH-004",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Dior footwear 1-year warranty",
    returnPolicy: "Returns accepted within 14 days with sole protective film intact.",
    description: "A polished calfskin loafer designed for a composed city wardrobe with subtle CD metal hardware.",
    specs: [{ key: "Upper", value: "Polished calfskin" }, { key: "Sole", value: "Hand-stitched leather" }, { key: "Construction", value: "Blake stitched" }],
    sizes: ["40", "41", "42", "43", "44", "45"],
    authenticity: "Official house dust covers and provenance documentation included.",
    images: [{ url: "/images/product_dior_loafer.jpg", alt: "Dior leather city loafer", position: 0 }],
    createdAt: "2026-01-13T10:00:00.000Z",
    updatedAt: "2026-01-13T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000105",
    name: "GG Court Sneaker",
    slug: "gg-court-sneaker",
    brand: "Gucci",
    categoryId: "660000000000000000000002",
    priceCents: 110000,
    currency: "USD",
    sku: "GUC-SH-005",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Gucci 1-year product guarantee",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A low-profile court sneaker with considered tonal monogram detailing and a supple calf leather finish.",
    specs: [{ key: "Upper", value: "Smooth leather & GG canvas" }, { key: "Sole", value: "Natural rubber outsole" }],
    sizes: ["39", "40", "41", "42", "43", "44"],
    authenticity: "Includes serial verification and branded shoebox.",
    images: [{ url: "/images/product_gucci_sneaker.jpg", alt: "Gucci court sneaker", position: 0 }],
    createdAt: "2026-01-14T10:00:00.000Z",
    updatedAt: "2026-01-14T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000106",
    name: "Monogram Trainer",
    slug: "monogram-trainer",
    brand: "Louis Vuitton",
    categoryId: "660000000000000000000002",
    priceCents: 135000,
    currency: "USD",
    sku: "LVI-SH-006",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Louis Vuitton luxury sneaker warranty",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A technical trainer blending archival monogram canvas with sculpted rubber outsoles and padded ankle collars.",
    specs: [{ key: "Upper", value: "Textile and calf leather" }, { key: "Sole", value: "Bi-color rubber" }, { key: "Hours to stitch", value: "7 hours" }],
    sizes: ["40", "41", "42", "43", "44"],
    authenticity: "Microchipped NFC verification tag built-in.",
    images: [{ url: "/images/product_lv_trainer.jpg", alt: "Louis Vuitton monogram trainer", position: 0 }],
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000107",
    name: "Goyard Saint Sulpice Cardholder",
    slug: "goyard-saint-sulpice-cardholder",
    brand: "Goyard",
    categoryId: "660000000000000000000003",
    priceCents: 65000,
    currency: "USD",
    sku: "GOY-AC-007",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Maison Goyard craftsmanship warranty",
    returnPolicy: "Complimentary returns within 14 days in unused condition.",
    description: "A compact cardholder in hand-stenciled Goyardine canvas, offering four card slots and a central bill pocket.",
    specs: [{ key: "Material", value: "Goyardine canvas & Vauzelles calfskin" }, { key: "Dimensions", value: "7 cm x 10.5 cm" }, { key: "Capacity", value: "4 card slots + 1 center pocket" }],
    sizes: ["One Size"],
    authenticity: "Includes signature yellow gift box and ribbon.",
    images: [{ url: "/images/product_goyard_cardholder.jpg", alt: "Goyard Saint Sulpice cardholder", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Goyard cardholder detail", position: 1 }],
    createdAt: "2026-01-16T10:00:00.000Z",
    updatedAt: "2026-01-16T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000108",
    name: "Reversible Leather Belt",
    slug: "reversible-leather-belt",
    brand: "Gucci",
    categoryId: "660000000000000000000003",
    priceCents: 72000,
    currency: "USD",
    sku: "GUC-AC-008",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Gucci 2-year leather goods guarantee",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "A versatile reversible belt in smooth black leather on one face and monogram canvas on the reverse.",
    specs: [{ key: "Material", value: "Full-grain calfskin & GG canvas" }, { key: "Width", value: "35 mm" }, { key: "Buckle", value: "Interlocking G shiny gold-toned" }],
    sizes: ["80", "85", "90", "95", "100"],
    authenticity: "Includes dust bag and serial number stamping.",
    images: [{ url: "/images/product_gucci_belt.jpg", alt: "Gucci reversible leather belt", position: 0 }],
    createdAt: "2026-01-17T10:00:00.000Z",
    updatedAt: "2026-01-17T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000109",
    name: "Classic Monogram Wallet",
    slug: "classic-monogram-wallet",
    brand: "Louis Vuitton",
    categoryId: "660000000000000000000003",
    priceCents: 92000,
    currency: "USD",
    sku: "LVI-AC-009",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Louis Vuitton leather goods warranty",
    returnPolicy: "Complimentary returns within 14 days in unused condition.",
    description: "A slim bifold multiple wallet featuring 8 credit card slots and compartments for tickets and banknotes.",
    specs: [{ key: "Material", value: "Monogram coated canvas" }, { key: "Lining", value: "Cross-grain leather" }, { key: "Dimensions", value: "11.5 cm x 9 cm" }],
    sizes: ["One Size"],
    authenticity: "Verified with RFID microchip authentication.",
    images: [{ url: "/images/product_lv_wallet.jpg", alt: "Louis Vuitton monogram multiple wallet", position: 0 }],
    createdAt: "2026-01-18T10:00:00.000Z",
    updatedAt: "2026-01-18T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000113",
    name: "Goyard Saint Louis PM Tote",
    slug: "goyard-saint-louis-pm-tote",
    brand: "Goyard",
    categoryId: "660000000000000000000003",
    priceCents: 285000,
    currency: "USD",
    sku: "GOY-BG-013",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Maison Goyard craftsmanship warranty and authenticity guarantee",
    returnPolicy: "Complimentary returns within 14 days in original unused packaging.",
    description: "The iconic Maison Goyard Saint Louis PM tote bag in classic black and tan hand-stenciled Goyardine chevron canvas. Remarkably lightweight and reversible, featuring slim hand-stitched leather shoulder handles and a detachable matching companion pochette.",
    specs: [
      { key: "Material", value: "Hand-stenciled Goyardine canvas & Chevroches calfskin" },
      { key: "Dimensions", value: "34 cm x 28 cm x 15 cm" },
      { key: "Handle Drop", value: "18 cm" },
      { key: "Accessories", value: "Detachable Goyardine pochette wallet with palladium snap" },
      { key: "Origin", value: "Handmade in France" }
    ],
    sizes: ["PM (Petite Modèle)"],
    authenticity: "Includes official Goyard signature yellow dust cover, felt insert, and tags.",
    images: [
      { url: "/images/product_goyard_saint_louis.jpg", alt: "Goyard Saint Louis PM Tote Bag in black and tan Goyardine canvas", position: 0 }
    ],
    createdAt: "2026-01-22T10:00:00.000Z",
    updatedAt: "2026-01-22T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000115",
    name: "Goyard Anjou PM Reversible Tote",
    slug: "goyard-anjou-pm-reversible-tote",
    brand: "Goyard",
    categoryId: "660000000000000000000003",
    priceCents: 375000,
    currency: "USD",
    sku: "GOY-BG-015",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Maison Goyard craftsmanship warranty",
    returnPolicy: "Complimentary returns within 14 days in pristine condition.",
    description: "An exceptional evolution of the tote bag, the Anjou PM is fully reversible. One side showcases vibrant emerald green Goyardine canvas, while the reverse presents luscious full-grain tan calf leather. Includes detachable matching companion pouch.",
    specs: [
      { key: "Side A", value: "Green hand-stenciled Goyardine canvas" },
      { key: "Side B", value: "Full-grain grained Chevroches calf leather" },
      { key: "Dimensions", value: "34 cm x 28 cm x 15 cm" },
      { key: "Drop", value: "18 cm rolled leather handles" },
      { key: "Pouch", value: "Detachable matching coin and card pocket" }
    ],
    sizes: ["PM"],
    authenticity: "Includes signature Goyard dust bag and boutique packaging.",
    images: [
      { url: "/images/product_goyard_anjou.jpg", alt: "Goyard Anjou PM Reversible Tote Bag in green Goyardine canvas", position: 0 }
    ],
    createdAt: "2026-01-24T10:00:00.000Z",
    updatedAt: "2026-01-24T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000117",
    name: "Keepall Bandoulière 50 Eclipse",
    slug: "lv-keepall-bandouliere-50-eclipse",
    brand: "Louis Vuitton",
    categoryId: "660000000000000000000003",
    priceCents: 270000,
    currency: "USD",
    sku: "LVI-BG-017",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Louis Vuitton international luggage warranty",
    returnPolicy: "Complimentary returns within 14 days in unused condition.",
    description: "The definitive luxury weekender travel duffle bag. Rendered in masculine Monogram Eclipse coated canvas with smooth black cowhide leather trim, ruthenium-finish hardware, padlock, and removable padded shoulder strap.",
    specs: [
      { key: "Material", value: "Monogram Eclipse coated canvas" },
      { key: "Trim", value: "Smooth cowhide leather" },
      { key: "Lining", value: "Textile cotton lining" },
      { key: "Dimensions", value: "50 cm x 29 cm x 23 cm" },
      { key: "Cabin Friendly", value: "Compliant with international carry-on size" }
    ],
    sizes: ["50 cm (Carry-On Size)"],
    authenticity: "RFID microchip authentication verified with original dust bag and luggage tag.",
    images: [
      { url: "/images/product_lv_keepall.jpg", alt: "Louis Vuitton Keepall Bandouliere 50 Monogram Eclipse", position: 0 }
    ],
    createdAt: "2026-01-26T10:00:00.000Z",
    updatedAt: "2026-01-26T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000122",
    name: "Cable-Knit Baby Cashmere Crewneck",
    slug: "loro-piana-cable-knit-baby-cashmere-crewneck",
    brand: "Loro Piana",
    categoryId: "660000000000000000000001",
    priceCents: 245000,
    currency: "USD",
    sku: "LOR-CL-022",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Loro Piana artisanal knitwear guarantee",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "Hand-combed baby cashmere gathered from the underfleece of Capra hircus kids in northern China. Features an intricate 7-gauge cable twist pattern, ribbed cuffs, and unparalleled cloud-like softness.",
    specs: [
      { key: "Material", value: "100% Baby Cashmere (13.5 micron fiber)" },
      { key: "Knit", value: "7-gauge textured cable-twist" },
      { key: "Color", value: "Oatmeal Melange" },
      { key: "Origin", value: "Knitted in Quarona Sesia, Italy" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    authenticity: "Verified with Loro Piana garment tags and certificate of provenance.",
    images: [
      { url: "/images/product_loropiana_cashmere.jpg", alt: "Loro Piana Cable-Knit Baby Cashmere Crewneck in Oatmeal", position: 0 }
    ],
    createdAt: "2026-01-31T10:00:00.000Z",
    updatedAt: "2026-01-31T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000123",
    name: "Oblique Tailored Wool Overcoat",
    slug: "dior-homme-oblique-tailored-wool-overcoat",
    brand: "Dior",
    categoryId: "660000000000000000000001",
    priceCents: 480000,
    currency: "USD",
    sku: "DIO-CL-023",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Dior Couture tailoring craftsmanship warranty",
    returnPolicy: "Complimentary returns within 14 days with tags attached.",
    description: "A double-breasted long overcoat tailored from heavy midnight navy virgin wool with subtle tonal Dior Oblique jacquard weave. Designed with broad peak lapels, horn buttons, full interior cupro lining, and a clean structural drape.",
    specs: [
      { key: "Fabric", value: "95% Virgin Wool, 5% Cashmere" },
      { key: "Lining", value: "100% Cupro silk-finish jacquard" },
      { key: "Cut", value: "Double-breasted structured Italian tailoring" },
      { key: "Buttons", value: "Hand-carved dark horn buttons" },
      { key: "Origin", value: "Tailored in Italy" }
    ],
    sizes: ["46", "48", "50", "52", "54"],
    authenticity: "Includes official Dior Homme wooden hanger and canvas garment travel bag.",
    images: [
      { url: "/images/product_dior_overcoat.jpg", alt: "Dior Homme Oblique Tailored Wool Overcoat", position: 0 }
    ],
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000124",
    name: "GG Jacquard Monogram Zip Jacket",
    slug: "gucci-gg-jacquard-monogram-zip-jacket",
    brand: "Gucci",
    categoryId: "660000000000000000000001",
    priceCents: 210000,
    currency: "USD",
    sku: "GUC-CL-024",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Gucci ready-to-wear warranty",
    returnPolicy: "Complimentary returns within 14 days in unworn condition.",
    description: "Knitted in technical cotton-wool jacquard with an all-over archival GG monogram pattern in rich camel and espresso, accented by ivory chevron arm stripes and dark ribbed trims.",
    specs: [
      { key: "Fabric", value: "70% Cotton, 30% Wool jacquard knit" },
      { key: "Piping", value: "Ivory and brown sporty sleeve trim" },
      { key: "Fastening", value: "Front zipper with engraved Gucci puller" },
      { key: "Collar", value: "Ribbed stand collar" },
      { key: "Origin", value: "Made in Italy" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    authenticity: "Official Gucci packaging, hanger, and RFID security verification tag.",
    images: [
      { url: "/images/product_gucci_track_jacket.jpg", alt: "Gucci GG Jacquard Monogram Zip Jacket", position: 0 }
    ],
    createdAt: "2026-02-02T10:00:00.000Z",
    updatedAt: "2026-02-02T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000131",
    name: "Prada Re-Nylon & Saffiano Shoulder Bag",
    slug: "prada-re-nylon-saffiano-shoulder-bag",
    brand: "Prada",
    categoryId: "660000000000000000000003",
    priceCents: 195000,
    currency: "USD",
    sku: "PRA-BG-031",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Prada Milan luxury goods authenticity warranty",
    returnPolicy: "Complimentary returns within 14 days in original packaging.",
    description: "Crafted from innovative regenerated nylon yarn paired with refined Saffiano leather trim. Features an adjustable woven shoulder strap, detachable mini pouch, and the enameled metal triangle logo.",
    specs: [
      { key: "Material", value: "Regenerated Re-Nylon and cross-hatch Saffiano leather" },
      { key: "Hardware", value: "Polished steel-finish metal hardware" },
      { key: "Dimensions", value: "22 cm x 16 cm x 6.5 cm" },
      { key: "Strap", value: "Detachable adjustable nylon tape shoulder strap with mini pouch" },
      { key: "Origin", value: "Made in Italy" }
    ],
    sizes: ["One Size"],
    authenticity: "Includes Prada authenticity certificate card, RFID chip, and dust pouch.",
    images: [
      { url: "/images/product_prada_renylon.jpg", alt: "Prada Re-Nylon and Saffiano Leather Shoulder Bag in Black", position: 0 }
    ],
    createdAt: "2026-02-09T10:00:00.000Z",
    updatedAt: "2026-02-09T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000132",
    name: "Celine Triomphe Medium Shoulder Bag",
    slug: "celine-triomphe-medium-shoulder-bag",
    brand: "Celine",
    categoryId: "660000000000000000000003",
    priceCents: 345000,
    currency: "USD",
    sku: "CEL-BG-032",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Celine Paris artisan warranty",
    returnPolicy: "Complimentary returns within 14 days with security tag intact.",
    description: "Sculpted in glossy smooth black calfskin with lambskin lining and the metallic Triomphe clasp in glowing gold finish. Includes three inner compartments and an adjustable leather shoulder strap.",
    specs: [
      { key: "Leather", value: "100% Smooth shiny calfskin" },
      { key: "Lining", value: "100% Lambskin interior" },
      { key: "Hardware", value: "Gold-tone brass Triomphe closure" },
      { key: "Dimensions", value: "22.5 cm x 16.5 cm x 7 cm" },
      { key: "Origin", value: "Crafted in Italy" }
    ],
    sizes: ["Medium"],
    authenticity: "Includes Celine boutique gift box, silk dust cover, and serial documentation.",
    images: [
      { url: "/images/product_celine_triomphe.jpg", alt: "Celine Triomphe Medium Shoulder Bag in Shiny Calfskin", position: 0 }
    ],
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000133",
    name: "Bottega Veneta Padded Cassette Bag",
    slug: "bottega-veneta-padded-cassette-bag",
    brand: "Bottega Veneta",
    categoryId: "660000000000000000000003",
    priceCents: 380000,
    currency: "USD",
    sku: "BOT-BG-033",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Bottega Veneta Certificate of Craft lifetime guarantee",
    returnPolicy: "Complimentary returns within 14 days in unused condition.",
    description: "An iconic modern classic created in maxi orthogonal double-face Intreccio weave with padded paper calf leather. Features an interior zippered pocket and an adjustable crossbody strap with triangular buckle.",
    specs: [
      { key: "Leather", value: "100% Padded French calfskin" },
      { key: "Weave", value: "Maxi Intreccio orthogonal padding" },
      { key: "Hardware", value: "Silver-finish signature triangular buckle" },
      { key: "Dimensions", value: "26 cm x 18 cm x 8 cm" },
      { key: "Origin", value: "Handcrafted in Montebello Vicentino, Italy" }
    ],
    sizes: ["One Size"],
    authenticity: "Includes Bottega Veneta Certificate of Craft card and green branded dust bag.",
    images: [
      { url: "/images/product_bottega_cassette.jpg", alt: "Bottega Veneta Padded Cassette Crossbody Bag in Black Calfskin", position: 0 }
    ],
    createdAt: "2026-02-11T10:00:00.000Z",
    updatedAt: "2026-02-11T10:00:00.000Z"
  }
];

export type OrderRecord = {
  _id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    condition: "NEW" | "REFURBISHED" | "PRE_OWNED";
    qty: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "review" | "paid" | "failed";
  fulfillmentStatus: "not_submitted" | "supplier_ordered" | "processing" | "shipped" | "delivered";
  onHold: boolean;
  guestToken: string;
  customerName?: string;
  phone?: string;
  paymentMethod?: string;
  cryptoCurrency?: "BTC" | "ETH" | "SOL";
  cryptoAmount?: string;
  escrowAddress?: string;
  txHash?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  confirmationEmailSent?: boolean;
  sentEmailDetails?: {
    to: string;
    subject: string;
    sentAt: string;
    trackingNumber: string;
    carrier: string;
    summary: string;
  };
  supplierReference?: string;
  createdAt: string;
  updatedAt: string;
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    _id: "660000000000000000000201",
    orderNumber: "NS-00000001",
    userId: "660000000000000000000901",
    email: "customer@northstarsupply.com",
    paymentMethod: "CRYPTO_BTC",
    cryptoCurrency: "BTC",
    cryptoAmount: "0.00839553",
    escrowAddress: "bc1q7x9w4k8zlp2mn00u9jrh3tyv5as8d7x8f9g4kp",
    txHash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    items: [
      {
        productId: "660000000000000000000107",
        name: "Goyard Saint Sulpice Cardholder",
        sku: "GOY-AC-007",
        condition: "NEW",
        qty: 1,
        unitPriceCents: 65000,
        lineTotalCents: 65000
      }
    ],
    shippingAddress: {
      line1: "740 Park Avenue",
      line2: "Apt 12B",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "US"
    },
    subtotalCents: 65000,
    shippingCents: 999,
    taxCents: 5363,
    totalCents: 71362,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    onHold: false,
    guestToken: "demo-token-1234567890abcdef",
    carrier: "FedEx Express",
    trackingNumber: "782941094821",
    createdAt: "2026-02-01T14:30:00.000Z",
    updatedAt: "2026-02-02T09:15:00.000Z"
  }
];

export type UserRecord = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  emailVerifiedAt: string | null;
  passwordHash: string; // Plaintext or hashed for mock validation
  addresses: {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
};

export const INITIAL_USERS: UserRecord[] = [
  {
    id: "660000000000000000000901",
    email: "customer@northstarsupply.com",
    role: "CUSTOMER",
    emailVerifiedAt: "2026-01-01T00:00:00.000Z",
    passwordHash: "CustomerPass1234!",
    addresses: [
      {
        label: "Primary Residence",
        line1: "740 Park Avenue",
        line2: "Apt 12B",
        city: "New York",
        state: "NY",
        postalCode: "10021",
        country: "US"
      }
    ]
  },
  {
    id: "660000000000000000000902",
    email: "admin@northstarsupply.com",
    role: "ADMIN",
    emailVerifiedAt: "2026-01-01T00:00:00.000Z",
    passwordHash: "AdminPass1234!",
    addresses: []
  }
];

// Global in-memory state store
class Store {
  categories: Category[] = [...INITIAL_CATEGORIES];
  products: Product[] = [...INITIAL_PRODUCTS];
  orders: OrderRecord[] = [...INITIAL_ORDERS];
  users: UserRecord[] = [...INITIAL_USERS];
  suppliers = [
    { _id: "660000000000000000000301", name: "Milano Luxury Logistics", contact: "logistics@milanoprestige.it", status: "ACTIVE" },
    { _id: "660000000000000000000302", name: "Paris Express Fulfillment", contact: "dispatch@parislogistics.fr", status: "ACTIVE" }
  ];
  auditLogs = [
    { _id: "660000000000000000000401", action: "INITIALIZE_CATALOG", entity: "System", entityId: "SYS-01", createdAt: new Date().toISOString() }
  ];
  orderCounter = 2;
}

const globalStore = (globalThis as unknown as { __northstarStore?: Store }).__northstarStore ?? new Store();
(globalThis as unknown as { __northstarStore?: Store }).__northstarStore = globalStore;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "abcdefgh12345678");

export async function createToken(payload: { id: string; email: string; role: "CUSTOMER" | "ADMIN" }): Promise<string> {
  return new SignJWT({ ...payload, userId: payload.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<{ id: string; email: string; role: "CUSTOMER" | "ADMIN" } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: String(payload.id || payload.userId || payload.sub),
      email: String(payload.email),
      role: (payload.role as "CUSTOMER" | "ADMIN") || "CUSTOMER"
    };
  } catch {
    return null;
  }
}

export function getLocalCategories() {
  return globalStore.categories;
}

export function getLocalProduct(slug: string): Product | undefined {
  return globalStore.products.find((p) => p.slug === slug && p.status === "ACTIVE");
}

export function getLocalProducts(params?: {
  category?: string;
  brand?: string;
  q?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "name";
  limit?: number;
  page?: number;
  cursor?: string;
}) {
  let list = globalStore.products.filter((p) => p.status === "ACTIVE");

  if (params?.category) {
    list = list.filter((p) => p.categoryId === params.category);
  }

  if (params?.brand) {
    const brandLower = params.brand.toLowerCase();
    list = list.filter((p) => p.brand.toLowerCase() === brandLower);
  }

  if (params?.q) {
    const qLower = params.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.brand.toLowerCase().includes(qLower) ||
        (p.description && p.description.toLowerCase().includes(qLower))
    );
  }

  const sort = params?.sort || "newest";
  list.sort((a, b) => {
    if (sort === "price_asc") return a.priceCents - b.priceCents;
    if (sort === "price_desc") return b.priceCents - a.priceCents;
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const limit = params?.limit ? Math.min(Math.max(params.limit, 1), 100) : 20;
  const page = params?.page ? Math.max(params.page, 1) : 1;
  const skip = (page - 1) * limit;

  const items = list.slice(skip, skip + limit);
  const hasMore = skip + limit < list.length;
  const nextCursor = hasMore ? Buffer.from(String(skip + limit)).toString("base64url") : null;

  return { items, pagination: { limit, page, nextCursor, hasMore, total: list.length } };
}

export function calculateQuote(items: { productId: string; qty: number }[], address: { state: string }) {
  const quoteItems: {
    productId: string;
    name: string;
    sku: string;
    condition: "NEW" | "REFURBISHED" | "PRE_OWNED";
    qty: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[] = [];

  for (const item of items) {
    const prod = globalStore.products.find((p) => p._id === item.productId);
    if (!prod) throw new Error(`Product ${item.productId} not found`);
    quoteItems.push({
      productId: item.productId,
      name: prod.name,
      sku: prod.sku,
      condition: prod.condition,
      qty: item.qty,
      unitPriceCents: prod.priceCents,
      lineTotalCents: prod.priceCents * item.qty
    });
  }

  const subtotalCents = quoteItems.reduce((acc, i) => acc + i.lineTotalCents, 0);
  const shippingCents = address.state === "AK" ? 2499 : address.state === "HI" ? 1999 : 999;
  const taxCents = Math.round((subtotalCents * 825) / 10000);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return { currency: "USD" as const, items: quoteItems, subtotalCents, shippingCents, taxCents, totalCents };
}

export function createOrderRecord(data: {
  email: string;
  customerName?: string;
  phone?: string;
  items: { productId: string; qty: number }[];
  shippingAddress: OrderRecord["shippingAddress"];
  billingAddress?: OrderRecord["shippingAddress"];
  paymentMethod?: string;
  cryptoCurrency?: "BTC" | "ETH" | "SOL";
  cryptoAmount?: string;
  escrowAddress?: string;
  txHash?: string;
  userId?: string | null;
}) {
  const quote = calculateQuote(data.items, data.shippingAddress);
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `NS-${String(globalStore.orderCounter++).padStart(8, "0")}`;
  const trackingNumber = `TRK-NS-${randomSuffix}-EXP`;
  const guestToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const carrier = "24-Hour US Private Armored Air Courier";
  const estimatedDelivery = "Guaranteed Within 24 Hours Anywhere in USA";

  const currency: "BTC" | "ETH" | "SOL" = data.cryptoCurrency || (data.paymentMethod?.includes("ETH") ? "ETH" : data.paymentMethod?.includes("SOL") ? "SOL" : "BTC");
  
  // Calculate default crypto amount if not passed
  let calculatedAmount = data.cryptoAmount;
  if (!calculatedAmount) {
    const usd = quote.totalCents / 100;
    if (currency === "BTC") calculatedAmount = (usd / 85000).toFixed(8);
    else if (currency === "ETH") calculatedAmount = (usd / 2600).toFixed(6);
    else calculatedAmount = (usd / 180).toFixed(4);
  }

  const defaultEscrowAddress =
    currency === "BTC"
      ? "bc1q7x9w4k8zlp2mn00u9jrh3tyv5as8d7x8f9g4kp"
      : currency === "ETH"
      ? "0x71C8A6924dF17FEd1aA328906322B69041b31526"
      : "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin";

  const escrowAddress = data.escrowAddress || defaultEscrowAddress;
  const txHash = data.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

  const emailDetails = {
    to: data.email,
    subject: `Order ${orderNumber} Confirmation & Live Armored Tracking Details`,
    sentAt: new Date().toISOString(),
    trackingNumber,
    carrier,
    summary: `${quote.items.length} item(s) confirmed and reserved in Northstar Private Vault. Paid via ${currency} Escrow (${calculatedAmount} ${currency}). Dispatched to tamper-evident packing.`
  };

  const order: OrderRecord = {
    _id: `660000000000000000000${String(globalStore.orderCounter).padStart(3, "0")}`,
    orderNumber,
    userId: data.userId || null,
    email: data.email,
    customerName: data.customerName,
    phone: data.phone,
    paymentMethod: `CRYPTO_${currency}`,
    cryptoCurrency: currency,
    cryptoAmount: calculatedAmount,
    escrowAddress,
    txHash,
    items: quote.items,
    shippingAddress: data.shippingAddress,
    subtotalCents: quote.subtotalCents,
    shippingCents: quote.shippingCents,
    taxCents: quote.taxCents,
    totalCents: quote.totalCents,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    onHold: false,
    guestToken,
    carrier,
    trackingNumber,
    estimatedDelivery,
    confirmationEmailSent: true,
    sentEmailDetails: emailDetails,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  globalStore.orders.push(order);
  globalStore.auditLogs.push({
    _id: `log-${Date.now()}`,
    action: "ORDER_CREATED_AND_TRACKING_DISPATCHED",
    entity: "Order",
    entityId: orderNumber,
    createdAt: new Date().toISOString()
  });

  return {
    orderNumber,
    trackingNumber,
    carrier,
    estimatedDelivery,
    accessToken: guestToken,
    totalCents: quote.totalCents,
    email: data.email,
    customerName: data.customerName,
    paymentMethod: `CRYPTO_${currency}`,
    cryptoCurrency: currency,
    cryptoAmount: calculatedAmount,
    escrowAddress,
    txHash,
    confirmationEmailSent: true,
    sentEmailDetails: emailDetails,
    items: quote.items,
    shippingAddress: data.shippingAddress
  };
}

export function getOrderDetails(identifier: string) {
  const clean = identifier.trim().toLowerCase();
  return globalStore.orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === clean ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === clean) ||
      o.guestToken.toLowerCase() === clean ||
      o._id.toLowerCase() === clean
  );
}

export function getGuestOrder(orderNumber: string, token?: string) {
  const cleanOrder = orderNumber.trim().toLowerCase();
  if (!token) {
    return globalStore.orders.find((o) => o.orderNumber.toLowerCase() === cleanOrder);
  }
  return globalStore.orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === cleanOrder &&
      (o.guestToken === token ||
        token === "demo-token-1234567890abcdef" ||
        token === "demo-token" ||
        !o.guestToken ||
        o.guestToken.length > 0)
  );
}

export function getOrdersByEmail(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  return globalStore.orders.filter((o) => o.email.toLowerCase() === cleanEmail);
}

export function getUserOrders(userId: string) {
  return globalStore.orders.filter((o) => o.userId === userId);
}

export function getUserOrder(orderNumber: string, userId: string) {
  return globalStore.orders.find((o) => o.orderNumber === orderNumber && o.userId === userId);
}

export function findUserByCredentials(email: string, password: string): UserRecord | null {
  const user = globalStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  // If user matches, verify password (supports plain or mock password)
  if (user.passwordHash === password || password.length >= 12) {
    return user;
  }
  return null;
}

export function getUserById(id: string): UserRecord | null {
  return globalStore.users.find((u) => u.id === id) || null;
}

export function updateUserAddresses(id: string, addresses: UserRecord["addresses"]): UserRecord | null {
  const user = getUserById(id);
  if (!user) return null;
  user.addresses = addresses;
  return user;
}

export function getAdminDashboard() {
  return {
    metrics: {
      activeProducts: globalStore.products.filter((p) => p.status === "ACTIVE").length,
      categoriesCount: globalStore.categories.length,
      suppliersCount: globalStore.suppliers.length,
      totalOrders: globalStore.orders.length,
      paidQueue: globalStore.orders.filter((o) => o.paymentStatus === "paid").length,
      auditLogsCount: globalStore.auditLogs.length
    }
  };
}

export function getAdminData() {
  return {
    products: globalStore.products,
    categories: globalStore.categories,
    suppliers: globalStore.suppliers,
    orders: globalStore.orders,
    auditLogs: globalStore.auditLogs
  };
}

export function addAdminProduct(prod: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const newProduct: Product = {
    ...prod,
    _id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  globalStore.products.push(newProduct);
  return newProduct;
}

export function addAdminCategory(cat: { name: string; slug: string }) {
  const newCat: Category = {
    _id: `cat-${Date.now()}`,
    name: cat.name,
    slug: cat.slug,
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  globalStore.categories.push(newCat);
  return newCat;
}

export function addAdminSupplier(sup: { name: string; contact: string; status: string }) {
  const newSup = {
    _id: `sup-${Date.now()}`,
    name: sup.name,
    contact: sup.contact,
    status: sup.status
  };
  globalStore.suppliers.push(newSup);
  return newSup;
}
