import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { posts } from "@/lib/content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Aktualności, poradniki i vlog detailingowy",
  description:
    "Poradniki o folii PPF, zabezpieczeniu lakieru, korekcie i kulisach pracy studia detailingowego Sleek Car w Turku.",
  path: "/aktualnosci"
});

const newsSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Aktualności Sleek Car",
  url: absoluteUrl("/aktualnosci"),
  blogPost: posts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: absoluteUrl(`/aktualnosci/${post.slug}`)
  }))
};

export default function NewsPage() {
  return (
    <>
      <JsonLd data={newsSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Aktualności" }]} />
        <p className="eyebrow">Aktualności i vlog</p>
        <h1>Poradniki, kulisy pracy i świeże realizacje ze studia.</h1>
        <p>
          Ta sekcja jest gotowa na wpisy poradnikowe, krótkie aktualności i odcinki
          vloga osadzane z YouTube albo Instagrama.
        </p>
      </section>

      <section className="section">
        <div className="card-grid three">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <CtaBand
        title="Masz pytanie po przeczytaniu poradnika?"
        text="Najprościej zadzwonić i opisać auto. Od razu podpowiemy, jaki wariant ma sens."
      />
    </>
  );
}
