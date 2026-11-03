"use client";

import Image from "next/image";
import { useState } from "react";

type AdminClientProps = { accessToken: string };
type Item = Record<string, unknown> & { _id: string };
type Data = { metrics?: Record<string, number>; products: Item[]; categories: Item[]; suppliers: Item[]; orders: Item[]; logs: Item[] };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export function AdminClient({ accessToken }: AdminClientProps) {
  const [totp, setTotp] = useState("");
  const [data, setData] = useState<Data>({ products: [], categories: [], suppliers: [], orders: [], logs: [] });
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState({ name: "", slug: "", brand: "", categoryId: "", sku: "", priceCents: "", description: "" });
  const [category, setCategory] = useState({ name: "", slug: "" });
  const [supplier, setSupplier] = useState({ name: "", contact: "" });

  async function call(path: string, options: RequestInit = {}) {
    const response = await fetch(`${apiUrl}${path}`, { ...options, headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}`, "x-totp-code": totp, ...(options.headers ?? {}) } });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.error ?? `Request failed (${response.status})`);
    return body;
  }
  async function load() {
    try {
      const [dashboard, products, categories, suppliers, orders, logs] = await Promise.all([call("/admin/dashboard"), call("/admin/products"), call("/admin/categories"), call("/admin/suppliers"), call("/admin/orders/paid-queue"), call("/admin/audit-logs")]);
      setData({ metrics: dashboard.metrics, products: products.items, categories: categories.items, suppliers: suppliers.items, orders: orders.items, logs: logs.items }); setMessage("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load admin data"); }
  }
  async function submit(event: React.FormEvent, path: string, body: unknown, reset: () => void) { event.preventDefault(); try { await call(path, { method: "POST", body: JSON.stringify(body) }); reset(); await load(); setMessage("Saved"); } catch (error) { setMessage(error instanceof Error ? error.message : "Save failed"); } }
  async function orderAction(path: string, body: unknown) { try { await call(path, { method: "POST", body: JSON.stringify(body) }); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Order update failed"); } }

  return <div className="admin-shell">
    <header className="admin-heading">
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ position: "relative", width: "90px", height: "64px", overflow: "hidden", borderRadius: "2px", border: "1px solid var(--line)", flexShrink: 0 }}>
          <Image src="/images/editorial_horology_vault.jpg" alt="Security Vault" fill quality={95} sizes="90px" style={{ objectFit: "cover" }} referrerPolicy="no-referrer" />
        </div>
        <div>
          <p className="eyebrow">Northstar / Control</p>
          <h1>Operations</h1>
        </div>
      </div>
      <form className="admin-auth" onSubmit={(event) => { event.preventDefault(); void load(); }}>
        <label>Authenticator code<input value={totp} onChange={(event) => setTotp(event.target.value)} inputMode="numeric" autoComplete="one-time-code" /></label>
        <button className="button button-dark" type="submit">Open console</button>
      </form>
    </header>
    <p className="admin-message" role="status">{message}</p>
    <section className="admin-metrics">{Object.entries(data.metrics ?? {}).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</section>
    <section className="admin-section"><div className="section-heading"><div><p className="eyebrow">Paid queue</p><h2>Supplier handoff</h2></div><button className="text-link" type="button" onClick={() => void load()}>Refresh</button></div><div className="admin-list">{data.orders.map((order) => <article className="admin-row" key={order._id}><div><strong>{String(order.orderNumber)}</strong><span>{String(order.email)}</span></div><div><span>Paid / {String(order.fulfillmentStatus)}</span><strong>{String(order.totalCents)} cents</strong></div><div className="admin-actions"><button type="button" onClick={() => void orderAction(`/admin/orders/${order._id}/supplier-order`, { supplierReference: window.prompt("Supplier reference") ?? "" })}>Supplier placed</button><button type="button" onClick={() => void orderAction(`/admin/orders/${order._id}/ship`, { carrier: window.prompt("Carrier") ?? "", trackingNumber: window.prompt("Tracking number") ?? "" })}>Ship</button></div></article>)}</div></section>
    <section className="admin-columns"><div className="admin-section"><div className="section-heading"><div><p className="eyebrow">Catalog</p><h2>Products</h2></div></div><form className="admin-form" onSubmit={(event) => void submit(event, "/admin/products", { ...product, priceCents: Number(product.priceCents), categoryId: product.categoryId, condition: "NEW", currency: "USD", status: "DRAFT", stockStatus: "IN_STOCK", specs: [], images: [] }, () => setProduct({ name: "", slug: "", brand: "", categoryId: "", sku: "", priceCents: "", description: "" }))}><input placeholder="Name" value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} required /><input placeholder="Slug" value={product.slug} onChange={(event) => setProduct({ ...product, slug: event.target.value })} required /><input placeholder="Brand" value={product.brand} onChange={(event) => setProduct({ ...product, brand: event.target.value })} required /><input placeholder="SKU" value={product.sku} onChange={(event) => setProduct({ ...product, sku: event.target.value })} required /><input placeholder="Category ID" value={product.categoryId} onChange={(event) => setProduct({ ...product, categoryId: event.target.value })} required /><input placeholder="Price in cents" type="number" value={product.priceCents} onChange={(event) => setProduct({ ...product, priceCents: event.target.value })} required /><button className="button" type="submit">Add product</button></form><div className="admin-list">{data.products.map((item) => <div className="admin-row compact" key={item._id}><span>{String(item.name)}</span><span>{String(item.sku)}</span><span>{String(item.status)}</span></div>)}</div></div>
      <div className="admin-section"><div className="section-heading"><div><p className="eyebrow">Taxonomy</p><h2>Categories</h2></div></div><form className="admin-form" onSubmit={(event) => void submit(event, "/admin/categories", category, () => setCategory({ name: "", slug: "" }))}><input placeholder="Name" value={category.name} onChange={(event) => setCategory({ ...category, name: event.target.value })} required /><input placeholder="Slug" value={category.slug} onChange={(event) => setCategory({ ...category, slug: event.target.value })} required /><button className="button" type="submit">Add category</button></form><div className="admin-list">{data.categories.map((item) => <div className="admin-row compact" key={item._id}><span>{String(item.name)}</span><span>{String(item.slug)}</span></div>)}</div></div>
      <div className="admin-section"><div className="section-heading"><div><p className="eyebrow">Partners</p><h2>Suppliers</h2></div></div><form className="admin-form" onSubmit={(event) => void submit(event, "/admin/suppliers", { ...supplier, status: "ACTIVE" }, () => setSupplier({ name: "", contact: "" }))}><input placeholder="Name" value={supplier.name} onChange={(event) => setSupplier({ ...supplier, name: event.target.value })} required /><input placeholder="Contact" value={supplier.contact} onChange={(event) => setSupplier({ ...supplier, contact: event.target.value })} required /><button className="button" type="submit">Add supplier</button></form><div className="admin-list">{data.suppliers.map((item) => <div className="admin-row compact" key={item._id}><span>{String(item.name)}</span><span>{String(item.status)}</span></div>)}</div></div></section>
    <section className="admin-section"><div className="section-heading"><div><p className="eyebrow">Trace</p><h2>Audit log</h2></div></div><div className="admin-list">{data.logs.map((log) => <div className="admin-row compact" key={log._id}><span>{String(log.action)}</span><span>{String(log.entity)}</span><span>{String(log.entityId)}</span></div>)}</div></section>
  </div>;
}
