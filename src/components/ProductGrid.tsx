import { type Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./CatalogStates";
export function ProductGrid({ products }: { products: Product[] }) { return products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <EmptyState />; }
