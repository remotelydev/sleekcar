import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || "sleekcar";

export const routes: prismic.ClientConfig["routes"] = [
  { type: "home_page", path: "/" },
  { type: "offer_page", path: "/oferta" },
  { type: "service", path: "/oferta/:uid" },
  { type: "realizations_page", path: "/realizacje" },
  { type: "realization", path: "/realizacje/:uid" },
  { type: "news_page", path: "/aktualnosci" },
  { type: "post", path: "/aktualnosci/:uid" },
  { type: "contact_page", path: "/kontakt" }
];

export function createClient(config: prismicNext.CreateClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 10 } },
    ...config
  });

  prismicNext.enableAutoPreviews({
    client
  });

  return client;
}
