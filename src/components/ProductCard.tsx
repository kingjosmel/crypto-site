import Image from "next/image";
import Link from "next/link";
import { conditionLabel, formatPrice, type Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}>
      <div className="product-image">{image ? <Image src={image.url} alt={image.alt} fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized={image.url.includes("placehold.co")} /> : <span aria-hidden="true">No image</span>}</div>
    </Link>
    <div className="product-card-copy">
      <div><p className="eyebrow">{product.brand} · {conditionLabel(product.condition)}</p><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3></div>
      <p className="price">{formatPrice(product.priceCents)}</p>
    </div>
    <p className="product-brand">{product.sizes?.length ? `Sizes ${product.sizes.join(", ")}` : product.specs[0]?.value ?? "Signature piece"} · {product.stockStatus.replaceAll("_", " ").toLowerCase()}</p>
  </article>;
}
