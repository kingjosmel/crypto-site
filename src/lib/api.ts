import {
  getLocalCategories,
  getLocalProduct,
  getLocalProducts,
  type Category,
  type Image,
  type Product,
  type Spec
} from "./catalogData";

export type { Category, Image, Product, Spec };

export const LUXURY_BRANDS = [
  "Dior",
  "Gucci",
  "Louis Vuitton",
  "Goyard",
  "Loro Piana"
] as const;

type ProductResponse = {
  items: Product[];
  pagination?: { hasMore: boolean; nextCursor: string | null; total?: number };
};

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3000";

function parseQueryString(paramString: string) {
  const searchParams = new URLSearchParams(paramString);
  return {
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    condition: (searchParams.get("condition") as "NEW" | "REFURBISHED" | "PRE_OWNED") || undefined,
    q: searchParams.get("q") || undefined,
    sort: (searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | "name") || undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined
  };
}

export async function getProducts(params = ""): Promise<ProductResponse> {
  try {
    const url = `${apiUrl}/products${params ? `?${params}` : "?limit=12"}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (response.ok) {
      return (await response.json()) as ProductResponse;
    }
  } catch {
    // Fallback to local catalog
  }

  const queryParams = parseQueryString(params);
  return getLocalProducts(queryParams);
}

export async function getProduct(slug: string): Promise<Product> {
  try {
    const url = `${apiUrl}/products/${encodeURIComponent(slug)}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (response.ok) {
      return (await response.json()) as Product;
    }
  } catch {
    // Fallback to local catalog
  }

  const local = getLocalProduct(slug);
  if (!local) throw new Error("Product not found");
  return local;
}

export async function getCategories(): Promise<{ items: Category[] }> {
  try {
    const url = `${apiUrl}/categories`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (response.ok) {
      return (await response.json()) as { items: Category[] };
    }
  } catch {
    // Fallback to local catalog
  }

  return { items: getLocalCategories() };
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function conditionLabel(condition: Product["condition"]) {
  if (condition === "NEW") return "Unworn / Complete Set";
  if (condition === "PRE_OWNED") return "Pristine Pre-Owned (9.5/10)";
  if (condition === "REFURBISHED") return "Certified Restored / Studio Cleaned";
  return "Verified";
}

export function conditionBadgeShort(condition: Product["condition"]) {
  if (condition === "NEW") return "Unworn";
  if (condition === "PRE_OWNED") return "Pre-Owned";
  if (condition === "REFURBISHED") return "Restored";
  return "Verified";
}

export function conditionDetails(condition: Product["condition"]) {
  switch (condition) {
    case "NEW":
      return {
        title: "Unworn / Complete Presentation Set",
        definition: "Brand new, garment-bag or dust-bag preserved. Never worn outside of professional studio cataloging.",
        provenance: "Includes original house tags, dust covers, authenticity cards, and presentation packaging."
      };
    case "PRE_OWNED":
      return {
        title: "Pristine Pre-Owned (Collector Grade 9.5/10)",
        definition: "Archival piece preserved in remarkable structural and textile condition with no stains, pulls, or alterations.",
        provenance: "Independently verified by luxury fabric and leather authenticators with full stitch and serial audit."
      };
    case "REFURBISHED":
      return {
        title: "Certified Restored / Studio Cleaned",
        definition: "Archival garment or leather piece professionally cleaned, conditioned with pH-balanced balms, and inspected.",
        provenance: "Accompanied by Northstar atelier inspection dossier and authenticity guarantee."
      };
    default:
      return {
        title: "Verified Archive Piece",
        definition: "Inspected and authenticated by Northstar curators.",
        provenance: "Includes archival certification documentation."
      };
  }
}

/**
 * Priority Express Courier:
 * Designer apparel, leather goods, and luxury footwear delivered via FedEx International Priority or DHL Express.
 */
export function getShippingCarrierDetails(..._args: unknown[]) {
  void _args;
  return {
    tier: "Secured Express Courier",
    carriers: "FedEx International Priority / DHL Express",
    transitTime: "2 to 3 Business Days",
    features: [
      "Discreet, unbranded tamper-evident outer presentation container",
      "Direct adult signature required upon physical handoff",
      "Full declared-value cargo transit insurance included at zero surcharge",
      "Continuous GPS scan milestones with end-to-end telemetry"
    ]
  };
}
