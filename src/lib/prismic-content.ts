import * as prismic from "@prismicio/client";
import {
  certifications as fallbackCertifications,
  featuredServiceSlugs,
  posts as fallbackPosts,
  realizations as fallbackRealizations,
  services as fallbackServices,
  settings as fallbackSettings,
  testimonials as fallbackTestimonials,
  type ImageAsset,
  type Post,
  type Realization,
  type Service,
  isPlaceholderPost
} from "@/lib/content";
import { createClient } from "@/lib/prismic";

type DocumentData = Record<string, unknown>;
type PrismicDocument = {
  uid?: string | null;
  data: DocumentData;
};

type Settings = typeof fallbackSettings;
type Testimonial = (typeof fallbackTestimonials)[number];
type Certification = (typeof fallbackCertifications)[number];

export type PageContent = {
  title: string;
  lead: string;
  heroImage: ImageAsset;
  seoTitle: string;
  seoDescription: string;
};

export type ContactPageContent = PageContent & {
  formTitle: string;
  mapTitle: string;
};

export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroImage: ImageAsset;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutPoints: string[];
  certificationsEyebrow: string;
  certificationsTitle: string;
  certifications: Certification[];
  featuredServices: Service[];
  featuredRealizations: Realization[];
  testimonials: Testimonial[];
  seoTitle: string;
  seoDescription: string;
};

const fallbackHome: HomeContent = {
  heroEyebrow: "Detailing samochodowy w Turku",
  heroTitle: "Folia PPF, korekta lakieru i zabezpieczenie auta bez kompromisów.",
  heroText:
    "Sleek Car to studio autokosmetyki, w którym lakier, wnętrze i detale samochodu są traktowane z techniczną dokładnością i spokojem premium.",
  heroImage: {
    src: "/assets/oferta-na-glowna-900x400-k80mlh6a.jpg",
    alt: "Aplikacja folii ochronnej PPF na samochodzie"
  },
  primaryCtaLabel: "Sprawdź ofertę",
  primaryCtaHref: "/oferta",
  aboutEyebrow: "O studiu",
  aboutTitle:
    "Setki godzin szkoleń, tysiące aut praktyki i praca na produktach z górnej półki.",
  aboutText:
    "Jeżeli szukasz studia, które kompleksowo, terminowo i rzetelnie zajmie się Twoim pojazdem, dobrze trafiłeś. Każdą wycenę poprzedzamy rozmową i oględzinami, żeby zakres prac był dopasowany do realnego stanu auta.",
  aboutPoints: [
    "Folie ochronne PPF, powłoki, korekty i detailing wnętrza.",
    "Naprawa rys, odprysków i wgnieceń bez ponownego lakierowania.",
    "Zalecany kontakt telefoniczny i oględziny auta przed wyceną."
  ],
  certificationsEyebrow: "Certyfikowany ekspert",
  certificationsTitle: "Powłoki ochronne i folie PPF",
  certifications: fallbackCertifications,
  featuredServices: fallbackServices.filter((service) =>
    featuredServiceSlugs.includes(service.slug)
  ),
  featuredRealizations: fallbackRealizations.slice(0, 3),
  testimonials: fallbackTestimonials,
  seoTitle: "Detailing, folia PPF i korekta lakieru w Turku",
  seoDescription:
    "Sleek Car Autokosmetyka w Turku: folia PPF, zabezpieczenie lakieru, korekta lakieru, czyszczenie wnętrza i detailing samochodowy."
};

const fallbackOfferPage: PageContent = {
  title: "Oferta detailingu samochodowego w Turku",
  lead:
    "Dobierz zakres prac do auta i sposobu użytkowania: od czyszczenia wnętrza, przez korektę lakieru, po folię PPF i trwałe zabezpieczenia.",
  heroImage: {
    src: "/assets/911%20turbo%20s/1_40-l10ntz06.jpg",
    alt: "Porsche 911 Turbo S po zabezpieczeniu w Sleek Car"
  },
  seoTitle: "Oferta detailingu samochodowego w Turku",
  seoDescription:
    "Folia PPF, zabezpieczenie lakieru, korekta lakieru, przyciemnianie szyb, czyszczenie wnętrza i pozostałe usługi Sleek Car w Turku."
};

