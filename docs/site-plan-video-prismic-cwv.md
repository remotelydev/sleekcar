# Sleek Car plan: video posting, Prismic gaps, Core Web Vitals

Checked 1 October 2026 against [sleek-car.pl](https://sleek-car.pl/) and `origin/main` at `2203b82`. This is a plan, not an implementation.

Service, realization, post, and testimonial **bodies** already come from Prismic. Empty groups stay empty. The lists below are what still does not.

---

## 1. Upload a short video and post it to Instagram, Facebook, and TikTok

An authenticated person opens an unlisted page, uploads one short video and one caption, and the site publishes:

- an Instagram Reel on the studio’s professional account
- a Reel on the studio’s Facebook Page
- a video on the studio’s TikTok account

Each network succeeds or fails on its own. The page shows a link or a readable error, and a retry only for the ones that failed.

A secret URL is not the access model. The path can leak through history, screenshots, logs, or the repo. The page and every upload, publish, status, and retry route need a real server-checked login. `noindex`, no nav link, and a robots disallow keep it out of Google. They do not authorize anyone.

### What you have to set up before anyone builds the page

The site cannot create these accounts or approvals. Building the form first leaves a page that cannot post in public.

**Meta (one app for Facebook and Instagram)**

1. A Facebook Page you can create content on, and an Instagram professional account (Business or Creator) linked to that Page, both in a Meta Business Portfolio.
2. Page Publishing Authorization if Meta asks for it. Instagram publishing fails while a connected Page still requires it.
3. Two-factor authentication on the Facebook user who authorizes the app, if the Page requires it.
4. A Business-type Meta app with Facebook Login for Business and the Instagram product. Instagram Login alone does not publish to the Page.
5. Permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`. Give yourself a direct Page task so `ads_management` / `ads_read` are not needed.
6. A server token, the Page id, and the Instagram professional account id. Point the app’s privacy-policy URL at `/polityka-prywatnosci` (check that the text mentions posting through Meta’s APIs).

For a tool that posts only as this studio, Development mode and Standard Access are enough while you are an app admin. Advanced Access and Business Verification are only needed if someone with no role on the app must authorize it.

**TikTok (Content Posting API, Direct Post)**

1. An app at developers.tiktok.com, logged into the account that should own the posts. Add Content Posting API and enable Direct Post (`video.publish`).
2. Register the redirect URI for the one-time authorization.
3. **TikTok’s audit is required before public posts.** Until the client is audited, every post is private (`SELF_ONLY`), the account must be private at post time, and the client may post for at most five users in 24 hours. A private studio account is not the product.
4. After audit, a daily creator cap still applies (typically about 15 posts per creator per 24 hours, shared across API clients).
5. If the video is sent as a URL, verify ownership of `sleek-car.pl` (or the file host). The URL must be `https`, must not redirect, and must stay reachable for up to one hour.

TikTok has no system user. A person who controls the studio account must authorize the app.

### Tokens (never in Git, Prismic, or `NEXT_PUBLIC_*`)

Store values only in Netlify secrets. Names may appear in `.env.example`.

| Secret | Lifetime | What you do |
| --- | --- | --- |
| Meta app secret | Until you rotate it | Create the app; store the secret in Netlify |
| Meta system-user token (preferred) | Non-expiring tokens exist. Meta recommends 60 days, and some businesses must use that | Create a system user, assign the Page and Instagram account, generate the token |
| Long-lived Page token (fallback) | No documented expiry, but a password change, lost Page role, or removed app kills it | Use only if a system user cannot get the permissions |
| TikTok `client_secret` | Until rotated | Store server-side |
| TikTok access token | 24 hours | Refresh on a schedule |
| TikTok refresh token | 365 days | Re-authorize before it dies |

Uncertain: Instagram’s publishing guide says a Page token; the media reference says a User token. The build has to record which token the live call accepts. Facebook Reels are unambiguous: a Page access token. Instagram containers expire 24 hours after creation if they are not published.

### One file that all three networks accept

The app does not transcode. Export to this intersection:

- MP4, `moov` atom at the front, H.264, progressive, closed GOP, 4:2:0, constant frame rate 24–60
- AAC-LC, stereo, 48 kHz, about 128 kbps
- 1080×1920 (9:16)
- 3–90 seconds, and not longer than the TikTok account’s own maximum
- Under 300 MB (Instagram’s cap)

Original workshop audio is the safe input. Music you do not own can fail a copyright check after publish.

One caption, checked against the strictest limit: Instagram 2,200 characters, 30 hashtags, 20 mentions. TikTok’s title is also 2,200 UTF-16 units. Facebook Reel title/description limits were not stated in the docs.

TikTok requires commercial-content flags chosen on purpose. A normal Sleek Car clip is own-business promotion (`brand_organic_toggle` true, `brand_content_toggle` false) unless it is a paid partnership. `is_aigc` is true only for AI-generated video. TikTok privacy must start empty and be chosen from the options that account returns at that moment. A hardcoded “post everywhere as public” button does not meet TikTok’s written rule.

### How the page has to work

Netlify will not accept the video in a normal form POST. A synchronous function stops at 60 seconds. The buffered request body is about 4.5 MB for binary. A background function gets 15 minutes and a 256 KB invoke body, so it can receive a job id, not the file.

1. You finish the Meta and TikTok setup, including the TikTok audit if posts must be public.
2. You log in on the unlisted page.
3. You pick one MP4, write one caption, set the Instagram grid option, set TikTok privacy (nothing pre-selected), set the commercial flags, and confirm.
4. The browser uploads straight to temporary storage. The server only issues a short-lived upload grant. Not Git, not the Next bundle, not Prismic.
5. The server writes a job and returns immediately. The page polls status.
6. A background worker publishes each network and stores the external id.
7. The page shows three results. Retry repeats only the failed network, using the stored id, so it cannot create a second post.
8. The file is deleted after the networks have fetched it, or after a short window if a retry still needs it.

Uncertain before build: whether Netlify Blobs can hold a file up to 300 MB and serve a URL Meta and TikTok can fetch. Confirm that before choosing Blobs. Any store is fine if the browser can upload directly and the worker can read the file.

### Out of scope

Analytics, comments, a calendar, scheduling, cutting, filters, burned-in captions, a cover upload, a music picker, stories, carousels, photos, personal Facebook profiles, putting the video on the marketing site, transcoding, and letting outside customers connect their own accounts.

---

## 2. Fields that do not come from Prismic

Document bodies are Prismic. These are the gaps. Kinds: **hardcoded** (always shown), **code-only page** (no custom type), **fallback** (local copy only when Prismic is empty or the fetch fails), **override** (Prismic returned a value and the code replaces it).

### Nav and logo — hardcoded

`src/lib/content.ts` `navItems`, `Header.tsx`, `Footer.tsx`. No settings field for the menu.

- Oferta, Realizacje, Aktualności, Kontakt
- Logo `/assets/LOGO-bez-tla-632x192-k7awc6bu.png`, alt `Sleek Car Autokosmetyka`
- Brand aria-label `Sleek Car - strona główna`
- Menu button `Otwórz menu` / `Zamknij menu`

The header phone is settings (Prismic, else fallback).

### Settings and titles — fallback or hardcoded

`getSettings()` overlays Prismic on `content.ts`. Blank fields keep the local string. `src/lib/seo.ts` does **not** read Prismic. It always uses `content.ts` for the site name and the `| Sleek Car` suffix.

| What | Kind |
| --- | --- |
| Phone `665 111 550`, email `sleekcarstudio@gmail.com`, `ul. Milewskiego 10E`, `62-700 Turek`, hours `Pn - Pt: 9.00 - 17.00` | fallback |
| Site name `Sleek Car Autokosmetyka`, short name `Sleek Car` | fallback, and **hardcoded in `seo.ts` titles** even when Prismic is filled |
| Map embed and Maps search URLs | fallback |
| Footer Facebook and Instagram hrefs (`#` and `#` when Prismic is empty) | fallback |
| Canonical host `https://sleek-car.pl` | hardcoded (env `NEXT_PUBLIC_SITE_URL` or `URL` wins; no Prismic field) |
| `og:locale` `pl_PL` | hardcoded |
| Default OG image `/assets/oferta-na-glowna-900x400-k80mlh6a.jpg` | hardcoded default when a page passes no image |
| `address_hint` forced to `""` and never shown | Prismic field dropped |
| `seo_title_suffix` on the settings type | Prismic field dropped |

`normalizePublishedAddress` rewrites `10e` to `10E` after Prismic.

### CTA bands — hardcoded

`CtaBand.tsx`. Phone is settings. Eyebrow `Kontakt` and the button `Formularz kontaktowy` are always code.

| Page | Title / text |
| --- | --- |
| `/` and post pages | `Chcesz dobrze zabezpieczyć swoje auto?` / `Najdokładniejsza wycena powstaje po rozmowie i obejrzeniu samochodu.` |
| `/oferta` | `Nie wiesz, od czego zacząć?` / `Opowiedz, jak używasz auta…` |
| `/oferta/[slug]` | `Umów: {service title}` / `Najlepiej zacząć od rozmowy i krótkich oględzin auta…` |
| `/realizacje` | `Chcesz podobny efekt na swoim aucie?` / `Podeślij model auta i zdjęcia lakieru…` |
| `/realizacje/[slug]` | `Umów podobny zakres prac` / `Przy realizacjach najlepiej zacząć od zdjęć…` |
| `/aktualnosci` | `Masz pytanie po przeczytaniu poradnika?` / `Najprościej zadzwonić i opisać auto…` |

### Homepage chrome — hardcoded

Hero, about, certifications, and featured links come from `home_page` when those fields are filled. This chrome does not:

- `5.0 / 5` and `91 opinii Google` (not an aggregate of testimonial documents)
- `PPF` / `Clif Design i STEK` link
- Label `Turek`
- Services intro: `Usługi, które najczęściej chronią wartość auta` and the sentence under it; `Zobacz wszystkie usługi`
- Realizations intro: `Auta, na których widać różnicę` and the sentence under it; `Zobacz realizacje`
- Testimonials intro: `5 gwiazdek od klientów w Google` and the sentence under it
- Location: `Nasza siedziba` / `Umów oględziny auta w Turku.` / `Przejdź do kontaktu`
- WebPage schema name `Detailing samochodowy Turek`

Quotes and authors are Prismic. `source` and `source_url` on testimonials are never rendered. A missing rating becomes 5 stars. If both testimonial sources are empty, the heading still shows and the grid is empty.

Certifications are Prismic when the group has rows. The Titan / ArtDeShine / Tevo / Clif Design / STEK list, plus `Certyfikowany ekspert` and `Powłoki ochronne i folie PPF`, is a fallback only.

Homepage fallbacks (only when the Prismic field is blank): the current H1, lead, hero image, `Sprawdź ofertę`, the about block and its three points, and the SEO title/description.

### Listing chrome — hardcoded

H1, lead, hero, and meta come from the page single type. These do not:

- Breadcrumb root `Start`
- `/oferta`: eyebrow `Oferta`; `Wybierz zakres prac` and its lead; schema name `Oferta Sleek Car`
- `/realizacje`: eyebrow `Realizacje`; schema name `Realizacje Sleek Car`
- `/aktualnosci`: eyebrow `Aktualności i vlog`; schema name `Aktualności Sleek Car`
- `/kontakt`: eyebrow `Kontakt`; `Dane studia`; H2 `SleekCar autokosmetyka` (does not use `settings.siteName`); eyebrow `Dojazd`; schema name `Kontakt Sleek Car`
- Card links: `Zobacz szczegóły`, `Czytaj więcej`, `Przeczytaj`

### Service, realization, and post template headings — hardcoded

The lists inside them are Prismic.

- Service: `Dlaczego warto?`, `Ceny i czas`, `Jak przebiega usługa?`, `Najczęstsze pytania`, `Zobacz też`, breadcrumbs `Oferta`
- Realization: `Zakres i efekt`, `Projekt`, `Auto`, `Usługa`, `Zdjęcia realizacji`
- Post: `Wpis`, `Kategoria`, `Czas`, `Video`, `Otwórz film`

Meta title becomes `{title} Turek` when a service `seo_title` is empty. Realization and post `seo_title` / `seo_description` are not mapped; those pages use `title` + `summary` or `excerpt`.

### Contact form — hardcoded

`ContactForm.tsx`. Prismic `form_title` is loaded and never shown.

- Labels: `Imię i nazwisko`, `Numer telefonu`, `Email`, `Treść`
- `Wyślij wiadomość` / `Wysyłanie...`
- `Dziękujemy. Wiadomość została wysłana.`
- `Nie udało się wysłać wiadomości. Najszybciej będzie zadzwonić.`
- Map iframe title `Mapa dojazdu do Sleek Car Autokosmetyka`

### Footer — hardcoded

NAP values are settings. These strings are not:

- `Detailing, folie PPF, korekta lakieru i zabezpieczenia ochronne w Turku.`
- Column titles `Menu`, `Kontakt`, `Social media`
- Link text `Facebook`, `Instagram`
- `© {year} {shortName}. Wszystkie prawa zastrzeżone.`
- `Polityka prywatności`

### Privacy policy and 404 — code-only pages

`/polityka-prywatnosci` has no custom type. NAP tokens come from settings. The rest of the page is code: RODO intro, administrator, what is collected, the Netlify form paragraph, map and third parties, cookies, rights, and `Ostatnia aktualizacja: 13 września 2026 r.`

`/404`: `Nie znaleziono strony.`, `Ten adres nie prowadzi do aktywnej podstrony Sleek Car.`, `Wróć na stronę główną`, `Oferta`. The document title falls through to the homepage default.

### Schema literals — hardcoded

Name, phone, email, street, postal code, and city inside schema follow settings. These do not:

- `addressCountry` `PL`
- Geo `52.0203`, `18.5047`
- Opening hours Mon–Fri `09:00`–`17:00` (not parsed from the hours string)
- `areaServed` Turek, Konin, Koło, Kalisz, Uniejów (service pages only say Turek)

### Overrides that replace a real Prismic value

If a page title or lead is exactly one of these old CMS strings, the site shows the local fallback instead:

- Oferta title `Detailing, zabezpieczenie lakieru i usługi ochronne dla auta.`
- Oferta lead starting `Każda usługa ma osobną podstronę…`
- Realizacje title `Efekty prac, które pomagają klientom podjąć decyzję.`
- Realizacje lead starting `Zamiast przypadkowej galerii…`
- Aktualności title `Poradniki, kulisy pracy i świeże realizacje ze studia.`
- Aktualności lead starting `Ta sekcja jest gotowa na wpisy poradnikowe…`
- Kontakt title `Umów oględziny auta albo zapytaj o konkretną usługę.`
- Kontakt lead starting `Najdokładniejszą wycenę przygotujemy po rozmowie…`
- Kontakt SEO title exactly `Kontakt` or `Kontakt | Sleek Car` becomes `Kontakt, dojazd i wycena | Sleek Car Turek`

### What to do with the gaps

Do not move template chrome (breadcrumbs, “Dlaczego warto?”, form labels, 404) into Prismic unless you want to edit them there. The fields worth a Prismic field, if you want one CMS source, are:

1. Nav labels and logo
2. Homepage review chip (`5.0 / 5`, `91 opinii Google`) and the section intros
3. CTA title and text per page
4. Footer tagline
5. Privacy policy body
6. Schema geo, hours, and `areaServed`
7. `seo.ts` should use Prismic `site_name` / `short_name` instead of always reading `content.ts`
8. Render `form_title`, or stop mapping it
9. Delete `replaceLegacyPageText` once those old strings are gone from Prismic

Keep phone, address, hours, and email as settings fallbacks so the header still works if the settings document fails.

---

## 3. Core Web Vitals — measured, then what to fix

PageSpeed Insights, Lighthouse 13.5, 1 October 2026. Lab only. There is **no Chrome field data** (CrUX) for the origin or any tested URL, so field LCP, INP, and CLS do not exist yet. Lab INP was not in the payload; TBT is the interactivity number.

CLS was 0 on every run. Document TTFB was 0–19 ms. The server is not the lab LCP problem.

| Page | Mobile score | Mobile LCP | Desktop score | Desktop LCP |
| --- | --- | --- | --- | --- |
| `/` | 96 (an earlier run 95, LCP 2.6 s) | 2.3 s | 98 | 1.1 s |
| `/oferta` | 96 | 2.7 s simulated, 0.73 s observed | 100 | 0.7 s |
| `/oferta/folia-ochronna-ppf` | 99 | 2.1 s | 100 | 0.5 s |
| `/kontakt` | **66** | **6.6 s simulated**, 1.28 s observed | 94 | 1.5 s |
| `/aktualnosci` | 99 | 2.1 s | 100 | 0.6 s |

Mobile `/` is the page whose LCP is slow even unthrottled (2.3–2.4 s observed, and 2.6 s on one simulated run, which is outside the “good” band). `/kontakt`’s score of 66 is the slow-4G simulation with Google Maps, not a 6.6 s paint on a fast connection.

### Fixes, in order

1. **Homepage hero render delay.** Observed LCP on `/` mobile is 2.39 s, of which **1.82 s is element render delay**. The hero is in the HTML and is not lazy, but `fetchpriority=high` is missing on both the `<img>` and the preload. The logo is preloaded first and competes with it. The `priority` prop is already set in `src/app/page.tsx` and `src/components/Header.tsx` and is not producing that attribute.
   - One high-priority preload for the hero, with `fetchpriority="high"`.
   - Take `priority` off the header logo.
   - Do not set `decoding="async"` on the LCP image.
   - The same missing `fetchpriority` is on the heroes for `/oferta`, `/kontakt`, the service page, and `/aktualnosci`.

2. **Do not load Google Maps until someone asks.** This is the gap between mobile scores of 96–99 and **66** on `/kontakt`. Unused Maps JavaScript is estimated at **1,510 ms of LCP** and **261 KiB** there (472 KiB transfer, 462 ms main thread). `MapEmbed.tsx` already uses `loading="lazy"` and that was not enough. Replace the live iframe with a static map or a button that inserts the iframe on click. Same component on `/` and `/kontakt`.

3. **Shrink the hero file that actually downloads.** Mobile: the 66 KiB hero has about 34 KiB flagged for stronger compression. Desktop: the same photo is fetched at `w=1920` (287 KiB) for a 1335×889 box, about 99 KiB flagged, because `sizes="100vw"` jumps to the 1920 slot. `next.config.ts` already allows AVIF and WebP. Lower `quality` on that hero and set `sizes` so desktop DPR 1 does not pick 1920.

4. **Trim the shared Next bundle.** Every page flagged the same two chunks, about 48 KiB unused, estimated **300 ms** simulated LCP on pages without Maps. About 13 KiB of that is legacy polyfills (`Array.prototype.at`, `flat`, `flatMap`, and similar). There is no `browserslist` override in the repo root that was inspected.

5. **Render-blocking CSS is real and small.** One file, about 3.7 KiB, estimated 300 ms on `/` mobile and 140 ms on `/oferta` mobile. Inlining the critical part is a smaller win than items 1–3.

6. **Leave CLS and fonts alone.** CLS was 0. No first-party font file loaded. `globals.css` names Inter, but the document does not load it. Adding a font CDN would create a request these runs do not have. Lab TBT was in the good band (worst 160 ms, on `/kontakt` mobile, which is Maps).
