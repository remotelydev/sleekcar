import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { navItems, settings as fallbackSettings } from "@/lib/content";

type FooterProps = {
  settings?: typeof fallbackSettings;
};

export function Footer({ settings = fallbackSettings }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{settings.siteName}</p>
          <p className="muted">
            Detailing, folie PPF, korekta lakieru i zabezpieczenia ochronne w Turku.
          </p>
        </div>

        <div>
          <p className="footer-title">Menu</p>
          <div className="footer-links">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Kontakt</p>
          <div className="contact-list">
            <a href={settings.phoneHref}>
              <Phone aria-hidden="true" size={17} />
              <span className="phone-number">{settings.phoneDisplay}</span>
            </a>
            <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={17} />
              {settings.addressStreet}, {settings.city}
            </a>
            <span>
              <Clock aria-hidden="true" size={17} />
              {settings.hours}
            </span>
          </div>
        </div>

        <div>
          <p className="footer-title">Social media</p>
          <div className="footer-links">
            <a href={settings.social.facebook}>Facebook</a>
            <a href={settings.social.instagram}>Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {settings.shortName}. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}
