import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { getContactPageContent, getSettings } from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPageContent();

  return createMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/kontakt"
  });
}

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt Sleek Car",
  url: absoluteUrl("/kontakt")
};

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getContactPageContent(), getSettings()]);

  return (
    <>
      <JsonLd data={contactSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Kontakt" }]} />
        <p className="eyebrow">Kontakt</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </section>

      <section className="section contact-layout">
        <div className="contact-card">
          <p className="eyebrow">Dane studia</p>
          <h2>SleekCar autokosmetyka</h2>
          <div className="contact-list large">
            <a href={settings.phoneHref}>
              <Phone aria-hidden="true" size={20} />
              <span>{settings.phoneDisplay}</span>
            </a>
            <a href={`mailto:${settings.emailDisplay}`}>
              <Mail aria-hidden="true" size={20} />
              <span>{settings.emailDisplay}</span>
            </a>
            <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={20} />
              <span>
                {settings.addressStreet}
                <small>
                  {settings.addressHint}, {settings.postalCode} {settings.city}
                </small>
              </span>
            </a>
            <span>
              <Clock aria-hidden="true" size={20} />
              <span>{settings.hours}</span>
            </span>
          </div>
        </div>

        <div className="form-panel">
          <ContactForm />
        </div>
      </section>

      <section className="section map-section">
        <div>
          <p className="eyebrow">Dojazd</p>
          <h2>{page.mapTitle}</h2>
        </div>
        <MapEmbed settings={settings} />
      </section>
    </>
  );
}
