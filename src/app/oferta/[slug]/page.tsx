import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { getService, getServices, getSettings } from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {};
  }

  return createMetadata({
    title: `${service.title} Turek`,
    description: service.metaDescription,
    path: `/oferta/${service.slug}`,
    image: service.heroImage.src
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSettings()]);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    url: absoluteUrl(`/oferta/${service.slug}`),
    provider: {
      "@type": "AutomotiveBusiness",
      name: settings.siteName,
      telephone: settings.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.addressStreet,
        addressLocality: settings.city,
        postalCode: settings.postalCode,
        addressCountry: "PL"
      }
    },
    areaServed: {
      "@type": "City",
      name: "Turek"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Oferta",
        item: absoluteUrl("/oferta")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: service.title,
        item: absoluteUrl(`/oferta/${service.slug}`)
      }
    ]
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <section className="detail-hero">
        <div className="detail-hero-copy">
          <Breadcrumbs items={[{ label: "Oferta", href: "/oferta" }, { label: service.title }]} />
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title} w Turku</h1>
          <p>{service.lead}</p>
        </div>
        <div className="detail-hero-media">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            priority
            sizes="(min-width: 980px) 46vw, 100vw"
          />
        </div>
      </section>

      <section className="section detail-grid">
        <div className="content-column">
          <p className="eyebrow">Korzyści</p>
          <h2>Dlaczego warto?</h2>
          <ul className="check-list">
            {service.benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <aside className="side-panel">
          <p className="eyebrow">Wycena</p>
          <h2>Ceny i czas</h2>
          {service.pricing?.map((item) => (
            <div className="price-row" key={`${item.label}-${item.value}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.note ? <small>{item.note}</small> : null}
            </div>
          ))}
        </aside>
      </section>

      <section className="section process-section">
        <div>
          <p className="eyebrow">Proces</p>
          <h2>Jak przebiega usługa?</h2>
        </div>
        <div className="process-list">
          {service.process.map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>Najczęstsze pytania</h2>
        </div>
        <div className="faq-list">
          {service.faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title={`Umów: ${service.title.toLowerCase()}`}
        text="Najlepiej zacząć od rozmowy i krótkich oględzin auta. Wtedy zakres i cena będą konkretne."
        settings={settings}
      />
    </>
  );
}
