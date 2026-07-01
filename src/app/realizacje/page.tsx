import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { RealizationCard } from "@/components/RealizationCard";
import { realizations } from "@/lib/content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Realizacje detailingu i folii PPF",
  description:
    "Wybrane realizacje Sleek Car: folia PPF, korekta lakieru, detailing wnętrza i zabezpieczenie samochodów w Turku.",
  path: "/realizacje"
});

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

export default function RealizationsPage() {
  return (
    <>
      <JsonLd data={realizationsSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Realizacje" }]} />
        <p className="eyebrow">Realizacje</p>
        <h1>Efekty prac, które pomagają klientom podjąć decyzję.</h1>
        <p>
          Zamiast przypadkowej galerii: każde auto może mieć opis zakresu, zdjęcie
          główne, galerię i link do usługi, którą sprzedaje.
        </p>
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
      />
    </>
  );
}
