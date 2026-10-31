import { SiteShell } from "./SiteShell";

type LegalPageProps = { title: string; intro: string; sections: Array<{ heading: string; body: string }> };
export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return <SiteShell><article className="legal-page"><p className="eyebrow">Draft / legal review</p><h1>{title}</h1><p className="legal-intro">{intro}</p>{sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</article></SiteShell>;
}
