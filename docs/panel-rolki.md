# Panel właściciela: dodawanie rolek

Adres: `https://www.sleek-car.pl/panel` (przekierowuje do `/panel/rolki`, bez sesji do `/panel/logowanie`).

Jeden formularz: plik wideo + tytuł + opis (+ opcjonalna okładka). Po wysłaniu:

1. **Prismic**: wideo i okładka trafiają do Media Library, powstaje dokument `post` (UID z tytułu, kategoria do wyboru, `video_url` = plik, opis jako `body`, tag `rolka`). Gdy zaznaczone „Od razu opublikuj”, panel publikuje *Migration release* i odświeża cache strony.
2. **Instagram**: Reels przez Graph API, podpis = opis, Instagram pobiera plik z adresu Prismic.
3. **TikTok**: Content Posting API, plik wysyłany fragmentami, tytuł = opis.

Strona wpisu w Aktualnościach odtwarza plik MP4/MOV w pionowym odtwarzaczu `<video>`.

## Indeksowanie

`/panel` i `/api/panel` mają `<meta name="robots" content="noindex, nofollow">`, nagłówek `X-Robots-Tag: noindex, nofollow, noarchive`, `Cache-Control: private, no-store`, wpis `Disallow` w `robots.txt` i nie występują w `sitemap.xml`. Wpis w `robots.txt` ujawnia samą ścieżkę, ale bezpieczeństwo nie opiera się na jej ukryciu.

## Zabezpieczenie

Porównane warianty:

| Wariant | Plusy | Minusy |
| --- | --- | --- |
| **Hasło + kod 2FA (TOTP), wybrany** | Dwa składniki, brak zewnętrznych usług i zależności, działa na telefonie | Hasło i klucz 2FA trzeba wygenerować skryptem |
| Logowanie Google (Auth.js) z allowlistą e-maila | Bez haseł, 2FA po stronie Google | Projekt w Google Cloud, nowa zależność, więcej konfiguracji |
| Magic link e-mailem | Bez haseł | Wymaga dostawcy e-mail (strona go nie ma), bezpieczeństwo = skrzynka |
| Cloudflare Access / Basic Auth Netlify | Mało kodu | DNS w Cloudflare albo płatny plan Netlify; Basic Auth bez 2FA i limitu prób |

Co jest zaimplementowane:

- hasło sprawdzane z hashem scrypt (`PANEL_PASSWORD_HASH`), kod TOTP z aplikacji (Google Authenticator, 1Password, Authy), ten sam kod nie zadziała drugi raz,
- sesja: podpisane HMAC ciasteczko `__Host-sc_panel`, `HttpOnly`, `Secure`, `SameSite=Strict`, ważne 12 h,
- limit prób: 5 nieudanych logowań z jednego IP na 15 min oraz 20 łącznie na godzinę, potem blokada,
- CSRF: każde żądanie zmieniające dane wymaga nagłówka `x-panel-request: 1` i nagłówka `Origin` z tej samej domeny (plus `SameSite=Strict`),
- sekrety wyłącznie w zmiennych środowiskowych Netlify.

Wylogowanie wszystkich sesji: zmień `PANEL_SESSION_SECRET` i zrób redeploy.

## Konfiguracja (Netlify > Site configuration > Environment variables)

### 1. Logowanie

```bash
node scripts/panel-setup.mjs
```

Skrypt pyta o hasło (min. 12 znaków) i wypisuje `PANEL_PASSWORD_HASH`, `PANEL_TOTP_SECRET`, `PANEL_SESSION_SECRET` oraz klucz do dodania w aplikacji 2FA na telefonie właściciela. Wklej trzy zmienne do Netlify.

### 2. Prismic (`PRISMIC_WRITE_TOKEN`)

Prismic > Settings > API & Security > zakładka **Write APIs** > wygeneruj token. Ten sam token obsługuje Asset API (Media Library) i Migration API. Limit pliku: 100 MB.

### 3. Instagram (`INSTAGRAM_USER_ID`, `INSTAGRAM_ACCESS_TOKEN`)

Wymagania: konto Instagram **firmowe lub twórcy**, połączone ze stroną na Facebooku.

1. developers.facebook.com > My Apps > Create App (typ *Business*), dodaj produkt **Instagram** (wariant „API setup with Facebook login”).
2. Uprawnienia: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management`. Dopóki z aplikacji korzysta tylko właściciel (rola admin/tester w aplikacji), App Review nie jest potrzebne.
3. Token, który nie wygasa: Meta Business Suite > Ustawienia firmy > Użytkownicy > **Użytkownicy systemowi** > dodaj (admin), przypisz mu aplikację, stronę FB i konto IG, „Wygeneruj token” z powyższymi uprawnieniami, ważność „Nigdy”. To jest `INSTAGRAM_ACCESS_TOKEN`.
4. `INSTAGRAM_USER_ID`: w Graph API Explorer `GET /me/accounts?fields=instagram_business_account` i weź `instagram_business_account.id`.

Alternatywa: token z „Instagram API with Instagram Login” (bez strony FB). Wtedy ustaw `INSTAGRAM_GRAPH_HOST=graph.instagram.com`, ale token wygasa po 60 dniach i trzeba go odświeżać.

### 4. TikTok (`TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`)

1. developers.tiktok.com > Manage apps > Connect an app. Dodaj produkty **Login Kit** i **Content Posting API** (włącz *Direct Post*).
2. Scopes: `user.info.basic`, `video.upload`, `video.publish`.
3. Redirect URI (Login Kit, Web): `https://www.sleek-car.pl/api/panel/tiktok/callback` (musi się zgadzać z `NEXT_PUBLIC_SITE_URL`).
4. Wpisz Client key i Client secret do Netlify, zrób deploy, zaloguj się do panelu i kliknij **Połącz TikTok** (logowanie kontem TikTok firmy). Token odświeża się sam (refresh token ważny 365 dni, potem kliknij „Połącz” ponownie).
5. **Ważne:** dopóki aplikacja nie przejdzie audytu TikToka, Direct Post publikuje tylko jako prywatne („SELF_ONLY”); panel o tym ostrzega. Opcje: złożyć aplikację do audytu albo ustawić `TIKTOK_POST_MODE=inbox`, wtedy film trafia do powiadomień/szkiców w aplikacji TikTok i publikujesz go jednym kliknięciem w telefonie (scope `video.upload`, bez audytu).

## Jak to działa technicznie

- Netlify Functions przyjmują żądania do ~6 MB, więc przeglądarka wysyła plik w kawałkach po 3 MB do Netlify Blobs (magazyn `owner-panel`).
- Kolejne kroki (Prismic, Instagram, TikTok) są wywoływane przez przeglądarkę krok po kroku; żaden request nie czeka na przetwarzanie wideo. Dlatego **kartę trzeba zostawić otwartą** do końca. Nieudany kanał można ponowić przyciskiem „Ponów”.
- Po zakończeniu kawałki pliku są usuwane z Blobs.
- Lokalnie (`next dev`, poza Netlify) magazyn działa w katalogu tymczasowym systemu.

## Ograniczenia

- Plik do 100 MB (limit Prismic), MP4 lub MOV. Reels/TikTok: pion 9:16, H.264 + AAC.
- Najdłuższy krok to wgranie pliku do Prismic w jednym wywołaniu funkcji (limit czasu funkcji Netlify). Przy 100 MB mieści się z zapasem, ale bardzo duże pliki lepiej skompresować.
- „Od razu opublikuj” publikuje cały *Migration release* w Prismic, czyli także inne dokumenty, jeśli ktoś coś tam zostawił.
