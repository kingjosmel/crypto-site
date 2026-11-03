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
  return condition === "PRE_OWNED" ? "Pre-owned" : condition === "REFURBISHED" ? "Refurbished" : "New";
}
