import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Owner panel: also noindex via meta robots and X-Robots-Tag, and absent from the sitemap.
      disallow: ["/panel", "/api/panel/"]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
