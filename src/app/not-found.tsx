import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#a3702b] mb-2">
          404 · Archival Reference Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-950 font-normal mb-4">
          Piece Not in Active Archive
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mb-8 leading-relaxed">
          The requested allocation or vault catalogue item could not be retrieved. It may have been acquired or relocated.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          style={{ color: "#ffffff" }}
        >
          Explore Available Pieces
        </Link>
      </div>
    </SiteShell>
  );
}
