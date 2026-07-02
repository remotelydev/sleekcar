import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { getPost, getPosts, getSettings } from "@/lib/prismic-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

function getVideoEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      const videoId =
        parsedUrl.searchParams.get("v") ||
        (pathParts[0] === "shorts" || pathParts[0] === "embed" ? pathParts[1] : "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (hostname === "vimeo.com") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
  } catch {
    return url;
  }

  return url;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/aktualnosci/${post.slug}`,
    image: post.coverImage.src
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!post) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage.src),
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: settings.siteName
    },
    publisher: {
      "@type": "Organization",
      name: settings.siteName
    },
    mainEntityOfPage: absoluteUrl(`/aktualnosci/${post.slug}`)
  };

  return (
    <>
      <JsonLd data={schema} />
      <article>
        <section className="detail-hero">
          <div className="detail-hero-copy">
            <Breadcrumbs
              items={[{ label: "Aktualności", href: "/aktualnosci" }, { label: post.title }]}
            />
            <p className="eyebrow">{post.category} / {post.readingTime}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
          <div className="detail-hero-media">
            <Image
              src={post.coverImage.src}
              alt={post.coverImage.alt}
              fill
              priority
              sizes="(min-width: 980px) 46vw, 100vw"
            />
          </div>
        </section>

        <section className="section article-layout">
          <div className="article-copy">
            {post.videoUrl ? (
              <div className="video-embed">
                <iframe
                  src={getVideoEmbedUrl(post.videoUrl)}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : null}
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="side-panel">
            <p className="eyebrow">Wpis</p>
            <div className="price-row">
              <span>Kategoria</span>
              <strong>{post.category}</strong>
            </div>
            <div className="price-row">
              <span>Czas</span>
              <strong>{post.readingTime}</strong>
            </div>
            {post.videoUrl ? (
              <div className="price-row">
                <span>Video</span>
                <a href={post.videoUrl} target="_blank" rel="noreferrer">
                  Otwórz film
                </a>
              </div>
            ) : null}
          </aside>
        </section>
      </article>

      <CtaBand settings={settings} />
    </>
  );
}
