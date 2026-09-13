import type { MetadataRoute } from "next";
import { isPlaceholderPost } from "@/lib/content";
import { getPosts, getRealizations, getServices } from "@/lib/prismic-content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, realizations, services] = await Promise.all([
    getPosts(),
    getRealizations(),
    getServices()
  ]);
  const staticRoutes = [
    "",
    "/oferta",
    "/realizacje",
    "/aktualnosci",
    "/kontakt",
    "/polityka-prywatnosci"
  ];
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8
    })),
    ...services.map((service) => ({
      url: absoluteUrl(`/oferta/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9
    })),
    ...realizations.map((realization) => ({
      url: absoluteUrl(`/realizacje/${realization.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...posts
      .filter((post) => !isPlaceholderPost(post))
      .map((post) => ({
        url: absoluteUrl(`/aktualnosci/${post.slug}`),
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6
      }))
  ];
}
