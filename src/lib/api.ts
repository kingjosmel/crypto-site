export type Image = { url: string; alt: string; position: number };
export type Spec = { key: string; value: string };
export type Category = { _id: string; name: string; slug: string; description?: string };
export type Product = {
  _id: string; name: string; slug: string; brand: string; categoryId: string;
  condition: "NEW" | "REFURBISHED" | "PRE_OWNED"; priceCents: number; currency: "USD";
  sku: string; status: string; stockStatus: string; warranty?: string; returnPolicy?: string;
  description?: string; specs: Spec[]; images: Image[]; sizes: string[]; authenticity?: string; createdAt?: string;
};

export const LUXURY_BRANDS = ["Rolex", "Audemars Piguet", "Richard Mille", "Gucci", "Goyard", "Louis Vuitton", "Dior"] as const;

type ProductResponse = { items: Product[]; pagination?: { hasMore: boolean; nextCursor: string | null } };
const apiUrl = process.env.API_URL ?? "http://localhost:4000";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function getProducts(params = "") {
  return get<ProductResponse>(`/products${params ? `?${params}` : "?limit=12"}`);
}
export function getProduct(slug: string) { return get<Product>(`/products/${encodeURIComponent(slug)}`); }
export function getCategories() { return get<{ items: Category[] }>("/categories"); }
export function formatPrice(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }
export function conditionLabel(condition: Product["condition"]) { return condition === "PRE_OWNED" ? "Pre-owned" : condition === "REFURBISHED" ? "Refurbished" : "New"; }
