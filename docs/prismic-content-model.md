# Prismic content model dla Sleek Car

Ten plik opisuje strukturę, którą warto przygotować w Prismic przed podpięciem CMS-a do Next.js.
Obecnie strona korzysta z lokalnego pliku `src/lib/content.ts`, ale jego struktura jest celowo zbliżona do poniższego modelu.

## Założenia

- Strony mają być generowane statycznie przez Next.js.
- Treści usług, realizacji, wpisów i opinii docelowo pochodzą z Prismic.
- Assety z katalogu `assets/` zostają lokalnie tylko na czas projektowania. Docelowo zdjęcia trafiają do Media Library w Prismic.
- Adres trzeba potwierdzić przed publikacją: w briefie pojawiło się `ul. Milewskiego 10E` oraz `ul. Milewskiego 9`. W projekcie roboczo użyłem `ul. Milewskiego 9`.
- Linki do Facebooka i Instagrama trzeba wkleić w `settings`, gdy Patryk je potwierdzi.

## Single types

### `settings`

Globalne dane firmy używane w headerze, footerze, mapie, formularzu i schema.org.

| Pole | Typ w Prismic | Uwagi |
| --- | --- | --- |
| `site_name` | Key Text | Np. `Sleek Car Autokosmetyka` |
| `short_name` | Key Text | Np. `Sleek Car` |
| `phone_display` | Key Text | `665 111 550` |
| `phone_href` | Key Text | `tel:+48665111550` |
| `email` | Key Text | Adres do formularza |
| `address_street` | Key Text | Po potwierdzeniu numeru |
| `address_hint` | Key Text | Np. `za budynkiem Inter Cars` |
| `postal_code` | Key Text | `62-700` |
| `city` | Key Text | `Turek` |
| `opening_hours` | Key Text | `Pn - Pt: 9.00 - 17.00` |
| `google_maps_embed_url` | Link / Key Text | URL do iframe |
| `google_maps_url` | Link | Link do profilu lub trasy |
| `facebook_url` | Link | Do uzupełnienia |
| `instagram_url` | Link | Do uzupełnienia |
| `default_og_image` | Image | Obraz fallback dla social/SEO |
| `seo_title_suffix` | Key Text | Np. `Sleek Car` |

### `home_page`

Strona główna.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `hero_eyebrow` | Key Text | `Detailing samochodowy w Turku` |
| `hero_title` | Rich Text | H1 |
| `hero_text` | Rich Text | Lead |
| `hero_image` | Image | Najlepiej PPF/detailing, nie stock |
| `primary_cta_label` | Key Text | `Sprawdź ofertę` |
| `primary_cta_link` | Link | `/oferta` |
| `featured_services` | Content Relationship, repeatable | Relacje do `service` |
| `about_title` | Rich Text | Sekcja o studiu |
| `about_text` | Rich Text | Treść z obecnej strony `O nas`, przepisana |
| `certifications_title` | Key Text | Nagłówek bloku certyfikacji |
| `featured_realizations` | Content Relationship, repeatable | Relacje do `realization` |
| `featured_testimonials` | Content Relationship, repeatable | Relacje do `testimonial` |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `offer_page`

Listing usług.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `title` | Rich Text | H1 |
| `lead` | Rich Text | Opis listingu |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `realizations_page`

Listing realizacji.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `title` | Rich Text | H1 |
| `lead` | Rich Text | |
| `featured_realizations` | Content Relationship, repeatable | Opcjonalnie ręczna kolejność |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `news_page`

Listing aktualności, poradników i vloga.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `title` | Rich Text | H1 |
| `lead` | Rich Text | |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `contact_page`

Strona kontaktowa.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `title` | Rich Text | H1 |
| `lead` | Rich Text | |
| `form_title` | Key Text | Np. `Napisz wiadomość` |
| `map_title` | Key Text | |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

## Repeatable types

### `service`

Podstrona jednej usługi. UID buduje URL `/oferta/[uid]`.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `uid` | UID | Np. `folia-ochronna-ppf` |
| `title` | Key Text | Nazwa usługi |
| `eyebrow` | Key Text | Krótka etykieta nad tytułem |
| `summary` | Text | Opis na karcie |
| `lead` | Rich Text | Wstęp na stronie usługi |
| `hero_image` | Image | Obraz w hero |
| `card_image` | Image | Obraz na listingu |
| `benefits` | Group | Pole `benefit` jako Text |
| `process` | Group | Pole `step` jako Text |
| `pricing` | Group | `label`, `value`, `note` |
| `faq` | Group | `question`, `answer` |
| `related_services` | Content Relationship, repeatable | Opcjonalnie |
| `gallery` | Group / Image | Opcjonalnie |
| `seo_title` | Key Text | Np. `Folia PPF Turek` |
| `seo_description` | Text | Meta description |

