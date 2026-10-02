# Cookie banner, GA4, and web vitals

Plan only. This change does not add the banner, the tag, or the privacy-page copy.

Site: [https://sleek-car.pl/](https://sleek-car.pl/). Next.js App Router on Netlify (`netlify.toml`, `@netlify/plugin-nextjs`). Prismic repository `sleekcar` (`NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME`). Language `pl`. The privacy page is code, not a Prismic document.

Checked against public docs on 2 October 2026. Anything that those docs leave open is under [Uncertainties](#uncertainties).

## What is already true

- `/polityka-prywatnosci` is `src/app/polityka-prywatnosci/page.tsx`. Under “Jakie dane zbieramy” it says the site does not use Google Analytics, Google Tag Manager, or ad pixels, and that a future analytics script would start only after the legally required consent. Under “Pliki cookies” it says marketing cookies are unnecessary and mentions only the map and the Prismic preview bar. Both passages have to become true again once GA4 can run.
- The page stays in code. One edit to that file is enough. Do not move the policy into Prismic.
- Root layout is `src/app/layout.tsx` (`<html lang="pl">`, header, `<main>`, footer). That is where the banner mounts.
- `fromPrismic` in `src/lib/prismic-content.ts` catches every error and returns fallback content. The banner may use a short Polish fallback. The GA gate must not. A failed banner read has to stay distinguishable from a published document.
- Production Prismic fetches use `cache: "force-cache"` and the `prismic` tag (`src/lib/prismic.ts`). A successful read that is already cached is a published document. A failed read at build or revalidate is not.
- The map stays as it is. `src/components/MapEmbed.tsx` inserts the iframe after `window` `load`.

## Out of scope

ImageOptim workflow, Chrome UX Report (CrUX) polling, ads, remarketing, and Google Tag Manager. This plan does not state a CrUX traffic threshold.

## 1. Prismic singleton

Add a single type `cookie_banner` (`repeatable: false`), later as `customtypes/cookie_banner/index.json`. Keep it separate from `settings`. The measurement ID is not a Prismic field.

| API ID | Prismic type | Purpose |
| --- | --- | --- |
| `title` | Key Text | Banner heading |
| `body` | Text | Short explanation |
| `accept_label` | Key Text | Accept button |
| `reject_label` | Key Text | Reject button |
| `privacy_link_label` | Key Text | Visible label of the privacy link |

The link target stays in code: `/polityka-prywatnosci`. The banner branch may add this table to `docs/prismic-content-model.md` so the field inventory matches the type.

Suggested published Polish copy, for the owner to edit in Prismic:

- Title: `Cookies i analityka`
- Body: `Google Analytics włączamy tylko po akceptacji. Odrzucenie nie ładuje tych skryptów.`
- Accept: `Akceptuję`
- Reject: `Odrzucam`
- Privacy link: `Polityka prywatności`

If `getSingle("cookie_banner")` throws or the document is missing, show this same short fallback so the visitor can still choose. Store the choice. Do not load GA for that choice until a later render has actually read the published document. Accept on the fallback is not acceptance of the published text.

If the document loads and a single field is empty, fill that field from the fallback. The document still counts as published, so Accept may load GA.

## 2. Banner behavior and mount

New client component `src/components/CookieBanner.tsx`, rendered from `src/app/layout.tsx` inside `<body>`, on every route including the privacy policy.

The server passes `{ available, title, body, acceptLabel, rejectLabel, privacyLinkLabel }`. `available` is true only when the published singleton was read. The client reads and writes the choice; it does not decide that Prismic succeeded.

Behavior:

- The banner does not block the page. The privacy link works before either button.
- Accept and Reject are both buttons, with the same visual weight. Reject is not a quiet text link. No checkbox. Nothing is pre-selected.
- Persist the choice in `localStorage` under `sleekcar-consent`, values `accepted` or `rejected`. Consent Mode does not store the choice. The value stays in the browser and is not sent to Netlify.
- After a choice, hide the banner.
- No stored choice: show the banner, do not load GA.
- Stored `rejected`: hide the banner, do not load GA.
- Stored `accepted`: hide the banner, and load GA only when `available` is true and the measurement ID is set.
- The privacy page gets a control that reopens the banner. Choosing Reject after an earlier Accept updates consent to denied and loads no further analytics events. Say on the privacy page that cookies already written can be removed in the browser. This plan does not claim the site can reliably delete every Google cookie.

## 3. Loading GA4

Use basic Consent Mode. Load the Google tag only after an explicit Accept (or a stored `accepted` on a later page). A Reject, a missing choice, a missing measurement ID, or an unread Prismic banner never requests `googletagmanager.com`.

Advanced mode is the wrong fit here. It loads the tag immediately and, while consent is denied, sends cookieless pings (the request can still carry the page URL, user agent, and IP). Basic mode, as described in [About consent mode](https://support.google.com/google-ads/answer/10000067), blocks the tag until the visitor interacts with the banner and sends nothing before consent, including no consent-status ping. Ads modeling is out of scope, so those pings are not needed.

The [consent setup guide](https://developers.google.com/tag-platform/security/guides/consent) (page last updated 2026-07-30 UTC) requires this order: consent `default` before any `config` or `event`. On Accept, and on each later page where the stored choice is `accepted` and the other gates pass:

1. Define `dataLayer` and `gtag`.
2. Set the default:

```js
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
```

3. Then update analytics only:

```js
gtag('consent', 'update', {
  analytics_storage: 'granted'
});
```

4. Only after that, load `https://www.googletagmanager.com/gtag/js?id=MEASUREMENT_ID` and call `gtag('js', new Date())` and `gtag('config', MEASUREMENT_ID)`.

`ad_storage`, `ad_user_data`, and `ad_personalization` stay `denied` after Accept. The banner asks for analytics, not ads. Also set `ads_data_redaction` to `true` before `config`, which the same guide documents for the case when `ad_storage` is denied. Do not enable `url_passthrough`. Do not set a region list that would measure anyone without this banner. Skip `wait_for_update`: the tag is not loaded until the choice is already known, and default plus update run synchronously before `config`.

`@next/third-parties/google` `GoogleAnalytics` is not the loader. The App Router guide fetched on 2 October 2026 ([third-party libraries](https://nextjs.org/docs/app/guides/third-party-libraries)) lists `gaId`, `dataLayerName`, `debugMode`, and `nonce`. It has no consent prop, and the component calls `config` after hydration. The Next.js note on that family of docs allows `next/script` directly. Mount a `next/script` snippet only after the gate, with the consent commands in the same inline script before `config`. `sendGAEvent` is usable only once that snippet is on the page; calling `gtag` from the web-vitals callback is enough.

Measurement ID:

- Netlify environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- It is public by nature: it is in the `gtag.js` URL and in the client bundle.
- Never commit a real ID, and do not put one in Prismic.
- If the variable is missing, do not load GA.

In the GA4 stream, enable enhanced measurement and “Page changes based on browser history events”, so App Router navigations count as page views. Do not also send a manual `page_view`. Use `debug_mode` only on a non-production deploy.

## 4. Web vitals after consent

Add the `web-vitals` npm package (standard build). Do not load it from a CDN. Do not use the attribution build or `web-vitals@soft-navs` in the first implementation.

Register listeners only after the same gate as GA4 (Accept, published banner, measurement ID, `gtag` already configured). The library reads buffered performance entries, so registering after the click still reports that page view. The Accept click itself can be the interaction that INP records on that first page.

Send LCP, INP, and CLS, plus FCP and TTFB. The [web-vitals README](https://github.com/GoogleChrome/web-vitals/blob/main/README.md) on `main` (fetched 2 October 2026) lists those five, and its GA4 example is:

```js
gtag('event', name, {
  value: delta,       // summable
  metric_id: id,      // groups later updates of the same metric
  metric_value: value,
  metric_delta: delta,
  page_location: navigationURL
});
```

`metric_rating` is in that section as an optional parameter: `'good' | 'needs-improvement' | 'poor'`. Include it. A GA4 exploration can then count ratings. The README’s `navigationURL` is the metric field of that name; the snippet does not show the destructure. Pass `metric.navigationURL` and omit `page_location` when it is absent.

```js
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

function sendToGoogleAnalytics({ name, delta, value, id, rating, navigationURL }) {
  gtag("event", name, {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
    metric_rating: rating,
    ...(navigationURL ? { page_location: navigationURL } : {})
  });
}

onLCP(sendToGoogleAnalytics);
onINP(sendToGoogleAnalytics);
onCLS(sendToGoogleAnalytics);
onFCP(sendToGoogleAnalytics);
onTTFB(sendToGoogleAnalytics);
```

Leave the callbacks on their default timing. Do not pass `reportAllChanges: true`. Do not multiply CLS by 1000; the README notes that GA4 accepts non-integer values. Ignore the older `useReportWebVitals` example that sends `event_label`, `non_interaction`, and an integer CLS. That shape is from Universal Analytics.

In the GA4 property, register event-scoped custom dimensions for `metric_id` and `metric_rating`, and a custom metric for `metric_value`. Confirm in that property’s UI that explorations only list registered parameters. DebugView shows the events either way.

GA4 will not give a real p75. The same README says Google Analytics has no built-in metric distributions. An average of `value` (the delta) is not a field percentile. Monitor `metric_rating` in an exploration: share of `good`, `needs-improvement`, and `poor` for each event name (`LCP`, `INP`, `CLS`, `FCP`, `TTFB`). Use a BigQuery export only if a true percentile is needed later: keep the last `metric_value` per `metric_id`, then compute the percentile outside GA4. Do not set up BigQuery in these branches.

Verify in GA4 DebugView ([DebugView](https://support.google.com/analytics/answer/7201382)). After Accept, the events above should appear with `metric_rating`. After Reject, the tag should not load and those events should not appear.

`reportSoftNavs` stays out of the first implementation. The README ties it to the separate `web-vitals@soft-navs` build and to Chromium 151 and newer, and turning it on finalizes the first page’s metrics at the first soft navigation. App Router client navigations still get a GA4 `page_view` through enhanced measurement. The web-vitals events will mostly describe full page loads.

## 5. Consent bias

GA4 and these web-vitals events include only visitors who accepted. Visitors who reject are missing, and that group may differ by device or browser. The rating mix is the consented sample. It is not CrUX, which is Chrome’s aggregated field data and is not gated on this banner. Do not read a GA4 “poor” share as the origin’s CrUX status. No CrUX poll, and no eligibility threshold, belongs in this work.

## 6. Later implementation branches

Do not create these branches in this change. Suggested order:

1. Banner and Prismic. Singleton, custom-type JSON, server read with an `available` flag, client banner, equal buttons, `localStorage`, fallback copy, privacy-page control to reopen the banner. No Google request in this branch.
2. GA4 consent, including the privacy-page sentences. Env-gated `next/script`, consent default denied, `analytics_storage` granted only after Accept, ad parameters left denied. The policy text ships in this same branch so the page is not false while the tag can run.
3. Web-vitals events. The `web-vitals` dependency and the event shape above, behind the same gate.

## 7. What the owner does

- Create a GA4 property and a web stream for `https://sleek-car.pl/`.
- Put the measurement ID (`G-…`) in Netlify as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and redeploy. Do not commit it.
- In Prismic (`sleekcar`), publish the `cookie_banner` singleton (title, body, accept, reject, privacy-link label).
- After the web-vitals branch, register `metric_id`, `metric_rating`, and `metric_value` in GA4, and check DebugView after Accept and after Reject.
- Turn on BigQuery only if true percentiles are wanted later.

The privacy wording below is factual copy for the code page, not a legal opinion. The owner should read it before it ships.

## Privacy page

Edit `src/app/polityka-prywatnosci/page.tsx` in the GA4 branch. Keep the rest of the page. Replace the paragraph that begins “Nie wdrażamy obecnie Google Analytics…” with:

> Po kliknięciu „Akceptuję” strona ładuje Google Analytics 4. Do Google trafiają wtedy odsłony oraz pomiary wydajności (LCP, INP, CLS, FCP i TTFB). Podstawą jest zgoda, art. 6 ust. 1 lit. a RODO. „Odrzucam” nie ładuje tego skryptu. Nie używamy Google Tag Managera ani pikseli reklamowych. Zgodę można zmienić na tej stronie.

Add one sentence to “Pliki cookies”, so that section matches the new paragraph:

> Po akceptacji Google Analytics może zapisać cookies analityczne. Bez akceptacji ten skrypt się nie uruchamia.

Leave the map paragraph as it is. Update “Ostatnia aktualizacja” when the branch ships.

## Sources

Fetched 2 October 2026:

- [Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent), last updated 2026-07-30 UTC. Default deny for `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage` before `config`. Consent Mode v2 is those two `ad_user_*` parameters plus the older two. The guide’s sample grants all four on “Accept all”; this plan grants analytics only, because ads are out of scope.
- [About consent mode](https://support.google.com/google-ads/answer/10000067). Basic mode blocks tags until a choice and sends no data before consent. Advanced mode loads tags with a denied default and sends cookieless pings while denied.
- [web-vitals README](https://github.com/GoogleChrome/web-vitals/blob/main/README.md), `main`. GA4 event shape, optional `metric_rating`, no built-in distributions, BigQuery or the Data API for a real distribution.
- [Next.js third-party libraries](https://nextjs.org/docs/app/guides/third-party-libraries). `GoogleAnalytics` props and post-hydration load. No consent parameter on that page.
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382).

## Uncertainties

- The consent guide’s own gtag sample loads the Google tag on the page with a denied default, which is advanced-mode behavior. Basic mode is specified on the Ads help page above, not as a full code sample in the developer guide. This plan follows basic mode because the tag must not load before Accept.
- “Defaults denied until Accept” is implemented as: all four parameters are `denied` before Accept, and Accept sets `analytics_storage` to `granted` only. Granting the three ad parameters on that same click would record advertising consent the banner does not ask for.
- `GoogleAnalytics` from `@next/third-parties` had no consent prop in the public guide on 2 October 2026. The package is marked experimental there. Recheck the props table before building. Until a consent hook exists, use `next/script` with the commands ordered as above.
- `metric_rating` is documented as optional. It is included so an exploration can show good / needs-improvement / poor without BigQuery.
- The README assigns `page_location: navigationURL` without showing where that identifier is bound. The metric type on the same page has `navigationURL`. Use the metric field.
- Soft-navigation reporting was not verified beyond that README section. It is a different build and changes first-load measurement, so it is deferred.
- Pin the `web-vitals` version at implementation time. This plan read `main`, not a release tag.
- A cached successful Prismic read survives a later API blip until revalidation fails. “Prismic is down” in this plan means the banner document was not read for this render.
- Registering custom dimensions is standard GA4 practice so explorations can use the parameters. Confirm it in the new property rather than assuming the UI labels.
