export type ImageAsset = {
  src: string;
  alt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Service = {
  title: string;
  slug: string;
  eyebrow: string;
  summary: string;
  metaDescription: string;
  heroImage: ImageAsset;
  cardImage: ImageAsset;
  lead: string;
  benefits: string[];
  process: string[];
  pricing?: {
    label: string;
    value: string;
    note?: string;
  }[];
  faqs: FaqItem[];
  seoTitle?: string;
  body?: string[];
  relatedServiceSlugs?: string[];
};

export type Realization = {
  title: string;
  slug: string;
  vehicle: string;
  service: string;
  summary: string;
  body: string[];
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  serviceSlugs?: string[];
};

export type Post = {
  title: string;
  slug: string;
  category: "Poradniki" | "Vlog" | "Aktualnosci";
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  coverImage: ImageAsset;
  videoUrl?: string;
  body: string[];
};

export const asset = (path: string) => encodeURI(`/assets/${path}`);

export const settings = {
  siteName: "Sleek Car Autokosmetyka",
  shortName: "Sleek Car",
  siteUrl: "https://sleek-car.pl",
  defaultOgImage: asset("oferta-na-glowna-900x400-k80mlh6a.jpg"),
  phoneDisplay: "665 111 550",
  phoneHref: "tel:+48665111550",
  emailDisplay: "sleekcarstudio@gmail.com",
  addressStreet: "ul. Milewskiego 10E",
  addressHint: "",
  postalCode: "62-700",
  city: "Turek",
  hours: "Pn - Pt: 9.00 - 17.00",
  mapEmbedUrl:
    "https://www.google.com/maps?q=ul.%20Milewskiego%2010E%2C%2062-700%20Turek&output=embed",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=ul.%20Milewskiego%2010E%2C%2062-700%20Turek",
  social: {
    facebook: "#",
    instagram: "#"
  }
};

export const navItems = [
  { label: "Oferta", href: "/oferta" },
  { label: "Realizacje", href: "/realizacje" },
  { label: "Aktualności", href: "/aktualnosci" },
  { label: "Kontakt", href: "/kontakt" }
];

export function isPlaceholderPost(post: Post) {
  if (post.videoUrl) {
    return false;
  }

  const haystack = [post.excerpt, ...post.body].join("\n").toLowerCase();
  return haystack.includes("prismic") || haystack.includes("miejsce na odcinek");
}
