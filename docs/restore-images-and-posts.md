# Restore service images and blog posts in Prismic

Yes — both regressions come from [Stop catalog fallbacks](https://gitlab.com/devbartosz/sleekcar/-/merge_requests/5) (now on `main`). We did **not** overwrite images that were already set in Prismic, and we did **not** delete posts from the CMS. We stopped filling gaps from the old [`src/lib/content.ts`](../src/lib/content.ts) catalogs.

- **Thumbnails:** [`ServiceCard`](../src/components/ServiceCard.tsx) uses `cardImage`. Empty `card_image` now falls back to `settings.defaultOgImage` (`oferta-na-glowna-900x400-k80mlh6a.jpg` — the PPF foil shot). Before, each service used its own `/assets/...` file from the catalog.
- **`/aktualnosci`:** live Prismic has **0** `post` documents. The two real articles (`folia-ppf-czy-powloka-ochronna`, `jak-przygotowac-nowe-auto-do-pierwszych-kilometrow`) lived only in the deleted catalogs. The vlog stays unpublished.

Do **not** restore those catalogs in code. Fix this in Prismic (write token in chat, never committed). Skip the vlog placeholder.

Start only after the write token is in this chat. Same Migration API + publish flow as the earlier CMS copy work. Repo `sleekcar`. Revoke the token when done.

## 1. Fill empty service images

Live CDN: 8 services have **both** `hero_image` and `card_image` empty (those listings are the foil default). `przyciemnianie-lamp` has a hero but an empty card, so its miniature still uses the foil shot.

**Only fill empty fields.** Leave already-set Prismic images (PPF Porsche, powłoka grafen, korekta Toyota, szyby, wnętrze).

Match empty fields to the old catalog files still on the site under `/assets/` (ingest those URLs into the media library rather than guessing new shots):

- `usuwanie-zarysowan` — `usuwanie zarysowan/523x262-k8mxyx35.jpg` / `250x167-k8mzi95n.jpg`
- `przygotowanie-pojazdu-do-sprzedazy` — `przygotowanie autoa do sprzedazy/250x167-k9uboszg.jpg`
- `bezpieczne-mycie-pojazdu` — `bezpieczne mycie/250x167-k8n1dx5r.jpg`
- `door-to-door` — `zdjecie-do-realizacji-k82tehpn.jpg` / `toyota--27-k82tedeh.jpg`
- `wypozyczenie-miernika-lakieru` — `wyporzyczenie miernika/slajder-900x400-kaf1l797.jpg` / `podstrona-406x271-kaf1hzqd.jpg`
- `usuwanie-wgniecen` — `usuwanie egniecen/wgniecenia-930x400-kb0qdhbt.jpg` / `wgniecenia-400-kb0pxw57.jpg`
- `polerowanie-lamp` — `polerowanie lamp/lampa-po-375x250-k7xtsox8.jpg` / `lampa-przed-375x250-k7xtspwd.jpg`
- `ozonowanie` — `ozonowanie/ozonowanie-slajder-kaf173fa.jpg` / `ozonowanie-250x167-oferta-kaf0v7e8.jpg`
- `przyciemnianie-lamp` **card only** — `przyciemnianie lamp/250x167-k7xrsq7p.jpg`

If the same file already exists in the Prismic media library, link it instead of uploading a duplicate.

## 2. Recreate the two blog posts

Create and publish `post` documents (custom type already has the fields):

- `folia-ppf-czy-powloka-ochronna` — title, excerpt, body, cover `zabezpieczenie lakieru/ppf-375c250-k7xss2vz.jpg`, category Poradniki, date 2026-01-12
- `jak-przygotowac-nowe-auto-do-pierwszych-kilometrow` — cover `BMW-7-PPF-6-kzea3k65.jpg`, date 2026-01-28

Copy from git `a3c5fa8` (pre-slim catalogs). Do not recreate `vlog-kulisy-aplikacji-folii-ppf`.

## 3. Small code guard (one MR)

Branch `fix/card-image-falls-back-to-hero`, commit `fix(cms): fall back service cards to hero before default foil`.

In [`src/lib/prismic-content.ts`](../src/lib/prismic-content.ts) on current `main`: `cardImage` should use `card_image`, then `hero_image`, then `defaultImage()`. That stops a filled hero with an empty card from looking like the foil default.

## 4. Check live

After publish + Netlify rebuild (CMS-only may not need a deploy if images are fetched at runtime from the CDN): `/oferta` cards are no longer all the foil shot; `/aktualnosci` lists the two poradniki; both post URLs 200. Then **revoke the write token**.
