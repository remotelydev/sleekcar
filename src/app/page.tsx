import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { RealizationCard } from "@/components/RealizationCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import {
  certifications,
  getHomeContent,
  getServices,
  getSettings
} from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeContent();

  return createMetadata({
    title: home.seoTitle,
    description: home.seoDescription,
    path: "/",
    image: home.heroImage.src
  });
}

export default async function HomePage() {
  const [home, services, settings] = await Promise.all([
    getHomeContent(),
    getServices(),
    getSettings()
  ]);
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Detailing samochodowy Turek",
    url: absoluteUrl("/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: services.slice(0, 8).map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: absoluteUrl(`/oferta/${service.slug}`)
      }))
    }
  };

  return (
    <>
      <JsonLd data={homeSchema} />

      <section className="hero">
        <Image
          src={home.heroImage.src}
          alt={home.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">{home.heroEyebrow}</p>
          <h1>{home.heroTitle}</h1>
          <p>{home.heroText}</p>
          <div className="hero-actions">
            <ButtonLink href={home.primaryCtaHref}>{home.primaryCtaLabel}</ButtonLink>
            <a className="button button-secondary" href={settings.phoneHref}>
              <Phone aria-hidden="true" size={18} />
              <span>{settings.phoneDisplay}</span>
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Najważniejsze informacje">
          <Link href="#opinie">
            <Star aria-hidden="true" size={18} />
            <strong>5.0 / 5</strong>
            <span>91 opinii Google</span>
          </Link>
          <Link href="/oferta/folia-ochronna-ppf">
            <ShieldCheck aria-hidden="true" size={18} />
            <strong>PPF</strong>
            <span>Clif Design i STEK</span>
          </Link>
          <Link href="#dojazd">
            <MapPin aria-hidden="true" size={18} />
            <strong>Turek</strong>
            <span>{settings.addressStreet}</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Oferta"
          title="Usługi, które najczęściej chronią wartość auta"
          description="Na start wyciągamy najmocniejsze usługi na stronę główną, a pełna oferta ma osobne podstrony przygotowane pod SEO."
        />
        <div className="card-grid four">
          {home.featuredServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="section-actions">
          <ButtonLink href="/oferta" variant="secondary">
            Zobacz wszystkie usługi
          </ButtonLink>
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">O studiu</p>
          <h2>{home.aboutTitle}</h2>
          <p>{home.aboutText}</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Folie ochronne PPF, powłoki, korekty i detailing wnętrza.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Naprawa rys, odprysków i wgnieceń bez ponownego lakierowania.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={18} />
              Zalecany kontakt telefoniczny i oględziny auta przed wyceną.
            </li>
          </ul>
        </div>

        <div className="cert-card">
          <p className="eyebrow">Certyfikowany ekspert</p>
          <h3>{home.certificationsTitle}</h3>
          <div className="cert-grid">
            {certifications.map((certification) => (
              <a href={certification.url} key={certification.name}>
                <span>{certification.name}</span>
                <small>{certification.label}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Realizacje"
          title="Auta, na których widać różnicę"
          description="Wybrane projekty pokazują zakres prac: od folii PPF, przez korektę lakieru, po detailing wnętrza."
        />
        <div className="card-grid three">
          {home.featuredRealizations.map((realization) => (
            <RealizationCard key={realization.slug} realization={realization} />
          ))}
        </div>
        <div className="section-actions">
          <ButtonLink href="/realizacje" variant="secondary">
            Zobacz realizacje
          </ButtonLink>
        </div>
      </section>

      <section className="section testimonials-section" id="opinie">
        <SectionHeader
          eyebrow="Opinie"
          title="5 gwiazdek od klientów w Google"
          description="Robocze cytaty są przygotowane do podmiany na konkretne opinie wybrane z profilu Google."
        />
        <div className="testimonial-grid">
          {home.testimonials.map((testimonial) => (
            <figure className="testimonial" key={testimonial.quote}>
              <div className="stars" aria-label={`${testimonial.rating} na 5 gwiazdek`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star aria-hidden="true" fill="currentColor" key={index} size={16} />
                ))}
              </div>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section location-section" id="dojazd">
        <div className="location-copy">
          <p className="eyebrow">Nasza siedziba</p>
          <h2>Umów oględziny auta w Turku.</h2>
          <div className="contact-list large">
            <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={20} />
              <span>
                {settings.addressStreet}, {settings.postalCode} {settings.city}
                <small>{settings.addressHint}</small>
              </span>
            </a>
            <a href={settings.phoneHref}>
              <Phone aria-hidden="true" size={20} />
              <span>{settings.phoneDisplay}</span>
            </a>
            <span>
              <Clock aria-hidden="true" size={20} />
              <span>{settings.hours}</span>
            </span>
          </div>
          <Link className="text-link standalone" href="/kontakt">
            Przejdz do kontaktu
          </Link>
        </div>
        <MapEmbed settings={settings} />
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
