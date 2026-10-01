import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { RealizationCard } from "@/components/RealizationCard";
import {
  getRealizations,
  getRealizationsPageContent,
  getSettings
} from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRealizationsPageContent();

  return createMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/realizacje"
  });
}

export default async function RealizationsPage() {
  const [page, realizations, settings] = await Promise.all([
    getRealizationsPageContent(),
    getRealizations(),
    getSettings()
  ]);
  const realizationsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Realizacje Sleek Car",
    url: absoluteUrl("/realizacje"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: realizations.map((realization, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: realization.title,
        url: absoluteUrl(`/realizacje/${realization.slug}`)
      }))
    }
  };

  return (
    <>
      <JsonLd data={realizationsSchema} />
      <section className="page-hero compact visual">
        <Image
          src={page.heroImage.src}
          alt={page.heroImage.alt}
          fill
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <Breadcrumbs items={[{ label: "Realizacje" }]} />
          <p className="eyebrow">Realizacje</p>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="card-grid three">
          {realizations.map((realization) => (
            <RealizationCard key={realization.slug} realization={realization} />
          ))}
        </div>
      </section>

      <CtaBand
        title="Chcesz podobny efekt na swoim aucie?"
        text="Podeślij model auta i zdjęcia lakieru. Ustalimy, jaki zakres będzie miał największy sens."
        settings={settings}
      />
    </>
  );
}
