import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { ServiceCard } from "@/components/ServiceCard";
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
    title: service.seoTitle || `${service.title} Turek`,
    description: service.metaDescription,
    path: `/oferta/${service.slug}`,
    image: service.heroImage.src
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([
    getService(slug),
    getServices(),
    getSettings()
  ]);

  if (!service) {
    notFound();
  }

  const hasBenefits = service.benefits.length > 0;
  const hasPricing = Boolean(service.pricing && service.pricing.length > 0);

  const relatedServices = (service.relatedServiceSlugs || [])
    .map((relatedSlug) => services.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

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

  const faqSchema =
    service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      : null;

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <section className="detail-hero">
        <div className="detail-hero-copy">
          <Breadcrumbs items={[{ label: "Oferta", href: "/oferta" }, { label: service.title }]} />
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.lead}</p>
        </div>
        <div className="detail-hero-media">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            sizes="(min-width: 980px) 46vw, 100vw"
          />
        </div>
      </section>

      {service.body && service.body.length > 0 ? (
        <section className="section">
          <div className="article-copy">
            {service.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {hasBenefits || hasPricing ? (
        <section className={hasBenefits && hasPricing ? "section detail-grid" : "section"}>
          {hasBenefits ? (
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
          ) : null}

          {hasPricing ? (
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
          ) : null}
        </section>
      ) : null}

      {service.process.length > 0 ? (
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
      ) : null}

      {service.faqs.length > 0 ? (
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
      ) : null}

      {relatedServices.length > 0 ? (
        <section className="section">
          <p className="eyebrow">Powiązane usługi</p>
          <h2>Zobacz też</h2>
          <div className="card-grid three">
            {relatedServices.map((related) => (
              <ServiceCard key={related.slug} service={related} />
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand
        title={`Umów: ${service.title.toLowerCase()}`}
        text="Najlepiej zacząć od rozmowy i krótkich oględzin auta. Wtedy zakres i cena będą konkretne."
        settings={settings}
      />
    </>
  );
}
