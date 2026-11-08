export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  size?: string;
  qty: number;
};

export const CART_KEY = "northstar-cart";
export const CART_COOKIE_KEY = "northstar_cart";


declare global {
  interface Window {
    __northstarCartCache?: string;
    __openNorthstarCart?: () => void;
    __closeNorthstarCart?: () => void;
  }
}

let memoryFallback: string = "[]";

function getCookieCart(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const prefix = `${CART_COOKIE_KEY}=`;
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      if (part.startsWith(prefix)) {
        const decoded = decodeURIComponent(part.substring(prefix.length));
        if (decoded && decoded.startsWith("[") && decoded.endsWith("]")) {
          return decoded;
        }
      }
    }
  } catch {
    // Cookie read failed
  }
  return null;
}

function setCookieCart(val: string) {
  if (typeof document === "undefined") return;
  try {
    // 7-day persistent cookie with lax samesite
    document.cookie = `${CART_COOKIE_KEY}=${encodeURIComponent(val)}; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // Cookie write failed
  }
}

function safeGetStorage(): string {
  if (typeof window === "undefined") return "[]";

  // 1. Check window-level memory cache
  if (window.__northstarCartCache && window.__northstarCartCache !== "[]") {
    memoryFallback = window.__northstarCartCache;
    return window.__northstarCartCache;
  }

  // 2. Check localStorage
  try {
    const val = window.localStorage?.getItem(CART_KEY);
    if (val && val !== "[]") {
      memoryFallback = val;
      window.__northstarCartCache = val;
      return val;
    }
  } catch {
    // Storage access restricted (private mode or sandbox)
  }

  // 3. Check sessionStorage
  try {
    const sVal = window.sessionStorage?.getItem(CART_KEY);
    if (sVal && sVal !== "[]") {
      memoryFallback = sVal;
      window.__northstarCartCache = sVal;
      return sVal;
    }
  } catch {
    // SessionStorage restricted
  }

  // 4. Check document.cookie
  const cVal = getCookieCart();
  if (cVal && cVal !== "[]") {
    memoryFallback = cVal;
    window.__northstarCartCache = cVal;
    return cVal;
  }

  return memoryFallback;
}

function safeSetStorage(val: string) {
  memoryFallback = val;
  if (typeof window !== "undefined") {
    window.__northstarCartCache = val;

    try {
      window.localStorage?.setItem(CART_KEY, val);
    } catch {
      // Storage access restricted
    }

    try {
      window.sessionStorage?.setItem(CART_KEY, val);
    } catch {
      // SessionStorage restricted
    }

    setCookieCart(val);

    try {
      window.dispatchEvent(new CustomEvent("northstar-cart-change", { detail: val, bubbles: true }));
    } catch {
      window.dispatchEvent(new Event("northstar-cart-change"));
    }
  }
}

export function openCartDrawer() {
  if (typeof window === "undefined") return;
  if (typeof window.__openNorthstarCart === "function") {
    window.__openNorthstarCart();
  }
  try {
    window.dispatchEvent(new CustomEvent("northstar-cart-open", { bubbles: true }));
  } catch {
    window.dispatchEvent(new Event("northstar-cart-open"));
  }
}

export function closeCartDrawer() {
  if (typeof window === "undefined") return;
  if (typeof window.__closeNorthstarCart === "function") {
    window.__closeNorthstarCart();
  }
  try {
    window.dispatchEvent(new CustomEvent("northstar-cart-close", { bubbles: true }));
  } catch {
    window.dispatchEvent(new Event("northstar-cart-close"));
  }
}

export function parseCart(raw: string): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is CartItem =>
          Boolean(item && typeof item === "object" && "productId" in item && "qty" in item)
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function readCart(): CartItem[] {
  return parseCart(safeGetStorage());
}

export function writeCart(items: CartItem[]) {
  safeSetStorage(JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "qty">): CartItem[] {
  const cart = readCart();
  const existing = cart.find(
    (entry) => entry.productId === item.productId && (item.size ? entry.size === item.size : true)
  );
  if (existing) {
    existing.qty = Math.min(10, existing.qty + 1);
  } else {
    cart.push({ ...item, qty: 1 });
  }
  writeCart(cart);
  return cart;
}

export function getCartSnapshot(): string {
  return safeGetStorage();
}

