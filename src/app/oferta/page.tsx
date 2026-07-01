import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Oferta detailingu samochodowego w Turku",
  description:
    "Folia PPF, zabezpieczenie lakieru, korekta lakieru, przyciemnianie szyb, czyszczenie wnętrza i pozostałe usługi Sleek Car w Turku.",
  path: "/oferta"
});

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Oferta Sleek Car",
  url: absoluteUrl("/oferta"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: absoluteUrl(`/oferta/${service.slug}`)
    }))
  }
};

export default function OfferPage() {
  return (
    <>
      <JsonLd data={offerSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Oferta" }]} />
        <p className="eyebrow">Oferta</p>
        <h1>Detailing, zabezpieczenie lakieru i usługi ochronne dla auta.</h1>
        <p>
          Każda usługa ma osobną podstronę, opis korzyści, przebieg prac i miejsce
          na ceny, FAQ oraz galerie. To dobra baza pod Prismic i lokalne SEO.
        </p>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Usługi"
          title="Wybierz zakres prac"
          description="Od szybkiego odświeżenia po pełne zabezpieczenie lakieru folią PPF."
        />
        <div className="card-grid three">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <CtaBand
        title="Nie wiesz, od czego zacząć?"
        text="Opowiedz, jak używasz auta. Dobierzemy zakres, który ma sens technicznie i budżetowo."
      />
    </>
  );
}
