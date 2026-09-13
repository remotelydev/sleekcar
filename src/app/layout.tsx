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
  themeColor: "#0a0a0a",
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
    email: settings.emailDisplay,
    image: absoluteUrl(settings.defaultOgImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressStreet,
      addressLocality: settings.city,
      postalCode: settings.postalCode,
      addressCountry: "PL"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.0203,
      longitude: 18.5047
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00"
      }
    ],
    areaServed: [
      { "@type": "City", name: "Turek" },
      { "@type": "City", name: "Konin" },
      { "@type": "City", name: "Koło" },
      { "@type": "City", name: "Kalisz" },
      { "@type": "City", name: "Uniejów" }
    ],
    sameAs: [settings.social.facebook, settings.social.instagram].filter(
      (url) => url !== "#"
    )
  };

  return (
    <html lang="pl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <JsonLd data={localBusinessSchema} />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
