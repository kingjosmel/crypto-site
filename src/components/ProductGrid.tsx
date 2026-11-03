import { type Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./CatalogStates";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
