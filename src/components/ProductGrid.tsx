import { type Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./CatalogStates";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
