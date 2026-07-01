import type { Metadata, Viewport } from "next";
import { PrismicPreview } from "@prismicio/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { repositoryName } from "@/lib/prismic";
import { getSettings } from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "Detailing, folia PPF i korekta lakieru w Turku",
  description:
    "Sleek Car Autokosmetyka w Turku: folia PPF, zabezpieczenie lakieru, korekta lakieru, czyszczenie wnętrza i detailing samochodowy.",
  path: "/"
});

export const viewport: Viewport = {
  themeColor: "#111418",
  colorScheme: "dark"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: settings.siteName,
    url: absoluteUrl("/"),
    telephone: settings.phoneDisplay,
    image: absoluteUrl(settings.defaultOgImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressStreet,
      addressLocality: settings.city,
      postalCode: settings.postalCode,
      addressCountry: "PL"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00"
      }
    ],
    areaServed: ["Turek", "Wielkopolskie"],
    sameAs: [settings.social.facebook, settings.social.instagram].filter(
      (url) => url !== "#"
    )
  };

  return (
    <html lang="pl">
      <body>
        <JsonLd data={localBusinessSchema} />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
