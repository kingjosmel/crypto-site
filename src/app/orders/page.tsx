import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { accountFetch } from "@/lib/account";
import { formatPrice } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
export default async function OrdersPage() { if (!(await auth())) redirect("/login"); const result = await accountFetch<{ items: { orderNumber: string; totalCents: number; orderStatus: string; paymentStatus: string; fulfillmentStatus: string; createdAt: string }[] }>("/orders"); return <SiteShell><section className="account-panel"><p className="eyebrow">Account</p><h1>Order history.</h1>{result.items.length ? result.items.map((order) => <Link className="account-order" href={`/orders/${order.orderNumber}`} key={order.orderNumber}><span>{order.orderNumber}</span><span>{order.orderStatus} · {order.paymentStatus} · {order.fulfillmentStatus}</span><strong>{formatPrice(order.totalCents)}</strong></Link>) : <p>No orders yet.</p>}</section></SiteShell>; }
