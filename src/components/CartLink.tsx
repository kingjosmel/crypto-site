"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";
export function CartLink() { const [count, setCount] = useState(0); useEffect(() => { const update = () => setCount(readCart().reduce((total, item) => total + item.qty, 0)); update(); window.addEventListener("northstar-cart-change", update); return () => window.removeEventListener("northstar-cart-change", update); }, []); return <Link className="cart-link" href="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>Cart <span>{count}</span></Link>; }