Rekomendowane UID-y:

- `folia-ochronna-ppf`
- `zabezpieczenie-lakieru`
- `renowacja-lakieru`
- `przyciemnianie-szyb`
- `czyszczenie-wnetrza`
- `przyciemnianie-lamp`
- `usuwanie-wgniecen`
- `polerowanie-lamp`
- `usuwanie-zarysowan`
- `bezpieczne-mycie-pojazdu`
- `przygotowanie-pojazdu-do-sprzedazy`
- `door-to-door`
- `wypozyczenie-miernika-lakieru`
- `ozonowanie`

### `realization`

Case study / realizacja. UID buduje URL `/realizacje/[uid]`.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `uid` | UID | Np. `bmw-m3-touring-ppf` |
| `title` | Key Text | Nagłówek karty i strony |
| `vehicle` | Key Text | Marka/model |
| `service_label` | Key Text | Krótki opis usługi |
| `services` | Content Relationship, repeatable | Relacje do `service` |
| `summary` | Text | Tekst na karcie |
| `body` | Rich Text | Opis realizacji |
| `cover_image` | Image | Zdjęcie główne |
| `gallery` | Group | Pole `image` + `alt` |
| `before_after` | Group | Opcjonalnie: pary zdjęć |
| `published_at` | Date | |
| `featured` | Boolean | Do wyróżnienia na home |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `post`

Aktualność, poradnik albo wpis vloga. UID buduje URL `/aktualnosci/[uid]`.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `uid` | UID | |
| `title` | Key Text | |
| `category` | Select | `Poradniki`, `Vlog`, `Aktualnosci` |
| `excerpt` | Text | |
| `cover_image` | Image | |
| `published_at` | Date | |
| `reading_time` | Key Text | Np. `4 min` albo `video` |
| `video_url` | Link | Opcjonalnie dla vloga |
| `body` | Rich Text | |
| `related_services` | Content Relationship, repeatable | |
| `seo_title` | Key Text | |
| `seo_description` | Text | |

### `testimonial`

Opinie klientów. Warto wkleić tylko realne opinie wybrane z Google.

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `author_name` | Key Text | Imię albo inicjały, zgodnie z tym co wolno pokazać |
| `quote` | Text | Krótki cytat |
| `rating` | Number | Najpewniej 5 |
| `source` | Select | `Google`, `Facebook`, `Inne` |
| `source_url` | Link | Link do profilu/opinii, jeżeli dostępny |
| `featured` | Boolean | Czy pokazać na home |

## Relacje i routing w Next.js

Docelowo routing w `src/lib/prismic.ts` jest przygotowany pod:

```ts
[
  { type: "home_page", path: "/" },
  { type: "offer_page", path: "/oferta" },
  { type: "service", path: "/oferta/:uid" },
  { type: "realizations_page", path: "/realizacje" },
  { type: "realization", path: "/realizacje/:uid" },
  { type: "news_page", path: "/aktualnosci" },
  { type: "post", path: "/aktualnosci/:uid" },
  { type: "contact_page", path: "/kontakt" }
]
```

## SEO checklist

- Każda usługa powinna mieć frazę lokalną w H1 lub SEO title, np. `Folia PPF Turek`.
- Każda usługa powinna mieć unikalny opis meta.
- Zdjęcia powinny mieć opisowe alty, np. `BMW M3 po zabezpieczeniu folią PPF w Sleek Car`.
- Dla usług używamy schema.org `Service`.
- Dla realizacji i wpisów używamy `Article` / `BlogPosting`.
- Dla całego studia używamy `AutomotiveBusiness`.
- Nie dodawać sztucznego `AggregateRating` do schema.org bez sprawdzenia aktualnych zasad Google.

## Kolejność uzupełniania Prismic

1. `settings`
2. 14 wpisów typu `service`
3. `home_page`
4. `offer_page`, `contact_page`
5. Kilka najmocniejszych `realization`
6. `realizations_page`
7. `news_page` i pierwsze wpisy `post`
8. Realne `testimonial` wybrane z Google
