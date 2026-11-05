import Image from "next/image";
import { SiteShell } from "./SiteShell";

type LegalPageProps = {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  heroImage?: string | {
    url: string;
    alt: string;
  };
};

export function LegalPage({ title, intro, sections, heroImage }: LegalPageProps) {
  const image = typeof heroImage === "string"
    ? { url: heroImage, alt: title }
    : (heroImage ?? {
        url: "/images/editorial_atelier.jpg",
        alt: "Northstar / Supply atelier and private client salon",
      });

  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3702b] block mb-2">
          Northstar / Supply Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-950 font-normal tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed mb-8">
          {intro}
        </p>

        {/* Hero Visual */}
        <div className="relative aspect-16/9 w-full rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm mb-12">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            quality={95}
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>

        {/* Sections */}
        <div className="divide-y divide-[#ece8e1] border-t border-b border-[#ece8e1]">
          {sections.map((section) => (
            <div key={section.heading} className="py-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-900 mb-3">
                {section.heading}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
