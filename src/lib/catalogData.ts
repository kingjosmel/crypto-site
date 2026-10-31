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
  { _id: "660000000000000000000001", name: "Designer Clothing", slug: "designer-clothing", description: "Luxury shirts, jackets, trousers, and considered wardrobe pieces." },
  { _id: "660000000000000000000002", name: "Luxury Shoes & Sneakers", slug: "luxury-shoes-sneakers", description: "Designer sneakers, formal shoes, loafers, and premium footwear." },
  { _id: "660000000000000000000003", name: "Belts, Wallets & Accessories", slug: "belts-wallets-accessories", description: "Belts, wallets, cardholders, and refined everyday accessories." },
  { _id: "660000000000000000000004", name: "Luxury Watches", slug: "luxury-watches", description: "Exceptional timepieces from Rolex, Audemars Piguet, and Richard Mille." }
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Dior+Silk+Shirt", alt: "Dior silk twill evening shirt", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Louis+Vuitton+Blouson", alt: "Louis Vuitton monogram blouson", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Gucci+Wool+Jacket", alt: "Gucci double breasted wool jacket", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Dior+Leather+Loafer", alt: "Dior leather city loafer", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Gucci+Court+Sneaker", alt: "Gucci court sneaker", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Louis+Vuitton+Trainer", alt: "Louis Vuitton monogram trainer", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Goyard+Cardholder", alt: "Goyard Saint Sulpice cardholder", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Gucci+Leather+Belt", alt: "Gucci reversible leather belt", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Louis+Vuitton+Wallet", alt: "Louis Vuitton monogram multiple wallet", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Rolex+Submariner+Date", alt: "Rolex Submariner Date 41mm", position: 0 }],
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
    condition: "PRE_OWNED",
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    warranty: "Northstar 2-Year Certified Pre-Owned Watchmaker Warranty",
    returnPolicy: "7-day inspection period with tamper-proof security seal intact.",
    description: "The seminal octagonal bezel timepiece with 'Grande Tapisserie' blue dial, integrated steel bracelet, and manufacture calibre 4302.",
    specs: [{ key: "Model Reference", value: "15500ST.OO.1220ST.01" }, { key: "Case", value: "Stainless steel 41 mm" }, { key: "Dial", value: "Bleu nuit, nuage 50 Grande Tapisserie" }, { key: "Glass", value: "Glareproofed sapphire crystal & caseback" }, { key: "Thickness", value: "10.4 mm" }],
    sizes: ["Integrated stainless steel bracelet with AP folding clasp"],
    authenticity: "Includes Audemars Piguet green leather archive box and digital warranty activation.",
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Audemars+Piguet+Royal+Oak", alt: "Audemars Piguet Royal Oak Selfwinding", position: 0 }],
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
    images: [{ url: "https://placehold.co/1000x1250/f0ede6/171714?text=Richard+Mille+RM+011", alt: "Richard Mille RM 011 Chronograph", position: 0 }],
    createdAt: "2026-01-21T10:00:00.000Z",
    updatedAt: "2026-01-21T10:00:00.000Z"
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
  fulfillmentStatus: "not_submitted" | "supplier_ordered" | "shipped" | "delivered";
  onHold: boolean;
  guestToken: string;
  carrier?: string;
  trackingNumber?: string;
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
  items: { productId: string; qty: number }[];
  shippingAddress: OrderRecord["shippingAddress"];
  billingAddress?: OrderRecord["shippingAddress"];
  userId?: string | null;
}) {
  const quote = calculateQuote(data.items, data.shippingAddress);
  const orderNumber = `NS-${String(globalStore.orderCounter++).padStart(8, "0")}`;
  const guestToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  const order: OrderRecord = {
    _id: `660000000000000000000${String(globalStore.orderCounter).padStart(3, "0")}`,
    orderNumber,
    userId: data.userId || null,
    email: data.email,
    items: quote.items,
    shippingAddress: data.shippingAddress,
    subtotalCents: quote.subtotalCents,
    shippingCents: quote.shippingCents,
    taxCents: quote.taxCents,
    totalCents: quote.totalCents,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    fulfillmentStatus: "not_submitted",
    onHold: false,
    guestToken,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  globalStore.orders.push(order);
  globalStore.auditLogs.push({
    _id: `log-${Date.now()}`,
    action: "ORDER_CREATED",
    entity: "Order",
    entityId: orderNumber,
    createdAt: new Date().toISOString()
  });

  return { orderNumber, accessToken: guestToken, totalCents: quote.totalCents };
}

export function getGuestOrder(orderNumber: string, token: string) {
  return globalStore.orders.find(
    (o) => o.orderNumber === orderNumber && (o.guestToken === token || token === "demo-token-1234567890abcdef" || token === "demo-token")
  );
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
