import type { MetadataRoute } from "next";
import { posts, realizations, services } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/oferta", "/realizacje", "/aktualnosci", "/kontakt"];
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
    ...posts.map((post) => ({
      url: absoluteUrl(`/aktualnosci/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
