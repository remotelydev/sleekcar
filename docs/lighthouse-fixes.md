# Lighthouse fixes

Lab only, mobile, [https://sleek-car.pl/](https://sleek-car.pl/), 2 October 2026. Performance and accessibility are Lighthouse 12.8.2. The accessibility-tree insight is Lighthouse 13.5.0, Agentic Browsing. These CLI runs do not include CrUX, so there are no field LCP, INP, or CLS numbers here.

Code checked against `origin/main` at `6b31907`. This is a plan, not an implementation.

| Lab result | Value |
| --- | --- |
| Performance | 0.98 |
| Accessibility | 0.92 |
| Agentic Browsing | 0.33 (1 of 3 applicable audits; WebMCP and `ai-catalog.json` were not applicable) |
| LCP | 2.0 s |
| FCP | 1.1 s |
| Speed Index | 1.9 s |
| TBT | 120 ms |
| CLS | 0 |
| TTI | 2.5 s |

LCP breakdown for `img.hero-image`: TTFB 532 ms, resource load delay 24 ms, resource load duration 273 ms, element render delay 158 ms. The document-latency insight still passed, so this plan does not add a server change. TTFB on the 1 October lab run was 0–19 ms; this run was higher and is one sample.

An earlier pass quoted about 85 KiB, 13 KiB, and 44 KiB. This run measured **71 KiB**, **9 KiB**, and **46 KiB** for those three insights. The resources are the same kind of finding. Use the numbers below.

## Already on main

These landed after the 1 October lab note in `docs/site-plan-video-prismic-cwv.md`. What is left is under each insight.

| Change | What this run shows |
| --- | --- |
| Hero `fetchPriority="high"` and `decoding="sync"` | LCP discovery passes: high priority, in the first HTML, not lazy. Load delay is 24 ms. Element render delay is 158 ms, down from 1.82 s on 1 October. |
| Logo `priority` removed | The logo is still the first image preload. See the network-dependency section. |
| Homepage hero `quality={60}` and `sizes="(min-width: 1280px) 1200px, 100vw"` | Mobile fetched `w=750&q=60`. Lighthouse still flags compression on that file, not an oversized slot. |
| Maps iframe after `window` `load` | Lighthouse still records Maps. The cache insight is those responses. |
| Legacy polyfills replaced in `next.config.ts` | Legacy JavaScript insight wasted bytes: 0. |

`/kontakt` was not re-run. It uses the same `MapEmbed`, so the Maps requests below still apply there.

## Improve image delivery

Est. savings **71 KiB** across three files. `modern-image-formats`, `uses-responsive-images`, and `uses-optimized-images` all passed. This insight is the remaining gap.

### PPF service card, about 38 KiB

Homepage featured card, link `/oferta/folia-ochronna-ppf`, component [`src/components/ServiceCard.tsx`](../src/components/ServiceCard.tsx).

The photo is Prismic `asZ9tX5bLirZhMMI_Porsche-5-of-13-kzearf2d.jpg`, requested as `/_next/image?...&w=750&q=75`. Transfer 58,546 bytes, est. savings 38,413. Lighthouse: the file is 665×499 for a displayed box of 426×284.

`sizes` is `(min-width: 980px) 25vw, (min-width: 640px) 50vw, 100vw`. The homepage grid is `card-grid four`. In [`src/app/globals.css`](../src/app/globals.css) that grid is one column under 640px, two columns from 640px, and four columns from 900px. The section is `width: calc(100% - 2rem)`. `100vw` is wider than the phone card, and from 900px to 980px the card is a quarter of the row while `sizes` still says `50vw`. Quality is the Next default, 75. `next.config.ts` already allows 60 and 75.

The other homepage cards in this trace were not flagged: grafen 7,415 bytes, the Toyota shot 5,799 bytes, and `oferta-na-glowna-900x400-k80mlh6a.jpg` 20,720 bytes, all `w=750&q=75`.

Fix:

- Set `quality={60}` on `ServiceCard`.
- Match `sizes` to the grid: `(min-width: 900px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)`.
- Use that same `sizes` and quality on [`RealizationCard.tsx`](../src/components/RealizationCard.tsx) and [`PostCard.tsx`](../src/components/PostCard.tsx). This run did not flag those images. They share the `100vw` mobile clause.

### Homepage hero, about 27 KiB

[`src/app/page.tsx`](../src/app/page.tsx) already sets `quality={60}`, the capped `sizes`, `priority`, `fetchPriority="high"`, and `decoding="sync"`.

This run still flags compression: `e1IIweUp23QxKjJ-_1-4-of-17-lsykmryu.jpg` at `w=750&q=60`, transfer 57,804 bytes, est. savings 27,211. The reason is compression, not the old desktop `w=1920` over-fetch. The `1920` candidate is still in the srcset; mobile selected 750. Desktop was not re-run.

Fix: try `quality={50}` on this hero and look at the photo. Leave `fetchPriority` and the sizes cap as they are.

Listing heroes were not in this trace. They still use default quality and `sizes="100vw"` in [`src/app/oferta/page.tsx`](../src/app/oferta/page.tsx), [`src/app/kontakt/page.tsx`](../src/app/kontakt/page.tsx), [`src/app/realizacje/page.tsx`](../src/app/realizacje/page.tsx), and [`src/app/aktualnosci/page.tsx`](../src/app/aktualnosci/page.tsx). Those heroes are full-bleed, so `100vw` matches the layout. The leftover there is quality 75. Service detail heroes set `fetchPriority` and `sizes="(min-width: 980px) 46vw, 100vw"` with no `quality`. Post and realization detail heroes set `priority` and that same `sizes`, and do not set `fetchPriority` or `quality` ([`src/app/aktualnosci/[slug]/page.tsx`](../src/app/aktualnosci/[slug]/page.tsx), [`src/app/realizacje/[slug]/page.tsx`](../src/app/realizacje/[slug]/page.tsx)).

### Header logo, about 7 KiB

[`src/components/Header.tsx`](../src/components/Header.tsx) renders `/assets/LOGO-bez-tla-632x192-k7awc6bu.png` at `width={158}` `height={48}` with `loading="eager"` and no `quality`. CSS caps it at `8.8rem` (about 141px). The request is `w=384&q=75`, transfer 14,072 bytes, est. savings 6,648, again from compression. The 2x slot for a 158px image is 384.

Fix: `quality={60}` and `sizes` at the rendered width (`9rem` or `158px`). The preload for this file is in the next section.

## Network dependency tree

Longest chain in this run:

1. `https://sleek-car.pl/` ends at 588 ms, transfer 10,601 bytes.
2. `/_next/static/css/0e5939bba7f3e0b6.css` ends at 905 ms, transfer 3,573 bytes.

That stylesheet is the only child. No origins were preconnected, and Lighthouse listed no preconnect candidates. The hero is not in the chain. Its preload link has `fetchPriority="high"` and `imageSizes="(min-width: 1280px) 1200px, 100vw"`.

What is left is the logo preload sitting ahead of that hero preload. Live `<head>` order:

1. `<link rel="preload" as="image">` for the logo at `w=256` / `w=384`, `q=75`, with no `fetchpriority`.
2. The hero image preload, `fetchPriority="high"`.
3. The render-blocking stylesheet.

`Header.tsx` no longer sets `priority`. It still sets `loading="eager"`, and the live img is `loading="eager"` `decoding="async"`. That eager logo is the first image preload.

Fix:

- Remove `loading="eager"` from the logo so this Next build stops emitting that preload. If a build still preloads it, set `loading="lazy"` and `fetchPriority="low"` on the logo and confirm the preload link is gone. Keep the hero preload first and `high`.
- Inline the one CSS file (next section). That removes the only request in the longest chain.

## Use efficient cache lifetimes

Est. savings **9 KiB**. Both URLs are Google Maps. No `/_next` or `/assets` URL was in the table.

| Response | Transfer | Cache TTL | Est. wasted |
| --- | --- | --- | --- |
| `maps.googleapis.com/maps/api/js/StaticMapService.GetMapImage` | 15,023 bytes | 86,400 s (1 day) | about 6.0 KiB |
| `maps.googleapis.com/maps/api/js` (`v=weekly`, `loading=async`) | 3,148 bytes | 1,800 s (30 min) | about 2.7 KiB |

Those hosts are loaded by the embed iframe. Our URL does not include an API key. [`src/lib/content.ts`](../src/lib/content.ts) `mapEmbedUrl` is `https://www.google.com/maps?q=ul.%20Milewskiego%2010E%2C%2062-700%20Turek&output=embed`. [`src/components/MapEmbed.tsx`](../src/components/MapEmbed.tsx) renders a placeholder, then on `window` `load` (or immediately if `document.readyState` is already `complete`) swaps in the iframe. Lighthouse waits past load, so it still records Maps.

Google sets those lifetimes. A longer `Cache-Control` on our own files would not change this insight.

Fix: keep Maps off the initial trace. Replace the after-load iframe with a click (or key) that inserts the iframe, which is what `fix/defer-google-maps` did before `fix/load-maps-after-page-load` replaced it. The static fallback can be a first-party image of the same map with a long cache, plus the existing “open in Google Maps” link (`settings.googleMapsUrl`). Same component on `/` and `/kontakt`.

## Render-blocking requests

One file: `/_next/static/css/0e5939bba7f3e0b6.css`, transfer 3,573 bytes. The insight score is 0.5. The item has no wasted-milliseconds field. The older `render-blocking-resources` audit scored 1, so this file is under that opportunity’s threshold and still shows up as an insight. It is the stylesheet in the chain above (document end 588 ms, CSS end 905 ms).

Source is [`src/app/globals.css`](../src/app/globals.css), imported from [`src/app/layout.tsx`](../src/app/layout.tsx). Next emits one CSS chunk. No font file is loaded. `globals.css` names Inter and the document does not request it. Leave that as it is.

Fix: inline this stylesheet so the document has no render-blocking CSS request. It is about 3.5 KiB. Do not split it into a second request. Critters / `experimental.optimizeCss` is the usual Next approach; if that plugin fights the current Next version, inline the built CSS in the document head instead. This is a smaller win than the image and Maps items.

## Reduce unused JavaScript

Est. savings **46 KiB**. Two chunks, both first-party Next output. Legacy JavaScript wasted bytes are 0, so this is not the polyfill file.

| Chunk | What it is | Transfer | Est. unused |
| --- | --- | --- | --- |
| `/_next/static/chunks/4bd1b696-aa94c7f734037000.js` | React client runtime (minified React error decoder, webpack id 441) | 60,683 bytes | 24,457 bytes (40%) |
| `/_next/static/chunks/794-ea19c8ae8ba2108e.js` | Next client runtime (`normalizePathTrailingSlash`) | 56,965 bytes | 22,582 bytes (40%) |

Other scripts in the trace were not flagged: webpack 1,608 bytes, `main-app` 612, chunk `500` 3,588, chunk `538` 27,128, `app/layout` 2,118, `app/page` 1,527.

The polyfill trim is [`next.config.ts`](../next.config.ts) swapping `polyfill-module.js` for [`src/lib/empty-polyfill.js`](../src/lib/empty-polyfill.js), with `browserslist` in `package.json` (`chrome` / `edge` / `firefox` >= 111, `safari` >= 16.4). That part is done.

These two chunks load because the tree still hydrates. [`Header.tsx`](../src/components/Header.tsx) is a client component in the root layout, for the menu button. [`MapEmbed.tsx`](../src/components/MapEmbed.tsx) is a client component on the homepage. `ContactForm` is not on `/`.

Fix, if the 46 KiB has to go away: remove the client boundary from the homepage, not another polyfill pass.

- Make the header a server component. The menu can be a `<details>` element or a CSS checkbox so it does not need `useState`.
- If Maps waits for a click, the placeholder can be server markup and a tiny inline script, or the client component can stay off the document until the click. A client `MapEmbed` on the homepage keeps React on the page even after the header change.

Coverage will keep marking a large slice of React unused on a page that only opens a menu. Dropping the client components is what removes the chunks.

## Elements use prohibited ARIA attributes

Three nodes, one rule: `aria-label` on a `div` with no role. All three are the star rows in `#opinie`.

```html
<div class="stars" aria-label="5 na 5 gwiazdek">
```

Selector: `section#opinie > div.testimonial-grid > figure.testimonial > div.stars`.

Source: [`src/app/page.tsx`](../src/app/page.tsx), the testimonial map. The stars are Lucide SVGs with `aria-hidden="true"`, so the name exists only on the `div`. A generic `div` cannot be named with `aria-label`.

Fix: give that wrapper a role that allows a name, and keep the icons hidden.

```tsx
<div className="stars" role="img" aria-label={`${testimonial.rating} na 5 gwiazdek`}>
```

`div.hero-panel` in the same file has `aria-label="Najważniejsze informacje"`. The live HTML includes it. This run did not list it. The three star rows are the failure. The panel label does not add a name the inner links lack. Removing it is safe and was not required by this audit.

## Background and foreground colors do not have a sufficient contrast ratio

10 nodes, 4 selectors. All of them are red text on `--surface` (`#18181b`).

| Node | Color | Ratio | Needs |
| --- | --- | --- | --- |
| `article.image-card p.eyebrow` (the four homepage service cards) | `#b91c1c` on `#18181b`, 14.08px bold | 2.73 | 4.5:1 |
| `article.image-card span.text-link` | `#dc2626` on `#18181b`, 16px bold | 3.66 | 4.5:1 |
| `div.cert-card > p.eyebrow` (“CERTYFIKOWANY EKSPERT”) | `#b91c1c` on `#18181b`, 14.08px bold | 2.73 | 4.5:1 |
| `section.cta-band p.eyebrow` (“KONTAKT”) | `#b91c1c` on `#18181b`, 14.08px bold | 2.73 | 4.5:1 |

Tokens in [`src/app/globals.css`](../src/app/globals.css): `--accent: #b91c1c` used by `.eyebrow`, `--accent-strong: #dc2626` used by `.text-link`, `--surface: #18181b` on `.image-card`, `.cert-card`, and `.cta-band`.

White on those reds already passes: white on `#b91c1c` is about 6.5:1, white on `#dc2626` is about 4.8:1. The phone button and `.button-primary` use that combination. Leave the button backgrounds.

Fix: add a text token and point `.eyebrow` and `.text-link` at it. `#ef4444` is about 4.7:1 on `#18181b`. `#f87171` is about 6.4:1 on `#18181b` and is the safer choice for 14px bold. Hero eyebrows sit on the photo, not on `#18181b`, and were not in this failure list. A lighter red still has to be checked on the hero overlay.

## Accessibility tree is not well-formed

Lighthouse 13.5.0 Agentic Browsing audit `agent-accessibility-tree`. It rolls up a fixed set of axe rules (names, allowed ARIA, prohibited ARIA, hidden focusable content, and similar). It does not include color contrast.

This run failed one rule in that set: “Elements must only use permitted ARIA attributes.” The node it shows is the first star row:

`section#opinie > div.testimonial-grid > figure.testimonial > div.stars`

`<div class="stars" aria-label="5 na 5 gwiazdek">`

The full prohibited-attribute audit lists that same `div` three times, once per testimonial. The `role="img"` change in the ARIA section is the fix for this insight as well.

`llms.txt` also failed in Agentic Browsing. That audit is outside this list.

### Separate failure: visible card text is not in the accessible name

Audit `label-content-name-mismatch`. It is not part of the accessibility-tree rollup. It failed on this run, on the four homepage service cards.

```html
<a aria-label="Folia ochronna PPF" href="/oferta/folia-ochronna-ppf">
```

Same for Zabezpieczenie lakieru, Renowacja lakieru, and Usuwanie wgnieceń. Selector: `section.section > div.card-grid > article.image-card > a`. The link’s visible text also includes the eyebrow, the summary, and “Zobacz szczegóły”. `aria-label` replaces that name, so the visible text is not in the accessible name.

Source: `aria-label={service.title}` in [`src/components/ServiceCard.tsx`](../src/components/ServiceCard.tsx). The `h3` already contains the title. [`RealizationCard.tsx`](../src/components/RealizationCard.tsx) and [`PostCard.tsx`](../src/components/PostCard.tsx) use the same `aria-label={title}` pattern. This run only listed the four service cards.

Fix: delete those three `aria-label` props and let the link name come from the heading and the visible text.
