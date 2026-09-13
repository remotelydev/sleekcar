import { Phone } from "lucide-react";
import { settings as fallbackSettings } from "@/lib/content";
import { ButtonLink } from "@/components/ButtonLink";

type CtaBandProps = {
  title?: string;
  text?: string;
  settings?: typeof fallbackSettings;
};

export function CtaBand({
  title = "Chcesz dobrze zabezpieczyć swoje auto?",
  text = "Najdokładniejsza wycena powstaje po rozmowie i obejrzeniu samochodu.",
  settings = fallbackSettings
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">Kontakt</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="cta-actions">
        <a className="button button-primary" href={settings.phoneHref}>
          <Phone aria-hidden="true" size={18} />
          <span className="phone-number">{settings.phoneDisplay}</span>
        </a>
        <ButtonLink href="/kontakt" variant="secondary">
          Formularz kontaktowy
        </ButtonLink>
      </div>
    </section>
  );
}