const fallbackRealizationsPage: PageContent = {
  title: "Realizacje Sleek Car",
  lead:
    "Zobacz wybrane auta po zabezpieczeniu lakieru, korekcie, folii PPF i detailingu wnętrza. Każda realizacja pokazuje konkretny zakres prac.",
  heroImage: {
    src: "/assets/lambo/1-l10o07zj.jpg",
    alt: "Lamborghini po detailingu wnętrza i pielęgnacji"
  },
  seoTitle: "Realizacje detailingu i folii PPF",
  seoDescription:
    "Wybrane realizacje Sleek Car: folia PPF, korekta lakieru, detailing wnętrza i zabezpieczenie samochodów w Turku."
};

const fallbackNewsPage: PageContent = {
  title: "Aktualności, poradniki i vlog",
  lead:
    "Praktyczne wskazówki o pielęgnacji auta, kulisy pracy studia i krótkie materiały o folii PPF, korekcie lakieru oraz zabezpieczeniach.",
  heroImage: {
    src: "/assets/m3/M3-11-of-12-lbfchvmu.jpg",
    alt: "BMW M3 po pracach detailingowych"
  },
  seoTitle: "Aktualności, poradniki i vlog detailingowy",
  seoDescription:
    "Poradniki o folii PPF, zabezpieczeniu lakieru, korekcie i kulisach pracy studia detailingowego Sleek Car w Turku."
};

