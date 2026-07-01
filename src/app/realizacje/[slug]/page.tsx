import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import {
  getRealization,
  getRealizations,
  getSettings
} from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

type RealizationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const realizations = await getRealizations();
  return realizations.map((realization) => ({ slug: realization.slug }));
}

export async function generateMetadata({
  params
}: RealizationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const realization = await getRealization(slug);

  if (!realization) {
    return {};
  }

  return createMetadata({
    title: realization.title,
    description: realization.summary,
    path: `/realizacje/${realization.slug}`,
    image: realization.coverImage.src
  });
}

export default async function RealizationPage({ params }: RealizationPageProps) {
  const { slug } = await params;
  const [realization, settings] = await Promise.all([
    getRealization(slug),
    getSettings()
  ]);

  if (!realization) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: realization.title,
    description: realization.summary,
    image: absoluteUrl(realization.coverImage.src),
    author: {
      "@type": "Organization",
      name: settings.siteName
    },
    publisher: {
      "@type": "Organization",
      name: settings.siteName
    },
    mainEntityOfPage: absoluteUrl(`/realizacje/${realization.slug}`)
  };

  return (
    <>
      <JsonLd data={schema} />
      <article>
        <section className="detail-hero">
          <div className="detail-hero-copy">
            <Breadcrumbs
              items={[{ label: "Realizacje", href: "/realizacje" }, { label: realization.title }]}
            />
            <p className="eyebrow">{realization.service}</p>
            <h1>{realization.title}</h1>
            <p>{realization.summary}</p>
          </div>
          <div className="detail-hero-media">
            <Image
              src={realization.coverImage.src}
              alt={realization.coverImage.alt}
              fill
              priority
              sizes="(min-width: 980px) 46vw, 100vw"
            />
          </div>
        </section>

        <section className="section article-layout">
          <div className="article-copy">
            <p className="eyebrow">{realization.vehicle}</p>
            <h2>Zakres i efekt</h2>
            {realization.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="side-panel">
            <p className="eyebrow">Projekt</p>
            <div className="price-row">
              <span>Auto</span>
              <strong>{realization.vehicle}</strong>
            </div>
            <div className="price-row">
              <span>Usługa</span>
              <strong>{realization.service}</strong>
            </div>
          </aside>
        </section>

        <section className="section gallery-section">
          <p className="eyebrow">Galeria</p>
          <h2>Zdjęcia realizacji</h2>
          <div className="gallery-grid">
            {realization.gallery.map((image) => (
              <div className="gallery-item" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 980px) 33vw, 100vw"
                />
              </div>
            ))}
          </div>
        </section>
      </article>

      <CtaBand
        title="Umów podobny zakres prac"
        text="Przy realizacjach najlepiej zacząć od zdjęć i krótkiego opisu oczekiwań."
        settings={settings}
      />
    </>
  );
}
