import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import {
  getOfferPageContent,
  getServices,
  getSettings
} from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getOfferPageContent();

  return createMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/oferta"
  });
}

export default async function OfferPage() {
  const [page, services, settings] = await Promise.all([
    getOfferPageContent(),
    getServices(),
    getSettings()
  ]);
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

  return (
    <>
      <JsonLd data={offerSchema} />
      <section className="page-hero compact visual">
        <Image
          src={page.heroImage.src}
          alt={page.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <Breadcrumbs items={[{ label: "Oferta" }]} />
          <p className="eyebrow">Oferta</p>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
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
        settings={settings}
      />
    </>
  );
}
