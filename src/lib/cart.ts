export type CartItem = { productId: string; slug: string; name: string; priceCents: number; imageUrl?: string; qty: number };
export const CART_KEY = "northstar-cart";
export function parseCart(raw: string): CartItem[] { try { const value: unknown = JSON.parse(raw); return Array.isArray(value) ? value.filter((item): item is CartItem => Boolean(item && typeof item === "object" && "productId" in item && "qty" in item)) : []; } catch { return []; } }
export function readCart(): CartItem[] { if (typeof window === "undefined") return []; return parseCart(localStorage.getItem(CART_KEY) ?? "[]"); }
export function writeCart(items: CartItem[]) { localStorage.setItem(CART_KEY, JSON.stringify(items)); window.dispatchEvent(new Event("northstar-cart-change")); }
export function addToCart(item: Omit<CartItem, "qty">) { const cart = readCart(); const existing = cart.find((entry) => entry.productId === item.productId); if (existing) existing.qty = Math.min(10, existing.qty + 1); else cart.push({ ...item, qty: 1 }); writeCart(cart); }
