"use client";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
export function AddToCartButton({ item }: { item: { productId: string; slug: string; name: string; priceCents: number; imageUrl?: string } }) { const [added, setAdded] = useState(false); return <><button className="button button-dark add-button" type="button" onClick={() => { addToCart(item); setAdded(true); }}> {added ? "Added to cart" : "Add to cart"}</button>{added && <p className="cart-confirmation" role="status">Added. <a href="/cart">View cart</a></p>}</>; }