const fallbackContactPage: ContactPageContent = {
  title: "Kontakt ze studiem Sleek Car",
  lead:
    "Umów oględziny auta, zapytaj o usługę albo podeślij krótki opis samochodu. Najdokładniejszą wycenę przygotujemy po rozmowie i obejrzeniu lakieru.",
  heroImage: {
    src: "/assets/rs6/1_22-l10nhkum.jpg",
    alt: "Audi RS6 po korekcie i zabezpieczeniu lakieru"
  },
  formTitle: "Napisz wiadomość",
  mapTitle: "ul. Milewskiego 10E, Turek",
    seoTitle: "Kontakt, dojazd i wycena | Sleek Car Turek",
  seoDescription:
    "Skontaktuj się ze Sleek Car Autokosmetyka w Turku. Telefon, adres, godziny otwarcia, formularz i mapa dojazdu."
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function richText(value: unknown, fallback = "") {
  const result = prismic.asText(value as prismic.RichTextField);
  return result || fallback;
}

function richTextParagraphs(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const paragraphs = value
    .map((block) => richText([block]))
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs.length > 0 ? paragraphs : fallback;
}

function image(value: unknown, fallback: ImageAsset): ImageAsset {
  if (!isRecord(value) || typeof value.url !== "string" || !value.url) {
    return fallback;
  }

  return {
    src: value.url,
    alt: text(value.alt, fallback.alt)
  };
}

function linkHref(value: unknown, fallback: string) {
  if (!isRecord(value)) {
    return fallback;
  }

  if (value.link_type === "Web" && typeof value.url === "string") {
    return value.url;
  }

  if (value.link_type === "Document") {
    const uid = text(value.uid);

    switch (value.type) {
      case "home_page":
        return "/";
      case "offer_page":
        return "/oferta";
      case "service":
        return uid ? `/oferta/${uid}` : fallback;
      case "realizations_page":
        return "/realizacje";
      case "realization":
        return uid ? `/realizacje/${uid}` : fallback;
      case "news_page":
        return "/aktualnosci";
      case "post":
        return uid ? `/aktualnosci/${uid}` : fallback;
      case "contact_page":
        return "/kontakt";
      default:
        return fallback;
    }
  }

  return fallback;
}

function group(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function nonEmpty<T>(value: T[], fallback: T[]) {
  return value.length > 0 ? value : fallback;
}

function replaceLegacyPageText(value: string, fallback: string) {
  const replacements: Record<string, string> = {
    "Detailing, zabezpieczenie lakieru i usługi ochronne dla auta.":
      fallbackOfferPage.title,
    "Każda usługa ma osobną podstronę, opis korzyści, przebieg prac i miejsce na ceny, FAQ oraz galerie. To dobra baza pod Prismic i lokalne SEO.":
      fallbackOfferPage.lead,
    "Efekty prac, które pomagają klientom podjąć decyzję.":
      fallbackRealizationsPage.title,
    "Zamiast przypadkowej galerii: każde auto może mieć opis zakresu, zdjęcie główne, galerię i link do usługi, którą sprzedaje.":
      fallbackRealizationsPage.lead,
    "Poradniki, kulisy pracy i świeże realizacje ze studia.":
      fallbackNewsPage.title,
    "Ta sekcja jest gotowa na wpisy poradnikowe, krótkie aktualności i odcinki vloga osadzane z YouTube albo Instagrama.":
      fallbackNewsPage.lead,
    "Umów oględziny auta albo zapytaj o konkretną usługę.":
      fallbackContactPage.title,
    "Najdokładniejszą wycenę przygotujemy po rozmowie i obejrzeniu samochodu. Możesz zadzwonić, wysłać formularz albo podjechać do studia w Turku.":
      fallbackContactPage.lead
  };

  return replacements[value] || value || fallback;
}

function linkedUid(value: unknown) {
  return isRecord(value) ? text(value.uid) : "";
}

async function fromPrismic<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

function serviceFromDocument(document: PrismicDocument, fallback?: Service): Service {
  const data = document.data;
  const slug = document.uid || fallback?.slug || "";

  return {
    title: text(data.title, fallback?.title),
    slug,
    eyebrow: text(data.eyebrow, fallback?.eyebrow),
    summary: text(data.summary, fallback?.summary),
    metaDescription: text(data.seo_description, fallback?.metaDescription),
    heroImage: image(data.hero_image, fallback?.heroImage || fallbackServices[0].heroImage),
    cardImage: image(data.card_image, fallback?.cardImage || fallbackServices[0].cardImage),
    lead: richText(data.lead, fallback?.lead),
    benefits: nonEmpty(
      group(data.benefits).map((item) => text(item.benefit)).filter(Boolean),
      fallback?.benefits || []
    ),
    process: nonEmpty(
      group(data.process).map((item) => text(item.step)).filter(Boolean),
      fallback?.process || []
    ),
    pricing: nonEmpty(
      group(data.pricing)
        .map((item) => ({
          label: text(item.label),
          value: text(item.value),
          note: text(item.note) || undefined
        }))
        .filter((item) => item.label && item.value),
      fallback?.pricing || []
    ),
    faqs: nonEmpty(
      group(data.faq)
        .map((item) => ({
          question: text(item.question),
          answer: text(item.answer)
        }))
        .filter((item) => item.question && item.answer),
      fallback?.faqs || []
    ),
    seoTitle: text(data.seo_title, fallback?.seoTitle || ""),
    body: richTextParagraphs(data.body, fallback?.body || []),
    relatedServiceSlugs: nonEmpty(
      group(data.related_services)
        .map((item) => linkedUid(item.service))
        .filter(Boolean),
      fallback?.relatedServiceSlugs || []
    )
  };
}

function realizationFromDocument(
  document: PrismicDocument,
  fallback?: Realization
): Realization {
  const data = document.data;
  const slug = document.uid || fallback?.slug || "";
  const coverImage = image(
    data.cover_image,
    fallback?.coverImage || fallbackRealizations[0].coverImage
  );
  const gallery = group(data.gallery)
    .map((item) => image(item.image, { src: "", alt: text(item.alt, coverImage.alt) }))
    .filter((item) => item.src);

  return {
    title: text(data.title, fallback?.title),
    slug,
    vehicle: text(data.vehicle, fallback?.vehicle),
    service: text(data.service_label, fallback?.service),
    summary: text(data.summary, fallback?.summary),
    body: richTextParagraphs(data.body, fallback?.body || []),
    coverImage,
    gallery: gallery.length > 0 ? gallery : fallback?.gallery || [coverImage],
    serviceSlugs: nonEmpty(
      group(data.services)
        .map((item) => linkedUid(item.service))
        .filter(Boolean),
      fallback?.serviceSlugs || []
    )
  };
}

function postFromDocument(document: PrismicDocument, fallback?: Post): Post {
  const data = document.data;
  const slug = document.uid || fallback?.slug || "";
  const category = text(data.category, fallback?.category) as Post["category"];

  return {
    title: text(data.title, fallback?.title),
    slug,
    category,
    excerpt: text(data.excerpt, fallback?.excerpt),
    publishedAt: text(data.published_at, fallback?.publishedAt),
    readingTime: text(data.reading_time, fallback?.readingTime),
    coverImage: image(data.cover_image, fallback?.coverImage || fallbackPosts[0].coverImage),
    videoUrl: linkHref(data.video_url, fallback?.videoUrl || "") || undefined,
    body: richTextParagraphs(data.body, fallback?.body || [])
  };
}

function testimonialFromDocument(document: PrismicDocument, fallback?: Testimonial): Testimonial {
  const data = document.data;

  return {
    author: text(data.author_name, fallback?.author),
    quote: text(data.quote, fallback?.quote),
    rating:
      typeof data.rating === "number" && data.rating > 0
        ? Math.min(data.rating, 5)
        : fallback?.rating || 5
  };
}

function testimonialFromGroupItem(item: Record<string, unknown>): Testimonial {
  return {
    author: text(item.author_name),
    quote: text(item.quote),
    rating:
      typeof item.rating === "number" && item.rating > 0
        ? Math.min(item.rating, 5)
        : 5
  };
}

function normalizePublishedAddress(value: string) {
  return value.replace(/\b10e\b/gi, "10E").replace(/10e(?=%2C)/gi, "10E");
}

function settingsFromDocument(document: PrismicDocument): Settings {
  const data = document.data;

  return {
    ...fallbackSettings,
    siteName: text(data.site_name, fallbackSettings.siteName),
    shortName: text(data.short_name, fallbackSettings.shortName),
    phoneDisplay: text(data.phone_display, fallbackSettings.phoneDisplay),
    phoneHref: text(data.phone_href, fallbackSettings.phoneHref),
    emailDisplay: text(data.email, fallbackSettings.emailDisplay),
    addressStreet: normalizePublishedAddress(
      text(data.address_street, fallbackSettings.addressStreet)
    ),
    addressHint: "",
    postalCode: text(data.postal_code, fallbackSettings.postalCode),
    city: text(data.city, fallbackSettings.city),
    hours: text(data.opening_hours, fallbackSettings.hours),
    mapEmbedUrl: normalizePublishedAddress(
      text(data.google_maps_embed_url, fallbackSettings.mapEmbedUrl)
    ),
    googleMapsUrl: normalizePublishedAddress(
      linkHref(data.google_maps_url, fallbackSettings.googleMapsUrl)
    ),
    defaultOgImage: image(data.default_og_image, {
      src: fallbackSettings.defaultOgImage,
      alt: fallbackSettings.siteName
    }).src,
    social: {
      facebook: linkHref(data.facebook_url, fallbackSettings.social.facebook),
      instagram: linkHref(data.instagram_url, fallbackSettings.social.instagram)
    }
  };
}

function pageContentFromDocument(
  document: PrismicDocument,
  fallback: PageContent
): PageContent {
  const data = document.data;
  const title = richText(data.title, fallback.title);
  const lead = richText(data.lead, fallback.lead);

  return {
    title: replaceLegacyPageText(title, fallback.title),
    lead: replaceLegacyPageText(lead, fallback.lead),
    heroImage: image(data.hero_image, fallback.heroImage),
    seoTitle: text(data.seo_title, fallback.seoTitle),
    seoDescription: text(data.seo_description, fallback.seoDescription)
  };
}

function contactPageContentFromDocument(document: PrismicDocument): ContactPageContent {
  const page = pageContentFromDocument(document, fallbackContactPage);
  const data = document.data;
  const shortKontaktTitles = new Set(["Kontakt", "Kontakt | Sleek Car"]);

  return {
    ...page,
    seoTitle: shortKontaktTitles.has(page.seoTitle)
      ? fallbackContactPage.seoTitle
      : page.seoTitle,
    formTitle: text(data.form_title, fallbackContactPage.formTitle),
    mapTitle: text(data.map_title, fallbackContactPage.mapTitle)
  };
}

export async function getOfferPageContent() {
  return fromPrismic(async () => {
    const document = await createClient().getSingle("offer_page");
    return pageContentFromDocument(document as PrismicDocument, fallbackOfferPage);
  }, fallbackOfferPage);
}

export async function getRealizationsPageContent() {
  return fromPrismic(async () => {
    const document = await createClient().getSingle("realizations_page");
    return pageContentFromDocument(document as PrismicDocument, fallbackRealizationsPage);
  }, fallbackRealizationsPage);
}

export async function getNewsPageContent() {
  return fromPrismic(async () => {
    const document = await createClient().getSingle("news_page");
    return pageContentFromDocument(document as PrismicDocument, fallbackNewsPage);
  }, fallbackNewsPage);
}

export async function getContactPageContent() {
  return fromPrismic(async () => {
    const document = await createClient().getSingle("contact_page");
    return contactPageContentFromDocument(document as PrismicDocument);
  }, fallbackContactPage);
}

export async function getSettings() {
  return fromPrismic(async () => {
    const document = await createClient().getSingle("settings");
    return settingsFromDocument(document as PrismicDocument);
  }, fallbackSettings);
}

export async function getServices() {
  return fromPrismic(async () => {
    const documents = await createClient().getAllByType("service", {
      orderings: [{ field: "document.first_publication_date" }]
    });

    if (documents.length === 0) {
      return fallbackServices;
    }

    return documents.map((document) =>
      serviceFromDocument(
        document as PrismicDocument,
        fallbackServices.find((service) => service.slug === document.uid)
      )
    );
  }, fallbackServices);
}

export async function getService(slug: string) {
  const fallback = fallbackServices.find((service) => service.slug === slug);

  return fromPrismic(async () => {
    const document = await createClient().getByUID("service", slug);
    return serviceFromDocument(document as PrismicDocument, fallback);
  }, fallback);
}

export async function getRealizations() {
  return fromPrismic(async () => {
    const documents = await createClient().getAllByType("realization", {
      orderings: [{ field: "my.realization.published_at", direction: "desc" }]
    });

    if (documents.length === 0) {
      return fallbackRealizations;
    }

    return documents.map((document) =>
      realizationFromDocument(
        document as PrismicDocument,
        fallbackRealizations.find((realization) => realization.slug === document.uid)
      )
    );
  }, fallbackRealizations);
}

export async function getRealization(slug: string) {
  const fallback = fallbackRealizations.find((realization) => realization.slug === slug);

  return fromPrismic(async () => {
    const document = await createClient().getByUID("realization", slug);
    return realizationFromDocument(document as PrismicDocument, fallback);
  }, fallback);
}

export async function getPosts() {
  return fromPrismic(async () => {
    const documents = await createClient().getAllByType("post", {
      orderings: [{ field: "my.post.published_at", direction: "desc" }]
    });

    if (documents.length === 0) {
      return fallbackPosts.filter((post) => !isPlaceholderPost(post));
    }

    const posts = documents.map((document) =>
      postFromDocument(
        document as PrismicDocument,
        fallbackPosts.find((post) => post.slug === document.uid)
      )
    );

    return posts.filter((post) => !isPlaceholderPost(post));
  }, fallbackPosts.filter((post) => !isPlaceholderPost(post)));
}

export async function getPost(slug: string) {
  const fallback = fallbackPosts.find(
    (post) => post.slug === slug && !isPlaceholderPost(post)
  );

  const post = await fromPrismic(async () => {
    const document = await createClient().getByUID("post", slug);
    return postFromDocument(document as PrismicDocument, fallback);
  }, fallback);

  if (!post || isPlaceholderPost(post)) {
    return undefined;
  }

  return post;
}

export async function getTestimonials() {
  return fromPrismic(async () => {
    const documents = await createClient().getAllByType("testimonial", {
      filters: [prismic.filter.at("my.testimonial.featured", true)]
    });

    if (documents.length === 0) {
      return fallbackTestimonials;
    }

    return documents.map((document, index) =>
      testimonialFromDocument(document as PrismicDocument, fallbackTestimonials[index])
    );
  }, fallbackTestimonials);
}

export async function getHomeContent(): Promise<HomeContent> {
  return fromPrismic(async () => {
    const [document, services, realizations, testimonials] = await Promise.all([
      createClient().getSingle("home_page"),
      getServices(),
      getRealizations(),
      getTestimonials()
    ]);
    const data = (document as PrismicDocument).data;
    const featuredServiceUids = group(data.featured_services)
      .map((item) => linkedUid(item.service))
      .filter(Boolean);
    const featuredRealizationUids = group(data.featured_realizations)
      .map((item) => linkedUid(item.realization))
      .filter(Boolean);
    const featuredTestimonials = group(data.featured_testimonials)
      .map((item) => testimonialFromGroupItem(item))
      .filter((testimonial) => testimonial.author && testimonial.quote);

    return {
      heroEyebrow: text(data.hero_eyebrow, fallbackHome.heroEyebrow),
      heroTitle: richText(data.hero_title, fallbackHome.heroTitle),
      heroText: richText(data.hero_text, fallbackHome.heroText),
      heroImage: image(data.hero_image, fallbackHome.heroImage),
      primaryCtaLabel: text(data.primary_cta_label, fallbackHome.primaryCtaLabel),
      primaryCtaHref: linkHref(data.primary_cta_link, fallbackHome.primaryCtaHref),
      aboutTitle: richText(data.about_title, fallbackHome.aboutTitle),
      aboutText: richText(data.about_text, fallbackHome.aboutText),
      aboutEyebrow: text(data.about_eyebrow, fallbackHome.aboutEyebrow),
      aboutPoints: nonEmpty(
        group(data.about_points).map((item) => text(item.point)).filter(Boolean),
        fallbackHome.aboutPoints
      ),
      certificationsEyebrow: text(
        data.certifications_eyebrow,
        fallbackHome.certificationsEyebrow
      ),
      certificationsTitle: text(
        data.certifications_title,
        fallbackHome.certificationsTitle
      ),
      certifications: nonEmpty(
        group(data.certifications)
          .map((item) => ({
            name: text(item.name),
            url: linkHref(item.url, "#"),
            label: text(item.label)
          }))
          .filter((item) => item.name && item.label),
        fallbackHome.certifications
      ),
      featuredServices:
        featuredServiceUids.length > 0
          ? featuredServiceUids
              .map((uid) => services.find((service) => service.slug === uid))
              .filter((service): service is Service => Boolean(service))
          : fallbackHome.featuredServices,
      featuredRealizations:
        featuredRealizationUids.length > 0
          ? featuredRealizationUids
              .map((uid) =>
                realizations.find((realization) => realization.slug === uid)
              )
              .filter((realization): realization is Realization => Boolean(realization))
          : realizations.slice(0, 3),
      testimonials: nonEmpty(featuredTestimonials, testimonials),
      seoTitle: text(data.seo_title, fallbackHome.seoTitle),
      seoDescription: text(data.seo_description, fallbackHome.seoDescription)
    };
  }, fallbackHome);
}

export { fallbackCertifications as certifications };
