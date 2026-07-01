import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { getNewsPageContent, getPosts, getSettings } from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getNewsPageContent();

  return createMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/aktualnosci"
  });
}

export default async function NewsPage() {
  const [page, posts, settings] = await Promise.all([
    getNewsPageContent(),
    getPosts(),
    getSettings()
  ]);
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

  return (
    <>
      <JsonLd data={newsSchema} />
      <section className="page-hero compact">
        <Breadcrumbs items={[{ label: "Aktualności" }]} />
        <p className="eyebrow">Aktualności i vlog</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
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
        settings={settings}
      />
    </>
  );
}
