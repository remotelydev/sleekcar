import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getSettings } from "@/lib/prismic-content";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Polityka prywatności",
  description:
    "Polityka prywatności Sleek Car Autokosmetyka w Turku: dane kontaktowe, formularz, mapa i prawa wynikające z RODO.",
  path: "/polityka-prywatnosci"
});

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <article>
      <section className="page-hero compact">
        <div className="page-hero-content">
          <Breadcrumbs items={[{ label: "Polityka prywatności" }]} />
          <p className="eyebrow">RODO</p>
          <h1>Polityka prywatności</h1>
          <p>
            Informacje o tym, jakie dane przetwarzamy na stronie {settings.siteName}{" "}
            i w formularzu kontaktowym.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="article-copy">
          <h2>Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest {settings.siteName},{" "}
            {settings.addressStreet}, {settings.postalCode} {settings.city}. Kontakt:{" "}
            <a href={settings.phoneHref}>{settings.phoneDisplay}</a>,{" "}
            <a href={`mailto:${settings.emailDisplay}`}>{settings.emailDisplay}</a>.
          </p>

          <h2>Jakie dane zbieramy</h2>
          <p>
            Strona służy prezentacji oferty studia detailingowego. Dane osobowe
            pojawiają się, gdy sam je podasz w formularzu kontaktowym (imię, e-mail,
            telefon, treść wiadomości) albo gdy zadzwonisz lub napiszesz na adres
            e-mail.
          </p>
          <p>
            Nie wdrażamy obecnie Google Analytics, Google Tag Manager ani pikseli
            reklamowych. Jeśli pojawią się w przyszłości, ta polityka zostanie
            zaktualizowana, a skrypty zostaną uruchomione dopiero po zgodzie wymaganej
            przepisami.
          </p>

          <h2>Formularz kontaktowy</h2>
          <p>
            Wiadomości z formularza są przesyłane przez hosting Netlify wyłącznie po
            to, żeby odpowiedzieć na zapytanie o wycenę lub usługę. Podstawą jest
            art. 6 ust. 1 lit. b i f RODO (kroki przed umową oraz prawnie uzasadniony
            interes — obsługa zapytań). Dane trzymamy przez czas potrzebny do
            odpowiedzi i ewentualnej realizacji usługi, potem je usuwamy, chyba że
            przepisy rachunkowe lub podatkowe wymagają dłuższego przechowywania.
          </p>

          <h2>Mapa i treści z zewnątrz</h2>
          <p>
            Na stronie osadzamy mapę Google Maps, żeby pokazać dojazd do studia.
            Google może przetwarzać dane techniczne (adres IP, przybliżona lokalizacja)
            według własnej polityki prywatności. Zdjęcia i treści mogą być serwowane z
            Prismic (CDN).
          </p>

          <h2>Pliki cookies</h2>
          <p>
            Do wyświetlenia oferty nie potrzebujemy cookies marketingowych. Cookies
            mogą pojawić się przy osadzonej mapie Google oraz — tylko w trybie
            podglądu redakcyjnego — przy pasku Prismic Preview. Nie używamy ich do
            profilowania klientów.
          </p>

          <h2>Twoje prawa</h2>
          <p>
            Przysługuje Ci dostęp do danych, sprostowanie, usunięcie, ograniczenie
            przetwarzania, sprzeciw oraz przeniesienie danych, a także skarga do
            Prezesa Urzędu Ochrony Danych Osobowych. Żądania kieruj na{" "}
            {settings.emailDisplay} albo telefonicznie.
          </p>

          <p>Ostatnia aktualizacja: 13 września 2026 r.</p>
        </div>
      </section>
    </article>
  );
}
