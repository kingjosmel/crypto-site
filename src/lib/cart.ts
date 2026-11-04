export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  qty: number;
};

export const CART_KEY = "northstar-cart";

let memoryFallback: string = "[]";

function safeGetStorage(): string {
  if (typeof window === "undefined") return "[]";
  try {
    const val = window.localStorage?.getItem(CART_KEY);
    if (val !== null && val !== undefined) {
      memoryFallback = val;
      return val;
    }
  } catch {
    // Storage access restricted (private mode or sandbox)
  }
  return memoryFallback;
}

function safeSetStorage(val: string) {
  memoryFallback = val;
  if (typeof window !== "undefined") {
    try {
      window.localStorage?.setItem(CART_KEY, val);
    } catch {
      // Storage access restricted
    }
    try {
      window.dispatchEvent(new Event("northstar-cart-change"));
    } catch {
      // Event error
    }
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
  const existing = cart.find((entry) => entry.productId === item.productId);
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
