import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { settings } from "@/lib/content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Kontakt",
  description:
    "Skontaktuj się ze Sleek Car Autokosmetyka w Turku. Telefon, adres, godziny otwarcia, formularz i mapa dojazdu.",
  path: "/kontakt"
});

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt Sleek Car",
  url: absoluteUrl("/kontakt")
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Kontakt" }]} />
        <p className="eyebrow">Kontakt</p>
        <h1>Umów oględziny auta albo zapytaj o konkretną usługę.</h1>
        <p>
          Najdokładniejszą wycenę przygotujemy po rozmowie i obejrzeniu samochodu.
          Możesz zadzwonić, wysłać formularz albo podjechać do studia w Turku.
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-card">
          <p className="eyebrow">Dane studia</p>
          <h2>{settings.siteName}</h2>
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
          <p className="eyebrow">Formularz</p>
          <h2>Napisz wiadomość</h2>
          <ContactForm />
        </div>
      </section>

      <section className="section map-section">
        <div>
          <p className="eyebrow">Dojazd</p>
          <h2>ul. Milewskiego 9, Turek</h2>
        </div>
        <MapEmbed />
      </section>
    </>
  );
}
