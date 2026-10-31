import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { accountFetch, type AccountOrder } from "@/lib/account";
import { formatPrice } from "@/lib/api";
import { SiteShell } from "@/components/SiteShell";
export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) { if (!(await auth())) redirect("/login"); let order: AccountOrder; try { order = await accountFetch<AccountOrder>(`/orders/${(await params).orderNumber}`); } catch { notFound(); } return <SiteShell><section className="account-panel"><p className="eyebrow">Order {order.orderNumber}</p><h1>{formatPrice(order.totalCents)}</h1><div className="status-grid"><div><span>Payment</span><strong>{order.paymentStatus}</strong></div><div><span>Shipping</span><strong>{order.fulfillmentStatus}</strong></div><div><span>Order</span><strong>{order.orderStatus}</strong></div></div>{order.items.map((item) => <div className="account-order" key={item.name}><span>{item.name} × {item.qty}</span><strong>{formatPrice(item.lineTotalCents)}</strong></div>)}</section></SiteShell>; }
