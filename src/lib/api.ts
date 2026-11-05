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
  "Rolex",
  "Audemars Piguet",
  "Patek Philippe",
  "Richard Mille",
  "Goyard",
  "Hermès",
  "Louis Vuitton",
  "Gucci",
  "Dior",
  "Loro Piana",
  "Saint Laurent"
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
  if (condition === "REFURBISHED") return "Certified Restored / Overhauled";
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
        title: "Unworn / Box & Papers",
        definition: "Brand new, factory-sealed or museum stored. Never worn outside of professional vault cataloging.",
        provenance: "Includes original manufacture presentation box, certificate of origin / warranty card, and all original factory collateral."
      };
    case "PRE_OWNED":
      return {
        title: "Pristine Pre-Owned (Collector Grade 9.5/10)",
        definition: "Pre-owned reference preserved in extraordinary aesthetic and mechanical condition with no aftermarket modifications.",
        provenance: "Verified by master watchmakers / archivists with complete serialized movement and canvas inspection dossier."
      };
    case "REFURBISHED":
      return {
        title: "Certified Restored / Overhauled",
        definition: "Archival piece completely disassembled, ultrasonically cleaned, mechanically regulated, and restored to factory operational tolerances.",
        provenance: "Accompanied by Northstar 2-Year Mechanical Warranty and master horologist service documentation."
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
 * Transparent Carrier Matrix resolving Finding 3:
 * High-value timepieces & rare trunks (> $10k) use Ferrari Group / Malca-Amit armored transport.
 * Ready-to-wear apparel, footwear & accessories (< $10k) use FedEx International Priority (Direct Adult Signature).
 */
export function getShippingCarrierDetails(priceCents: number, categoryId?: string) {
  const isHighValue = priceCents >= 1000000 || categoryId === "660000000000000000000004";
  if (isHighValue) {
    return {
      tier: "High-Value Armored Transport",
      carriers: "Ferrari Group / Malca-Amit Armored Logistics",
      transitTime: "1-3 Business Days",
      features: [
        "Dedicated armored vehicle transport with dual armed escorts",
        "Direct bonded vault-to-door handoff with zero hub sorting",
        "Biometric photo ID and direct recipient signature required",
        "100% full declared-value Lloyd's of London syndicated cargo coverage"
      ]
    };
  }

  return {
    tier: "Secured Express Courier",
    carriers: "FedEx International Priority",
    transitTime: "2-3 Business Days",
    features: [
      "Discreet, unbranded tamper-evident outer presentation container",
      "Direct adult signature required upon physical handoff",
      "Full declared-value cargo transit insurance included at zero surcharge",
      "Continuous GPS scan milestones with end-to-end telemetry"
    ]
  };
}
