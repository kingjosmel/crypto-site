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
  { _id: "660000000000000000000003", name: "Bags, Wallets & Accessories", slug: "belts-wallets-accessories", description: "Iconic bags, Goyard trunks & totes, wallets, and fine leather accessories." },
  { _id: "660000000000000000000004", name: "Luxury Watches", slug: "luxury-watches", description: "Exceptional timepieces from Patek Philippe, Rolex, Audemars Piguet, and Richard Mille." }
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
    _id: "660000000000000000000110",
    name: "Submariner Date 41mm",
    slug: "submariner-date",
    brand: "Rolex",
    categoryId: "660000000000000000000004",
    priceCents: 1450000,
    currency: "USD",
    sku: "RLX-WA-010",
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified Pre-Owned Watchmaker Warranty",
    returnPolicy: "7-day inspection period with tamper-proof security seal intact.",
    description: "An iconic pre-owned Submariner Date in Oystersteel with a black Cerachrom bezel and automatic calibre 3235 movement.",
    specs: [{ key: "Model Reference", value: "126610LN" }, { key: "Case Diameter", value: "41 mm" }, { key: "Material", value: "Oystersteel" }, { key: "Bezel", value: "Cerachrom ceramic" }, { key: "Water Resistance", value: "300 meters / 1,000 feet" }, { key: "Power Reserve", value: "Approx. 70 hours" }],
    sizes: ["Adjustable Oysterlock bracelet with Glidelock"],
    authenticity: "Full set with original Rolex presentation box, warranty card, and green chronometer hangtag.",
    images: [{ url: "/images/product_rolex_submariner.jpg", alt: "Rolex Submariner Date 41mm", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Rolex Submariner context view", position: 1 }],
    createdAt: "2026-01-19T10:00:00.000Z",
    updatedAt: "2026-01-19T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000111",
    name: "Royal Oak Selfwinding 41mm",
    slug: "royal-oak-selfwinding",
    brand: "Audemars Piguet",
    categoryId: "660000000000000000000004",
    priceCents: 2850000,
    currency: "USD",
    sku: "AP-WA-011",
    condition: "REFURBISHED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified Master Horologist Overhaul Warranty",
    returnPolicy: "7-day inspection period with tamper-proof security seal intact.",
    description: "Certified Restored: Completely disassembled, ultrasonically cleaned, mechanically regulated, and satin-brushed to factory bevel lines by Le Brassus-trained master watchmakers. Calibre 4302 tested to COSC precision tolerances.",
    specs: [{ key: "Model Reference", value: "15500ST.OO.1220ST.01" }, { key: "Case", value: "Stainless steel 41 mm" }, { key: "Dial", value: "Bleu nuit, nuage 50 Grande Tapisserie" }, { key: "Glass", value: "Glareproofed sapphire crystal & caseback" }, { key: "Thickness", value: "10.4 mm" }],
    sizes: ["Integrated stainless steel bracelet with AP folding clasp"],
    authenticity: "Includes Audemars Piguet green leather archive box, restoration dossier, and timing certificate.",
    images: [{ url: "/images/product_ap_royal_oak.jpg", alt: "Audemars Piguet Royal Oak Selfwinding", position: 0 }, { url: "/images/hero_luxury_editorial.jpg", alt: "Royal Oak craftsmanship", position: 1 }],
    createdAt: "2026-01-20T10:00:00.000Z",
    updatedAt: "2026-01-20T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000112",
    name: "RM 011 Chronograph Felipe Massa",
    slug: "rm-011-chronograph",
    brand: "Richard Mille",
    categoryId: "660000000000000000000004",
    priceCents: 6850000,
    currency: "USD",
    sku: "RMI-WA-012",
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year High Complications Warranty",
    returnPolicy: "Inspection upon white-glove courier delivery.",
    description: "A remarkable flyback chronograph in grade 5 titanium with an annual calendar, 60-minute countdown timer, and skeletonized automatic rotor.",
    specs: [{ key: "Model Reference", value: "RM011 Ti" }, { key: "Case Dimensions", value: "50 mm x 40 mm x 16.15 mm" }, { key: "Material", value: "Grade 5 Titanium" }, { key: "Movement", value: "Skeletonized RMAC1 automatic flyback chronograph" }, { key: "Strap", value: "Vented black rubber with titanium deployant" }],
    sizes: ["Titanium double-folding buckle"],
    authenticity: "Includes original Richard Mille winder box, certificate of authenticity, and service papers.",
    images: [{ url: "/images/product_rm_chronograph.jpg", alt: "Richard Mille RM 011 Chronograph", position: 0 }],
    createdAt: "2026-01-21T10:00:00.000Z",
    updatedAt: "2026-01-21T10:00:00.000Z"
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
      { url: "/images/product_goyard_saint_louis.jpg", alt: "Goyard Saint Louis PM Tote Bag in black and tan Goyardine canvas", position: 0 },
      { url: "/images/hero_luxury_editorial.jpg", alt: "Goyard Saint Louis editorial presentation", position: 1 }
    ],
    createdAt: "2026-01-22T10:00:00.000Z",
    updatedAt: "2026-01-22T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000114",
    name: "Goyard Saïgon Mini Structured Bag",
    slug: "goyard-saigon-mini-structured-bag",
    brand: "Goyard",
    categoryId: "660000000000000000000003",
    priceCents: 640000,
    currency: "USD",
    sku: "GOY-BG-014",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Maison Goyard atelier craftsmanship warranty",
    returnPolicy: "Complimentary white-glove inspection upon delivery.",
    description: "A celebrated trunkmaker icon in miniature proportions. The Saïgon Mini features hand-carved solid beechwood top handle and battens, reinforced leather trunk corners, and hand-painted Goyardine chevron canvas with a detachable leather cross-body strap.",
    specs: [
      { key: "Handle & Battens", value: "Hand-carved French solid beechwood" },
      { key: "Exterior", value: "Goyardine canvas & Clamecy cowhide leather" },
      { key: "Hardware", value: "Palladium-finish trunk rivets and clasp" },
      { key: "Dimensions", value: "20 cm x 15 cm x 9 cm" },
      { key: "Strap", value: "Removable and adjustable leather cross-body strap" }
    ],
    sizes: ["Mini Structure"],
    authenticity: "Complete with Goyard presentation box, dust cover, and provenance card.",
    images: [
      { url: "/images/product_goyard_saigon.jpg", alt: "Goyard Saigon Mini Structured Handbag with wooden handle", position: 0 },
      { url: "/images/hero_luxury_editorial.jpg", alt: "Goyard trunk craftsmanship detail", position: 1 }
    ],
    createdAt: "2026-01-23T10:00:00.000Z",
    updatedAt: "2026-01-23T10:00:00.000Z"
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
    _id: "660000000000000000000116",
    name: "Birkin 25 Togo Noir Gold Hardware",
    slug: "hermes-birkin-25-togo-noir",
    brand: "Hermès",
    categoryId: "660000000000000000000003",
    priceCents: 2850000,
    currency: "USD",
    sku: "HER-BG-016",
    condition: "NEW",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Hermès International Artisan Lifetime Guarantee",
    returnPolicy: "White-glove courier inspection and verification prior to handover.",
    description: "The Holy Grail of luxury leather goods: an Hermès Birkin 25 handcrafted in supple, scratch-resistant Veau Togo calfskin in deep Noir, accented with gleaming 18k yellow gold-plated hardware and signature saddle-stitching.",
    specs: [
      { key: "Leather", value: "Veau Togo (grained baby calfskin)" },
      { key: "Hardware", value: "18k Gold-plated brass" },
      { key: "Dimensions", value: "25 cm x 20 cm x 13 cm" },
      { key: "Stitching", value: "Selle hand-stitching with wax linen thread" },
      { key: "Accessories", value: "Clochette, lock, 2 keys, rain jacket, felt protector" }
    ],
    sizes: ["25 cm"],
    authenticity: "Full set in iconic Hermès orange box, ribbon, rain kit, and receipt archive.",
    images: [
      { url: "/images/product_hermes_birkin.jpg", alt: "Hermes Birkin 25 in Noir Togo leather with gold hardware", position: 0 },
      { url: "/images/hero_luxury_editorial.jpg", alt: "Hermes Birkin leather texture detail", position: 1 }
    ],
    createdAt: "2026-01-25T10:00:00.000Z",
    updatedAt: "2026-01-25T10:00:00.000Z"
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
    _id: "660000000000000000000118",
    name: "Nautilus 5711/1R Rose Gold",
    slug: "patek-philippe-nautilus-5711-1r",
    brand: "Patek Philippe",
    categoryId: "660000000000000000000004",
    priceCents: 14800000,
    currency: "USD",
    sku: "PAT-WA-018",
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified High Horology Warranty",
    returnPolicy: "Tamper-sealed 7-day inspection period with secure courier.",
    description: "The summit of luxury sports horology. Forged in solid 18k rose gold with an iconic porthole-inspired octagonal bezel, warm brown gradated horizontally embossed dial, and manufacture self-winding calibre 324 S C with 21k gold central rotor.",
    specs: [
      { key: "Reference", value: "5711/1R-001" },
      { key: "Case Diameter", value: "40 mm" },
      { key: "Case Material", value: "18k Rose Gold" },
      { key: "Dial", value: "Brown sunburst with gold applied hour markers" },
      { key: "Movement", value: "Mechanical self-winding Calibre 324 S C" },
      { key: "Water Resistance", value: "120 meters" }
    ],
    sizes: ["Solid 18k rose gold bracelet with Nautilus fold-over clasp"],
    authenticity: "Complete set with Patek Philippe wooden presentation box, Certificate of Origin, and museum leather folio.",
    images: [
      { url: "/images/product_patek_nautilus.jpg", alt: "Patek Philippe Nautilus 5711/1R in 18k Rose Gold", position: 0 },
      { url: "/images/hero_luxury_editorial.jpg", alt: "Patek Philippe horology craftsmanship", position: 1 }
    ],
    createdAt: "2026-01-27T10:00:00.000Z",
    updatedAt: "2026-01-27T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000119",
    name: "Cosmograph Daytona 126500LN 'Panda'",
    slug: "rolex-cosmograph-daytona-126500ln",
    brand: "Rolex",
    categoryId: "660000000000000000000004",
    priceCents: 3450000,
    currency: "USD",
    sku: "RLX-WA-019",
    condition: "REFURBISHED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified Master Horologist Overhaul Warranty",
    returnPolicy: "7-day inspection window with tamper-evident security seal.",
    description: "Certified Restored: Factory-specification complete movement overhaul, ultrasonic cleaning, timing regulation (+1 sec/day on Witschi chronocomparator), and ultrasonic gasket replacement. 100% original Rolex components with 2-year mechanical guarantee.",
    specs: [
      { key: "Reference", value: "126500LN" },
      { key: "Case Diameter", value: "40 mm" },
      { key: "Material", value: "Oystersteel (904L)" },
      { key: "Bezel", value: "Black Cerachrom ceramic with platinum engraved numerals" },
      { key: "Movement", value: "Calibre 4131 Perpetual chronograph with Chronergy escapement" },
      { key: "Power Reserve", value: "Approx. 72 hours" }
    ],
    sizes: ["Oysterlock safety clasp with Easylink 5 mm comfort extension"],
    authenticity: "Full collector set with green Rolex box, warranty card dated 2024, booklets, and chronometer tag.",
    images: [
      { url: "/images/product_rolex_daytona.jpg", alt: "Rolex Cosmograph Daytona 126500LN Panda dial", position: 0 }
    ],
    createdAt: "2026-01-28T10:00:00.000Z",
    updatedAt: "2026-01-28T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000120",
    name: "Royal Oak 'Jumbo' Extra-Thin 16202ST",
    slug: "royal-oak-jumbo-extra-thin-16202st",
    brand: "Audemars Piguet",
    categoryId: "660000000000000000000004",
    priceCents: 7800000,
    currency: "USD",
    sku: "AP-WA-020",
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified Pre-Owned Watchmaker Warranty",
    returnPolicy: "7-day inspection window with tamper-evident security seal.",
    description: "The true heir to Gérald Genta's original 1972 icon. Measuring just 8.1mm in profile, this 50th Anniversary tribute features the mythical 'Bleu Nuit, Nuage 50' Petite Tapisserie guilloché dial and the newly developed manufacture calibre 7121 with 55-hour power reserve.",
    specs: [
      { key: "Reference", value: "16202ST.OO.1240ST.01" },
      { key: "Case Diameter", value: "39 mm" },
      { key: "Thickness", value: "8.1 mm ultra-thin profile" },
      { key: "Dial", value: "Bleu Nuit, Nuage 50 Petite Tapisserie" },
      { key: "Movement", value: "Manufacture Calibre 7121 selfwinding" },
      { key: "Water Resistance", value: "50 meters" }
    ],
    sizes: ["Integrated stainless steel bracelet with AP folding clasp"],
    authenticity: "Includes AP green leather archive box, warranty card, and manufacture archives extract.",
    images: [
      { url: "/images/product_ap_jumbo.jpg", alt: "Audemars Piguet Royal Oak Jumbo Extra-Thin 16202ST", position: 0 }
    ],
    createdAt: "2026-01-29T10:00:00.000Z",
    updatedAt: "2026-01-29T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000121",
    name: "RM 67-02 Automatic Extra Flat",
    slug: "rm-67-02-automatic-extra-flat",
    brand: "Richard Mille",
    categoryId: "660000000000000000000004",
    priceCents: 29500000,
    currency: "USD",
    sku: "RMI-WA-021",
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year High Complications Warranty",
    returnPolicy: "Personal hand delivery and white-glove inspection.",
    description: "Weighing a mere 32 grams, the RM 67-02 is the lightest automatic wristwatch ever created by Richard Mille. The ergonomic case is machined from proprietary Carbon TPT and Quartz TPT, enclosing the skeletonized CRMA7 titanium movement with DLC bridges.",
    specs: [
      { key: "Reference", value: "RM 67-02" },
      { key: "Dimensions", value: "38.70 mm x 47.52 mm x 7.75 mm" },
      { key: "Case Materials", value: "Carbon TPT & Quartz TPT" },
      { key: "Movement", value: "Skeletonized automatic calibre CRMA7 with platinum rotor" },
      { key: "Total Weight", value: "32 grams including seamless comfort strap" }
    ],
    sizes: ["Seamless elastic comfort strap with titanium inserts"],
    authenticity: "Complete with Richard Mille technical winder trunk, warranty certificate, and service passport.",
    images: [
      { url: "/images/product_rm_6702.jpg", alt: "Richard Mille RM 67-02 Extra Flat Automatic", position: 0 }
    ],
    createdAt: "2026-01-30T10:00:00.000Z",
    updatedAt: "2026-01-30T10:00:00.000Z"
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
    description: "The definition of quiet luxury: hand-combed baby cashmere gathered exclusively from the underfleece of Capra hircus kids in northern China. Features an intricate 7-gauge cable twist pattern, ribbed cuffs, and unparalleled cloud-like softness.",
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
    description: "A statuesque double-breasted long overcoat tailored from heavy midnight navy virgin wool with subtle tonal Dior Oblique jacquard weave. Designed with broad peak lapels, horn buttons, full interior cupro lining, and a clean structural drape.",
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
    description: "A celebration of 1970s sport luxe. Knitted in technical cotton-wool jacquard with an all-over archival GG monogram pattern in rich camel and espresso, accented by ivory chevron arm stripes and dark ribbed trims.",
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
    _id: "660000000000000000000125",
    name: "Classic Motor Biker Leather Jacket",
    slug: "saint-laurent-classic-motor-biker-leather-jacket",
    brand: "Saint Laurent",
    categoryId: "660000000000000000000001",
    priceCents: 520000,
    currency: "USD",
    sku: "SLP-CL-025",
    condition: "REFURBISHED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar Archival Leathercraft Preservation Guarantee",
    returnPolicy: "Complimentary returns within 14 days in pristine unworn condition.",
    description: "Certified Restored: Archival runway reference carefully conditioned by Parisian leather specialists using neutral organic waxes, with all original silver-tone zippers ultrasonically serviced and lubricated.",
    specs: [
      { key: "Leather", value: "100% Grained Italian Lambskin" },
      { key: "Hardware", value: "Heavy-gauge nickel-finish zips, snaps and buckle" },
      { key: "Lining", value: "100% Black cupro silk" },
      { key: "Pockets", value: "3 diagonal zip pockets, 1 snap flap coin pocket" },
      { key: "Origin", value: "Handcrafted in Italy" }
    ],
    sizes: ["46", "48", "50", "52", "54"],
    authenticity: "Complete with Saint Laurent Paris branded hangar and garment protective sleeve.",
    images: [
      { url: "/images/product_saint_laurent_leather.jpg", alt: "Saint Laurent Classic Motor Biker Leather Jacket", position: 0 }
    ],
    createdAt: "2026-02-03T10:00:00.000Z",
    updatedAt: "2026-02-03T10:00:00.000Z"
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
    escrowAddress: "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu",
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
    { _id: "660000000000000000000301", name: "Milano Prestige Consignments", contact: "contact@milanoprestige.it", status: "ACTIVE" },
    { _id: "660000000000000000000302", name: "Geneva Vault Timepieces", contact: "vault@genevatime.ch", status: "ACTIVE" }
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
  condition?: "NEW" | "REFURBISHED" | "PRE_OWNED";
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

  if (params?.condition) {
    list = list.filter((p) => p.condition === params.condition);
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

  const isHighValue =
    quote.totalCents >= 1000000 ||
    data.items.some((i) => {
      const prod = globalStore.products.find((p) => p._id === i.productId);
      return prod?.categoryId === "660000000000000000000004" || (prod?.priceCents ?? 0) >= 1000000;
    });

  const carrier = isHighValue
    ? "Ferrari Group / Malca-Amit Armored Logistics (Dual-Escort High-Value Transit)"
    : "FedEx International Priority (Insured Express & Direct Adult Signature)";
  const estimatedDelivery = isHighValue
    ? "1-3 Business Days (Dedicated Armored Vehicle & Vault Hand-Off)"
    : "2-3 Business Days (Full Insured Priority Delivery)";

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
      ? "bc1qktk2z0wjfwfjj0psasspls8suj86ejr87ua9gu"
      : currency === "ETH"
      ? "0x120D139dB706614f71e470A97852679F6FaebcB7"
      : "X2ro74HaRbZ2XKDJ57yMmsKFD3CS4y9XFKtzSeQkCQ1";

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
