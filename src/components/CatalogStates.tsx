import Link from "next/link";

export function CatalogError() {
  return (
    <section className="state-panel">
      <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
        Archive Temporarily Unavailable
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal">
        Unable to load collection vault.
      </h2>
      <p className="text-sm text-neutral-600 max-w-md mx-auto my-4">
        Our Geneva and New York archives are undergoing periodic synchronization. Please try again or contact the concierge.
      </p>
      <Link href="/" className="button button-dark text-white" style={{ color: "#ffffff" }}>
        Return to Home
      </Link>
    </section>
  );
}

export function EmptyState({ label = "No pieces matched your criteria" }: { label?: string }) {
  return (
    <section className="state-panel py-16">
      <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
        Vault Archive
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal">
        {label}
      </h2>
      <p className="text-sm text-neutral-600 max-w-md mx-auto my-4">
        Explore our complete inventory of rare complications, Goyard chevron luggage, and tailored cashmere.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/shop" className="button button-dark text-white" style={{ color: "#ffffff" }}>
          Browse All Pieces
        </Link>
        <Link href="/track" className="button button-light">
          Track An Order
        </Link>
      </div>
    </section>
  );
}
