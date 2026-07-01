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
};

export type Post = {
  title: string;
  slug: string;
  category: "Poradniki" | "Vlog" | "Aktualnosci";
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  coverImage: ImageAsset;
  body: string[];
};

export const asset = (path: string) => encodeURI(`/assets/${path}`);

export const settings = {
  siteName: "Sleek Car Autokosmetyka",
  shortName: "Sleek Car",
  siteUrl: "https://sleekcar.pl",
  defaultOgImage: asset("oferta-na-glowna-900x400-k80mlh6a.jpg"),
  phoneDisplay: "665 111 550",
  phoneHref: "tel:+48665111550",
  emailDisplay: "kontakt@sleekcar.pl",
  addressStreet: "ul. Milewskiego 9",
  addressHint: "za budynkiem Inter Cars",
  postalCode: "62-700",
  city: "Turek",
  hours: "Pn - Pt: 9.00 - 17.00",
  mapEmbedUrl:
    "https://www.google.com/maps?q=ul.%20Milewskiego%209%2C%2062-700%20Turek&output=embed",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=ul.%20Milewskiego%209%2C%2062-700%20Turek",
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

export const certifications = [
  {
    name: "Titan",
    url: "https://www.titan-coatings.pl/detailerzy/",
    label: "Powłoki ochronne"
  },
  {
    name: "ArtDeShine",
    url: "http://www.artdeshine.pl/partnerzy/",
    label: "Powłoki ochronne"
  },
  {
    name: "Tevo",
    url: "https://www.tevocreations.com.pl/partnerzy/wielkopolskie",
    label: "Powłoki ochronne"
  },
  {
    name: "Clif Design",
    url: "#",
    label: "Folie ochronne PPF"
  },
  {
    name: "STEK Poland",
    url: "#",
    label: "Folie ochronne PPF"
  }
];

export const featuredServiceSlugs = [
  "folia-ochronna-ppf",
  "zabezpieczenie-lakieru",
  "renowacja-lakieru",
  "usuwanie-wgniecen"
];

export const services: Service[] = [
  {
    title: "Folia ochronna PPF",
    slug: "folia-ochronna-ppf",
    eyebrow: "Najwyższa ochrona lakieru",
    summary:
      "Bezbarwna folia ochronna zabezpiecza lakier przed odpryskami, zarysowaniami i codzienną eksploatacją.",
    metaDescription:
      "Folia ochronna PPF Turek. Zabezpieczenie lakieru topowymi foliami Clif Designs i STEK Poland z samoregeneracja oraz wysoką hydrofobowością.",
    heroImage: {
      src: asset("oferta-na-glowna-900x400-k80mlh6a.jpg"),
      alt: "Aplikacja folii ochronnej PPF na lampę samochodu"
    },
    cardImage: {
      src: asset("zabezpieczenie lakieru/ppf-375x250-k7t2uo9f.jpg"),
      alt: "Folia PPF na lakierze samochodu"
    },
    lead:
      "PPF to najlepszy wybór dla kierowców, którzy chcą realnie chronić lakier auta. Warstwa folii przyjmuje na siebie uderzenia kamieni, drobne zarysowania i ślady codziennej eksploatacji, a przy tym pozostaje praktycznie niewidoczna.",
    benefits: [
      "Ochrona przed odpryskami, otarciami i zarysowaniami",
      "Grubość około 200 mikronów",
      "Samoregeneracja drobnych rys pod wpływem temperatury",
      "Wysoka hydrofobowość i łatwiejsze mycie auta",
      "Odporność na promieniowanie UV i silną chemię",
      "Gwarancja producenta do 10 lat"
    ],
    process: [
      "Oględziny auta i dobór zakresu zabezpieczenia.",
      "Dokładne mycie, dekontaminacja i przygotowanie lakieru.",
      "Aplikacja folii na wybrane elementy albo cały samochód.",
      "Kontrola krawędzi, wykończenia i instrukcja pielęgnacji."
    ],
    pricing: [
      {
        label: "Pakiety PPF",
        value: "wycena indywidualna",
        note: "Cena zależy od modelu auta i zakresu zabezpieczenia."
      }
    ],
    faqs: [
      {
        question: "Kiedy najlepiej założyć folię PPF?",
        answer:
          "Najlepiej zaraz po zakupie auta, zanim na lakierze pojawią się pierwsze odpryski i wypiaskowania."
      },
      {
        question: "Czy folia PPF jest widoczna?",
        answer:
          "Przy poprawnej aplikacji folia jest bardzo dyskretna. Chroni lakier, ale nie zmienia charakteru auta."
      }
    ]
  },
  {
    title: "Zabezpieczenie lakieru",
    slug: "zabezpieczenie-lakieru",
    eyebrow: "PPF, powłoki, wosk",
    summary:
      "Dobieramy ochronę lakieru do sposobu użytkowania auta: od wosku, przez powłoki, aż po folię PPF.",
    metaDescription:
      "Zabezpieczenie lakieru Turek. Folia PPF, powłoki grafenowe, elastomerowe i woski dobrane do auta oraz sposobu użytkowania.",
    heroImage: {
      src: asset("zabezpieczenie lakieru/ceramika-375x250-k7wabnfs.jpg"),
      alt: "Zabezpieczony lakier samochodowy z efektem hydrofobowym"
    },
    cardImage: {
      src: asset("zabezpieczenie lakieru/grafen-375x250-k7waenwg.jpg"),
      alt: "Powłoka ochronna na lakierze auta"
    },
    lead:
      "Lakier codziennie pracuje w trudnych warunkach: sól, chemia drogowa, promieniowanie UV, owady, pył i częste mycie stopniowo odbierają mu głębię. Dobre zabezpieczenie spowalnia ten proces i ułatwia utrzymanie auta w czystości.",
    benefits: [
      "Mniejsze przywieranie brudu i łatwiejsze osuszanie",
      "Ochrona przed promieniowaniem UV",
      "Większa szklistość i głębia koloru",
      "Odporność na chemię w zależności od wybranej technologii",
      "Możliwość połączenia powłoki z folią PPF na newralgicznych elementach"
    ],
    process: [
      "Oceniamy stan lakieru i sposób użytkowania auta.",
      "Rekomendujemy PPF, powłokę grafenową, powłokę elastomerową albo wosk.",
      "Przygotowujemy lakier przez mycie, dekontaminację i ewentualną korektę.",
      "Nakładamy zabezpieczenie i przekazujemy zalecenia pielęgnacyjne."
    ],
    pricing: [
      {
        label: "Powłoki i woski",
        value: "wycena po oględzinach",
        note: "Zakres zależy od wielkości auta i stanu lakieru."
      }
    ],
    faqs: [
      {
        question: "Folia PPF czy powłoka ochronna?",
        answer:
          "PPF daje najwyższą ochronę mechaniczną. Powłoka lepiej sprawdza się jako ochrona hydrofobowa i wizualna dla całego auta."
      },
      {
        question: "Czy trzeba wcześniej robić korektę lakieru?",
        answer:
          "Przy wielu autach warto ją wykonać, bo zabezpieczenie utrwala aktualny stan lakieru."
      }
    ]
  },
  {
    title: "Renowacja lakieru",
    slug: "renowacja-lakieru",
    eyebrow: "Korekta i odzyskanie blasku",
    summary:
      "Jedno-, dwu- i wieloetapowa korekta lakieru usuwa zmatowienia, mikrorysy oraz ślady po nieprawidłowym myciu.",
    metaDescription:
      "Renowacja i korekta lakieru Turek. One step, dwuetapowa korekta i pełna korekta lakieru z zabezpieczeniem po usłudze.",
    heroImage: {
      src: asset("korekta lakieru/72-dpi-kit9ibfa.jpg"),
      alt: "Korekta lakieru samochodowego w studiu detailingowym"
    },
    cardImage: {
      src: asset("korekta lakieru/375x250-k7xp1mnp.jpg"),
      alt: "Polerowanie lakieru samochodu"
    },
    lead:
      "Zmatowienie lakieru, hologramy i zarysowania powstają naturalnie podczas użytkowania auta. Renowacja pozwala odwrócić ten proces i przywrócić lakierowi głębię, połysk oraz czystsze odbicie światła.",
    benefits: [
      "Usunięcie drobnych rys i zmatowień",
      "Poprawa głębi koloru oraz szklistości",
      "Możliwość usunięcia większości defektów lakieru",
      "Lepszy efekt wizualny przed sprzedażą auta",
      "Idealne przygotowanie pod powłokę albo folię PPF"
    ],
    process: [
      "Mycie detailingowe i dekontaminacja lakieru.",
      "Pomiar lakieru oraz ocena skali zarysowań.",
      "Dobór past, padów i liczby etapów polerowania.",
      "Finalne odtłuszczenie i zabezpieczenie lakieru."
    ],
    pricing: [
      { label: "Renowacja I Step", value: "od 700 zł", note: "1-2 dni" },
      { label: "Renowacja II Step", value: "od 1400 zł", note: "2-3 dni" },
      { label: "Pełna korekta", value: "wycena indywidualna", note: "3-4 dni" }
    ],
    faqs: [
      {
        question: "Czy korekta usuwa wszystkie rysy?",
        answer:
          "Zakres zależy od głębokości defektów i grubości lakieru. Przy pełnej korekcie można usunąć zdecydowaną większość widocznych zarysowań."
      },
      {
        question: "Jak zabezpieczyć lakier po korekcie?",
        answer:
          "Najczęściej polecamy powłokę ochronną albo folię PPF na elementy najbardziej narażone na uszkodzenia."
      }
    ]
  },
  {
    title: "Przyciemnianie szyb",
    slug: "przyciemnianie-szyb",
    eyebrow: "Komfort i prywatność",
    summary:
      "Przyciemnianie szyb poprawia wygląd auta, ogranicza nagrzewanie wnętrza i zwiększa prywatność pasażerów.",
    metaDescription:
      "Przyciemnianie szyb Turek. Estetyczne folie samochodowe, kilka stopni przyciemnienia i profesjonalna aplikacja.",
    heroImage: {
      src: asset("przyciemnianie szyb/79858927_1011185409231868_5629151508718157824_o-k82x8kbs.jpg"),
      alt: "Auto po przyciemnieniu szyb"
    },
    cardImage: {
      src: asset("przyciemnianie szyb/250x167-k82x2snu.jpg"),
      alt: "Przyciemniona szyba samochodu"
    },
    lead:
      "Folie do szyb poprawiają estetykę auta, dają więcej prywatności i ograniczają nagrzewanie wnętrza w słoneczne dni. Dobieramy stopień przyciemnienia tak, aby efekt pasował do auta i oczekiwań właściciela.",
    benefits: [
      "Lepszy wygląd auta",
      "Ograniczenie nagrzewania wnętrza",
      "Ochrona przed promieniowaniem UV",
      "Większa prywatność pasażerów",
      "Aż 7 stopni przyciemnienia do wyboru"
    ],
    process: [
      "Dobór stopnia przyciemnienia.",
      "Dokładne oczyszczenie szyb.",
      "Aplikacja folii i docinanie do kształtu szyby.",
      "Kontrola efektu oraz przekazanie zaleceń po aplikacji."
    ],
    pricing: [{ label: "Przyciemnianie szyb", value: "od 300 zł" }],
    faqs: [
      {
        question: "Czy można przyciemnić przednie szyby?",
        answer:
          "Zakres przyciemnienia musi być zgodny z przepisami. Przed usługą dobieramy wariant bezpieczny dla użytkowania auta."
      }
    ]
  },
  {
    title: "Czyszczenie wnętrza",
    slug: "czyszczenie-wnetrza",
    eyebrow: "Detailing kabiny",
    summary:
      "Kompleksowe czyszczenie wnętrza w pakiecie standard lub premium, z bezpiecznymi środkami do materiałów auta.",
    metaDescription:
      "Czyszczenie wnętrza auta Turek. Detailing wnętrza, pranie tapicerki, pielęgnacja skór i bezpieczne suszenie pojazdu.",
    heroImage: {
      src: asset("wnetrze/wnetrze-375x250-k7xoulnf.jpg"),
      alt: "Czyste wnętrze samochodu po detailingu"
    },
    cardImage: {
      src: asset("wnetrze/wnetrza-250x167-k7xow3k6.jpg"),
      alt: "Detailing wnętrza auta"
    },
    lead:
      "Czyste wnętrze to większy komfort jazdy i zdrowsze warunki dla kierowcy oraz pasażerów. Pracujemy dokładnie, ale bezpiecznie dla plastików, skór, materiałów i elementów wykończenia.",
    benefits: [
      "Pakiet standard dla aut lekko i średnio zabrudzonych",
      "Pakiet premium dla pełnego detailingu wnętrza",
      "Bezpieczne środki do tworzyw, tkanin i skóry",
      "Auto oddawane suche i gotowe do użytkowania",
      "Lepszy komfort codziennej jazdy"
    ],
    process: [
      "Ocena zabrudzenia wnętrza i dobór pakietu.",
      "Odkurzanie, czyszczenie detali i elementów roboczych.",
      "Pranie lub czyszczenie tapicerki według potrzeb.",
      "Suszenie oraz finalna kontrola wnętrza."
    ],
    pricing: [
      {
        label: "Pakiet standard / premium",
        value: "wycena indywidualna",
        note: "Cena zależy od wielkości auta i zabrudzenia."
      }
    ],
    faqs: [
      {
        question: "Czy auto jest mokre po praniu tapicerki?",
        answer:
          "Auto oddajemy wysuszone, aby można było od razu z niego korzystać niezależnie od pory roku."
      }
    ]
  },
  {
    title: "Przyciemnianie lamp",
    slug: "przyciemnianie-lamp",
    eyebrow: "Personalizacja i ochrona",
    summary:
      "Dedykowana folia PPF na lampy pozwala zmienić wygląd auta i zabezpieczyć reflektory przed uszkodzeniami.",
    metaDescription:
      "Przyciemnianie lamp Turek. Folia PPF na reflektory, ochrona przed zarysowaniami, kamieniami i promieniowaniem UV.",
    heroImage: {
      src: asset("przyciemnianie lamp/375x250-k7xs1cgd.jpg"),
      alt: "Przyciemnione lampy samochodowe"
    },
    cardImage: {
      src: asset("przyciemnianie lamp/250x167-k7xrsq7p.jpg"),
      alt: "Folia PPF na lampie samochodu"
    },
    lead:
      "Przyciemnianie lamp folią PPF to sposób na subtelną personalizację auta przy jednoczesnym zabezpieczeniu reflektorów. Folia chroni przed drobnymi uszkodzeniami i ułatwia utrzymanie lamp w czystości.",
    benefits: [
      "Ochrona przed zarysowaniami i drobnymi odpryskami",
      "Samoregeneracja pod wpływem ciepła",
      "Warstwa hydrofobowa ułatwiająca mycie",
      "Ochrona przed promieniowaniem UV",
      "Możliwość dopasowania efektu do stylistyki auta"
    ],
    process: [
      "Dobieramy wariant folii do reflektorów.",
      "Czyścimy i odtłuszczamy powierzchnię lamp.",
      "Aplikujemy folię PPF i dopracowujemy krawędzie.",
      "Sprawdzamy efekt wizualny i jakość wykończenia."
    ],
    pricing: [
      {
        label: "Przyciemnianie lamp",
        value: "wycena indywidualna",
        note: "Cena zależy od modelu auta i kształtu lamp."
      }
    ],
    faqs: [
      {
        question: "Czy folia chroni lampy?",
        answer:
          "Tak. Folia PPF ogranicza ryzyko zarysowań i uszkodzeń od drobnych kamieni."
      }
    ]
  },
  {
    title: "Usuwanie wgnieceń",
    slug: "usuwanie-wgniecen",
    eyebrow: "Metoda PDR",
    summary:
      "Bezinwazyjne usuwanie wgnieceń bez lakierowania, jeśli uszkodzenie pozwala na naprawę metodą PDR.",
    metaDescription:
      "Usuwanie wgnieceń Turek metodą PDR. Naprawa blacharska bez lakierowania po wcześniejszych oględzinach uszkodzenia.",
    heroImage: {
      src: asset("usuwanie egniecen/wgniecenia-930x400-kb0qdhbt.jpg"),
      alt: "Usuwanie wgnieceń metodą PDR"
    },
    cardImage: {
      src: asset("usuwanie egniecen/wgniecenia-400-kb0pxw57.jpg"),
      alt: "Wgniecenie karoserii przed naprawą"
    },
    lead:
      "PDR to metoda prostowania blachy bez ponownego lakierowania. Sprawdza się szczególnie przy wgnieceniach parkingowych, gradobiciu i uszkodzeniach, przy których lakier nie został przerwany.",
    benefits: [
      "Naprawa bez lakierowania",
      "Zachowanie oryginalnej powłoki lakierniczej",
      "Dobra opcja przy wgnieceniach parkingowych",
      "Wycena po oględzinach konkretnego uszkodzenia"
    ],
    process: [
      "Oglądamy uszkodzenie i oceniamy dostęp do elementu.",
      "Dobieramy technikę PDR do miejsca oraz wielkości wgniecenia.",
      "Prostujemy blachę bez naruszania lakieru.",
      "Kontrolujemy odbicie światła na naprawianym elemencie."
    ],
    pricing: [
      {
        label: "Usuwanie wgnieceń",
        value: "wycena indywidualna",
        note: "Po wcześniejszych oględzinach uszkodzenia."
      }
    ],
    faqs: [
      {
        question: "Czy każde wgniecenie da się usunąć bez lakierowania?",
        answer:
          "Nie zawsze. Decyduje głębokość uszkodzenia, stan lakieru i dostęp do elementu."
      }
    ]
  },
  {
    title: "Polerowanie lamp",
    slug: "polerowanie-lamp",
    eyebrow: "Lepsze światło i wygląd",
    summary:
      "Regeneracja zmatowiałych reflektorów poprawia estetykę auta i jakość oświetlenia drogi.",
    metaDescription:
      "Polerowanie lamp Turek. Regeneracja zmatowiałych reflektorów, poprawa wyglądu i zabezpieczenie kloszy po polerowaniu.",
    heroImage: {
      src: asset("polerowanie lamp/lampa-po-375x250-k7xtsox8.jpg"),
      alt: "Reflektor po polerowaniu"
    },
    cardImage: {
      src: asset("polerowanie lamp/lampa-przed-375x250-k7xtspwd.jpg"),
      alt: "Reflektor przed polerowaniem"
    },
    lead:
      "Zmatowiałe i pożółkłe klosze rozpraszają światło, pogarszają widoczność i odbierają autu świeży wygląd. Regeneracja usuwa zdegradowaną warstwę i zabezpiecza lampy przed szybkim powrotem problemu.",
    benefits: [
      "Poprawa skuteczności oświetlenia",
      "Lepszy wygląd przedniego pasa auta",
      "Usunięcie zżółkniętej i zmatowiałej warstwy",
      "Warstwa ochronna po polerowaniu",
      "Niższy koszt niż wymiana reflektorów"
    ],
    process: [
      "Oceniamy stan kloszy.",
      "Usuwamy zdegradowaną warstwę lampy.",
      "Polerujemy powierzchnię do przejrzystości.",
      "Zabezpieczamy klosz przed ponowną degradacją."
    ],
    pricing: [{ label: "Polerowanie lamp", value: "od 100 zł / komplet" }],
    faqs: [
      {
        question: "Czy lampy po polerowaniu trzeba zabezpieczyć?",
        answer:
          "Tak. Warstwa ochronna spowalnia ponowne matowienie i pomaga utrzymać efekt na dłużej."
      }
    ]
  },
  {
    title: "Usuwanie zarysowań",
    slug: "usuwanie-zarysowan",
    eyebrow: "Naprawa bez lakierowania",
    summary:
      "Usuwamy otarcia, rysy i drobne odpryski bez ponownego lakierowania elementu, jeśli pozwala na to uszkodzenie.",
    metaDescription:
      "Usuwanie zarysowań Turek. Naprawa rys, otarć i odprysków lakieru bez lakierowania po oględzinach uszkodzenia.",
    heroImage: {
      src: asset("usuwanie zarysowan/523x262-k8mxyx35.jpg"),
      alt: "Usuwanie zarysowań lakieru samochodu"
    },
    cardImage: {
      src: asset("usuwanie zarysowan/250x167-k8mzi95n.jpg"),
      alt: "Zarysowany lakier przed naprawą"
    },
    lead:
      "Nie każde uszkodzenie lakieru musi kończyć się lakierowaniem elementu. Przy wielu rysach, otarciach i punktowych defektach można zastosować mniej inwazyjną naprawę, która poprawia wygląd auta i chroni jego wartość.",
    benefits: [
      "Mniej inwazyjna alternatywa dla lakierowania",
      "Poprawa wyglądu pojedynczych elementów",
      "Możliwość naprawy otarć parkingowych",
      "Wycena po sprawdzeniu głębokości uszkodzenia"
    ],
    process: [
      "Oglądamy uszkodzenie i sprawdzamy jego głębokość.",
      "Dobieramy metodę naprawy do typu rysy.",
      "Usuwamy albo maskujemy defekt bez ponownego lakierowania.",
      "Zabezpieczamy miejsce naprawy."
    ],
    pricing: [
      {
        label: "Usuwanie zarysowań",
        value: "wycena indywidualna",
        note: "Po wcześniejszych oględzinach uszkodzenia."
      }
    ],
    faqs: [
      {
        question: "Czy głęboką rysę da się usunąć w całości?",
        answer:
          "To zależy od tego, czy uszkodzenie przeszło przez warstwę lakieru. Oceniamy to podczas oględzin."
      }
    ]
  },
  {
    title: "Bezpieczne mycie pojazdu",
    slug: "bezpieczne-mycie-pojazdu",
    eyebrow: "Mycie detailingowe",
    summary:
      "Dokładne mycie karoserii, szyb, felg, nadkoli i wnęk z kosmetykami dobranymi do powierzchni auta.",
    metaDescription:
      "Bezpieczne mycie auta Turek. Mycie detailingowe bez mikrorys, delikatne osuszanie i pielęgnacja karoserii.",
    heroImage: {
      src: asset("bezpieczne mycie/250x167-k8n1dx5r.jpg"),
      alt: "Bezpieczne mycie detailingowe samochodu"
    },
    cardImage: {
      src: asset("bezpieczne mycie/250x167-k8n1dx5r.jpg"),
      alt: "Mycie karoserii samochodowej"
    },
    lead:
      "Bezpieczne mycie detailingowe to nie tylko usunięcie brudu. To proces, w którym ograniczamy ryzyko mikrorys i dobieramy kosmetyki do lakieru, felg, szyb oraz zabezpieczeń na aucie.",
    benefits: [
      "Mniejsze ryzyko mikrorys",
      "Dokładne czyszczenie karoserii, felg, szyb i wnęk",
      "Delikatne osuszanie mikrofibrami",
      "Dobre przygotowanie auta do dalszych usług",
      "Regularna pielęgnacja zabezpieczonego lakieru"
    ],
    process: [
      "Pre-wash i bezpieczne usunięcie luźnych zabrudzeń.",
      "Mycie właściwe z dobranymi kosmetykami.",
      "Czyszczenie detali, felg, wnęk i szyb.",
      "Osuszanie delikatnymi ręcznikami z mikrofibry."
    ],
    pricing: [{ label: "Bezpieczne mycie pojazdu", value: "od 150 zł" }],
    faqs: [
      {
        question: "Czy mycie detailingowe ma sens przy zabezpieczonym aucie?",
        answer:
          "Tak. Regularne, bezpieczne mycie pomaga utrzymać powłokę albo folię w dobrej kondycji."
      }
    ]
  },
  {
    title: "Przygotowanie pojazdu do sprzedaży",
    slug: "przygotowanie-pojazdu-do-sprzedazy",
    eyebrow: "Lepsza prezentacja auta",
    summary:
      "Detailing przed sprzedażą podnosi atrakcyjność auta, a opcjonalne zdjęcia pomagają wyróżnić ogłoszenie.",
    metaDescription:
      "Przygotowanie auta do sprzedaży Turek. Detailing, poprawa wyglądu auta i profesjonalne zdjęcia do ogłoszenia.",
    heroImage: {
      src: asset("przygotowanie autoa do sprzedazy/250x167-k9uboszg.jpg"),
      alt: "Auto przygotowane do sprzedaży"
    },
    cardImage: {
      src: asset("przygotowanie autoa do sprzedazy/250x167-k9uboszg.jpg"),
      alt: "Detailing auta przed sprzedażą"
    },
    lead:
      "Dobrze przygotowany samochód lepiej wygląda na żywo i na zdjęciach, dzięki czemu łatwiej wyróżnić ogłoszenie. Zakres prac dobieramy do stanu auta i budżetu właściciela.",
    benefits: [
      "Lepszy wygląd auta w ogłoszeniu",
      "Możliwość połączenia mycia, wnętrza i korekty punktowej",
      "Wyższa konkurencyjność oferty sprzedażowej",
      "Opcjonalne profesjonalne zdjęcia pojazdu"
    ],
    process: [
      "Ustalamy cel i budżet przygotowania.",
      "Dobieramy prace zewnętrzne i wewnętrzne.",
      "Przygotowujemy auto do oględzin i zdjęć.",
      "Opcjonalnie wykonujemy zdjęcia do ogłoszenia."
    ],
    pricing: [
      {
        label: "Przygotowanie do sprzedaży",
        value: "wycena indywidualna",
        note: "Cena zależy od zakresu i stanu auta."
      }
    ],
    faqs: [
      {
        question: "Czy warto robić detailing przed sprzedażą auta?",
        answer:
          "Tak, szczególnie gdy auto ma dobry stan techniczny, ale wymaga odświeżenia wizualnego."
      }
    ]
  },
  {
    title: "Door to door",
    slug: "door-to-door",
    eyebrow: "Odbiór i odstawienie auta",
    summary:
      "Odbieramy samochód we wskazanym miejscu i odprowadzamy go po wykonanej usłudze.",
    metaDescription:
      "Usługa door to door Turek. Odbiór i odstawienie auta po usłudze detailingowej na terenie miasta.",
    heroImage: {
      src: asset("zdjecie-do-realizacji-k82tehpn.jpg"),
      alt: "Auto przygotowane do odbioru po usłudze detailingowej"
    },
    cardImage: {
      src: asset("toyota--27-k82tedeh.jpg"),
      alt: "Samochód po detailingu"
    },
    lead:
      "Door to door jest dla osób, które chcą skorzystać z usługi, ale nie mają czasu lub możliwości przyprowadzenia auta do studia. Odbieramy pojazd i odstawiamy go po zakończeniu prac.",
    benefits: [
      "Oszczędność czasu",
      "Wygodny odbiór auta we wskazanym miejscu",
      "Odprowadzenie pojazdu po wykonanej usłudze",
      "Bezpłatnie na terenie Turku"
    ],
    process: [
      "Ustalamy miejsce i godzinę odbioru.",
      "Odbieramy pojazd oraz potwierdzamy zakres prac.",
      "Realizujemy usługę w studiu.",
      "Odprowadzamy samochód pod wskazany adres."
    ],
    pricing: [
      {
        label: "Door to door w Turku",
        value: "bezpłatnie",
        note: "Po wcześniejszym umówieniu terminu."
      }
    ],
    faqs: [
      {
        question: "Czy door to door działa poza Turkiem?",
        answer:
          "Jest to możliwe do ustalenia indywidualnie przy rezerwacji usługi."
      }
    ]
  },
  {
    title: "Wypożyczenie miernika lakieru",
    slug: "wypozyczenie-miernika-lakieru",
    eyebrow: "Przed zakupem auta",
    summary:
      "Profesjonalny miernik lakieru z sondą pomaga sprawdzić auto przed zakupem i uniknąć kosztownej pomyłki.",
    metaDescription:
      "Wypożyczenie miernika lakieru Turek. Profesjonalny miernik z sondą, 30 zł za dobę i kaucja zwrotna.",
    heroImage: {
      src: asset("wyporzyczenie miernika/slajder-900x400-kaf1l797.jpg"),
      alt: "Miernik lakieru do wypożyczenia"
    },
    cardImage: {
      src: asset("wyporzyczenie miernika/podstrona-406x271-kaf1hzqd.jpg"),
      alt: "Profesjonalny miernik lakieru z sondą"
    },
    lead:
      "Pomiar lakieru przed zakupem pomaga sprawdzić, czy auto miało naprawy blacharsko-lakiernicze. Miernik z sondą ułatwia dotarcie do miejsc, które trudno sprawdzić prostszym urządzeniem.",
    benefits: [
      "Pomoc przy oględzinach auta przed zakupem",
      "Sonda na przewodzie do trudno dostępnych miejsc",
      "Możliwość pomiaru elementów konstrukcyjnych",
      "Prosty koszt dobowego wypożyczenia"
    ],
    process: [
      "Rezerwujesz miernik na wybrany termin.",
      "Odbierasz urządzenie i wpłacasz kaucję zwrotną.",
      "Sprawdzasz auto przed zakupem.",
      "Zwracasz miernik po zakończeniu wypożyczenia."
    ],
    pricing: [
      { label: "Wypożyczenie", value: "30 zł / doba" },
      { label: "Kaucja zwrotna", value: "250 zł" }
    ],
    faqs: [
      {
        question: "Czy miernik nadaje się do sprawdzenia trudno dostępnych miejsc?",
        answer:
          "Tak. Sonda na przewodzie pomaga dotrzeć między innymi do podłużnic i fartuchów wewnętrznych."
      }
    ]
  },
  {
    title: "Ozonowanie",
    slug: "ozonowanie",
    eyebrow: "Dezynfekcja kabiny",
    summary:
      "Ozonowanie pomaga oczyścić kabinę i kanały wentylacyjne z nieprzyjemnych zapachów oraz drobnoustrojów.",
    metaDescription:
      "Ozonowanie auta Turek. Dezynfekcja kabiny i układu wentylacji przy użyciu generatora ozonu.",
    heroImage: {
      src: asset("ozonowanie/ozonowanie-slajder-kaf173fa.jpg"),
      alt: "Ozonowanie wnętrza samochodu"
    },
    cardImage: {
      src: asset("ozonowanie/ozonowanie-250x167-oferta-kaf0v7e8.jpg"),
      alt: "Generator ozonu w samochodzie"
    },
    lead:
      "Ozonowanie to proces dezynfekcji kabiny i kanałów wentylacyjnych z wykorzystaniem generatora ozonu. Sprawdza się przy odświeżeniu wnętrza oraz ograniczaniu nieprzyjemnych zapachów.",
    benefits: [
      "Odświeżenie wnętrza auta",
      "Wsparcie w dezynfekcji kabiny i wentylacji",
      "Krótki czas realizacji",
      "Możliwość połączenia z czyszczeniem wnętrza"
    ],
    process: [
      "Przygotowujemy auto do sesji ozonowania.",
      "Ustawiamy generator i obieg powietrza.",
      "Przeprowadzamy 20-minutową sesję.",
      "Wietrzymy wnętrze po zakończeniu procesu."
    ],
    pricing: [{ label: "Sesja 20 minut", value: "30 zł" }],
    faqs: [
      {
        question: "Czy ozonowanie zastępuje czyszczenie wnętrza?",
        answer:
          "Nie. Najlepszy efekt daje połączenie ozonowania z fizycznym czyszczeniem kabiny."
      }
    ]
  }
];

export const realizations: Realization[] = [
  {
    title: "BMW M3 Touring w stylizacji CSL",
    slug: "bmw-m3-touring-ppf",
    vehicle: "BMW M3 Touring",
    service: "Folia PPF i stylizacja",
    summary:
      "Lakier z palety Individual został zabezpieczony folią PPF, a całość uzupełniła stylizacja inspirowana CSL.",
    body: [
      "Ten egzemplarz BMW M3 Touring otrzymał zabezpieczenie folią ochronną PPF na kluczowych elementach oraz dodatkową stylizację folią wrappingową.",
      "Projekt dobrze pokazuje kierunek pracy studia: ochrona lakieru ma być praktyczna, ale finalnie auto musi wyglądać tak, jakby każdy detal był zaplanowany."
    ],
    coverImage: {
      src: asset("m3/M3-9-of-12-lbfchu4f.jpg"),
      alt: "BMW M3 Touring w studiu detailingowym"
    },
    gallery: [
      { src: asset("m3/M3-1-of-12-lbfchia6.jpg"), alt: "BMW M3 przedni bok" },
      { src: asset("m3/M3-5-of-12-lbfchnwo.jpg"), alt: "BMW M3 detal lakieru" },
      { src: asset("m3/M3-11-of-12-lbfchvmu.jpg"), alt: "BMW M3 po zabezpieczeniu" }
    ]
  },
  {
    title: "Porsche 911 Turbo S pod ochroną PPF",
    slug: "porsche-911-turbo-s-ppf",
    vehicle: "Porsche 911 Turbo S",
    service: "Folia ochronna PPF",
    summary:
      "Sportowe Porsche zabezpieczone folią PPF na elementach najbardziej narażonych na odpryski.",
    body: [
      "Przy autach sportowych folia PPF pracuje każdego dnia: na zderzaku, masce, lusterkach i progach przejmuje na siebie uszkodzenia od kamieni oraz brudu drogowego.",
      "Zakres zabezpieczenia dobieramy do sposobu użytkowania samochodu, dlatego projekt można przygotować zarówno pod jazdę codzienną, jak i weekendowe trasy."
    ],
    coverImage: {
      src: asset("911 turbo s/1_12-l10ntpjp.jpg"),
      alt: "Porsche 911 Turbo S w czerwonym lakierze"
    },
    gallery: [
      { src: asset("911 turbo s/1_21-l10nts5q.jpg"), alt: "Porsche 911 Turbo S bok auta" },
      { src: asset("911 turbo s/1_40-l10ntz06.jpg"), alt: "Porsche 911 Turbo S po detailingu" },
      { src: asset("911 turbo s/1_55-l10nu61y.jpg"), alt: "Detal lakieru Porsche 911 Turbo S" }
    ]
  },
  {
    title: "Lamborghini z odświeżonym wnętrzem",
    slug: "lamborghini-detailing-wnetrza",
    vehicle: "Lamborghini",
    service: "Czyszczenie wnętrza",
    summary:
      "Wnętrze supersamochodu zostało dokładnie wyczyszczone i przygotowane z dbałością o delikatne materiały.",
    body: [
      "W autach klasy premium praca przy wnętrzu wymaga ostrożności i dobrego doboru chemii. Skóra, przeszycia, ekrany i elementy piano black muszą zostać wyczyszczone bez agresywnego tarcia.",
      "Efektem jest kabina, która wygląda świeżo, ale nie traci naturalnego charakteru materiałów."
    ],
    coverImage: {
      src: asset("lambo/17-l10o0u3t.jpg"),
      alt: "Wnętrze Lamborghini po detailingu"
    },
    gallery: [
      { src: asset("lambo/1-l10o07zj.jpg"), alt: "Lamborghini w studiu" },
      { src: asset("lambo/7-l10o0frz.jpg"), alt: "Detal wnętrza Lamborghini" },
      { src: asset("lambo/14-l10o0ptc.jpg"), alt: "Lamborghini po czyszczeniu" }
    ]
  },
  {
    title: "Audi RS6 po korekcie i zabezpieczeniu",
    slug: "audi-rs6-korekta-lakieru",
    vehicle: "Audi RS6",
    service: "Korekta lakieru",
    summary:
      "Lakier został odświeżony, a finalny efekt podbity odpowiednio dobranym zabezpieczeniem.",
    body: [
      "Przy dużych, mocnych autach ciemny lakier szybko pokazuje mikrorysy po myciu. Korekta pozwala odzyskać głębię i czystsze odbicie światła.",
      "Po odświeżeniu lakier warto zabezpieczyć, aby efekt był łatwiejszy do utrzymania w codziennej eksploatacji."
    ],
    coverImage: {
      src: asset("rs6/1_20-l10nhjdt.jpg"),
      alt: "Audi RS6 po korekcie lakieru"
    },
    gallery: [
      { src: asset("rs6/1_9-l10nh85f.jpg"), alt: "Audi RS6 detal lakieru" },
      { src: asset("rs6/1_16-l10nhi2i.jpg"), alt: "Audi RS6 w studiu" },
      { src: asset("rs6/1_22-l10nhkum.jpg"), alt: "Audi RS6 po zabezpieczeniu" }
    ]
  },
  {
    title: "BMW X5 zabezpieczone folią PPF",
    slug: "bmw-x5-ppf",
    vehicle: "BMW X5",
    service: "Folia PPF",
    summary:
      "Duży SUV otrzymał ochronę newralgicznych elementów, które najczęściej łapią odpryski w trasie.",
    body: [
      "SUV użytkowany rodzinnie i trasowo jest szczególnie narażony na odpryski na masce, zderzaku oraz lusterkach.",
      "Folia PPF pozwala zachować dobry stan lakieru bez zmieniania wyglądu samochodu."
    ],
    coverImage: {
      src: asset("x5 ppf/1_10-Edit-lbf3okuc.jpg"),
      alt: "BMW X5 zabezpieczone folią PPF"
    },
    gallery: [
      { src: asset("x5 ppf/1-lbf3ogl1.jpg"), alt: "BMW X5 przedni bok" },
      { src: asset("x5 ppf/1_21-lbf3on22.jpg"), alt: "BMW X5 detal folii" },
      { src: asset("x5 ppf/1_29-lbf3opcl.jpg"), alt: "BMW X5 po aplikacji PPF" }
    ]
  },
  {
    title: "Cupra Leon ST po detailingu",
    slug: "cupra-leon-st-detailing",
    vehicle: "Cupra Leon ST",
    service: "Detailing zewnętrzny",
    summary:
      "Lakier został odświeżony i przygotowany tak, aby mocny kolor auta znowu grał pierwsze skrzypce.",
    body: [
      "Kolorowe lakiery bardzo dobrze pokazują efekt detailingu, ale wymagają starannego przygotowania powierzchni.",
      "Projekt obejmował prace zewnętrzne i finalne dopracowanie detali."
    ],
    coverImage: {
      src: asset("cupra leon st/1_49-lbfc5vnj.jpg"),
      alt: "Cupra Leon ST po detailingu"
    },
    gallery: [
      { src: asset("cupra leon st/1-lbfc5f82.jpg"), alt: "Cupra Leon ST przód" },
      { src: asset("cupra leon st/1_29-lbfc5kzg.jpg"), alt: "Cupra Leon ST lakier" },
      { src: asset("cupra leon st/1_43-lbfc5sey.jpg"), alt: "Cupra Leon ST po pracach" }
    ]
  }
];

export const posts: Post[] = [
  {
    title: "Folia PPF czy powłoka ochronna - co wybrać?",
    slug: "folia-ppf-czy-powloka-ochronna",
    category: "Poradniki",
    excerpt:
      "PPF i powłoka nie są tym samym. Jedna chroni mechanicznie, druga ułatwia pielęgnację i podbija wygląd lakieru.",
    publishedAt: "2026-01-12",
    readingTime: "4 min",
    coverImage: {
      src: asset("zabezpieczenie lakieru/ppf-375c250-k7xss2vz.jpg"),
      alt: "Porównanie folii PPF i powłoki ochronnej"
    },
    body: [
      "Folia PPF jest najlepszym wyborem, gdy priorytetem jest ochrona przed odpryskami i zarysowaniami. Powłoka ochronna lepiej sprawdza się jako zabezpieczenie wizualne i hydrofobowe.",
      "W praktyce często warto połączyć obie technologie: PPF na najbardziej narażone elementy, a powłokę na resztę auta."
    ]
  },
  {
    title: "Jak przygotować nowe auto do pierwszych kilometrów?",
    slug: "jak-przygotowac-nowe-auto-do-pierwszych-kilometrow",
    category: "Poradniki",
    excerpt:
      "Nowe lakiery są cienkie i miękkie, dlatego pierwsze zabezpieczenie warto zaplanować jeszcze przed intensywną eksploatacją.",
    publishedAt: "2026-01-28",
    readingTime: "3 min",
    coverImage: {
      src: asset("BMW-7-PPF-6-kzea3k65.jpg"),
      alt: "Nowe auto zabezpieczane folią PPF"
    },
    body: [
      "Najlepszy moment na zabezpieczenie lakieru to czas tuż po odbiorze auta. Wtedy powierzchnia nie ma jeszcze odprysków, które później mogłyby zostać widoczne pod folią.",
      "Minimum to bezpieczne mycie, dekontaminacja i dobór zabezpieczenia. Przy autach premium warto rozważyć pakiet PPF na przód pojazdu."
    ]
  },
  {
    title: "Vlog: kulisy aplikacji folii PPF",
    slug: "vlog-kulisy-aplikacji-folii-ppf",
    category: "Vlog",
    excerpt:
      "Miejsce na odcinek vloga z warsztatu: przygotowanie lakieru, aplikacja folii i finalna kontrola auta.",
    publishedAt: "2026-02-04",
    readingTime: "video",
    coverImage: {
      src: asset("oferta-na-glowna-900x400-k80mlh6a.jpg"),
      alt: "Kulisy aplikacji folii PPF"
    },
    body: [
      "Ten typ wpisu można w Prismic rozbudować o osadzone video z YouTube, galerię zdjęć i krótkie podsumowanie zakresu pracy.",
      "Vlog będzie dobrym miejscem na pokazanie procesu, bo przy detailingu klienci chętnie oglądają różnicę przed i po."
    ]
  }
];

export const testimonials = [
  {
    quote:
      "Bardzo dobry kontakt, dokładne wyjaśnienie zakresu prac i świetny efekt po odbiorze auta.",
    author: "Opinia klienta z Google",
    rating: 5
  },
  {
    quote:
      "Auto wyglądało lepiej niż w dniu zakupu. Widać dużą staranność przy każdym detalu.",
    author: "Opinia klienta z Google",
    rating: 5
  },
  {
    quote:
      "Profesjonalne podejście, terminowość i konkretna pomoc w doborze zabezpieczenia lakieru.",
    author: "Opinia klienta z Google",
    rating: 5
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getRealization(slug: string) {
  return realizations.find((realization) => realization.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getFeaturedServices() {
  return featuredServiceSlugs
    .map((slug) => getService(slug))
    .filter((service): service is Service => Boolean(service));
}
