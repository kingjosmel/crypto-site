import { auth } from "@/auth";
import { getUserById, getUserOrder, getUserOrders } from "./catalogData";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3000";

export async function accountFetch<T>(path: string): Promise<T> {
  const session = await auth();
  if (!session?.accessToken) throw new Error("AUTH_REQUIRED");

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      headers: { authorization: `Bearer ${session.accessToken}` },
      cache: "no-store"
    });
    if (response.ok) {
      return (await response.json()) as T;
    }
  } catch {
    // Fallback to local store
  }

  const userId = session.user?.id;
  if (!userId) throw new Error("User ID missing from session");

  if (path === "/me") {
    const user = getUserById(userId);
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      addresses: user.addresses
    } as unknown as T;
  }

  if (path === "/orders") {
    const orders = getUserOrders(userId);
    return { items: orders } as unknown as T;
  }

  if (path.startsWith("/orders/")) {
    const orderNumber = path.replace("/orders/", "");
    const order = getUserOrder(orderNumber, userId);
    if (!order) throw new Error("Order not found");
    return order as unknown as T;
  }

  throw new Error(`Endpoint ${path} not available`);
}

export type Account = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  emailVerifiedAt: string | null;
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

export type AccountOrder = {
  _id: string;
  orderNumber: string;
  email: string;
  items: { name: string; qty: number; lineTotalCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};
