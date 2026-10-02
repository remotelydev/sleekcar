import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { navItems, settings as fallbackSettings } from "@/lib/content";

type HeaderProps = {
  settings?: typeof fallbackSettings;
};

export function Header({ settings = fallbackSettings }: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Sleek Car - strona główna">
        <Image
          src="/assets/LOGO-bez-tla-632x192-k7awc6bu.png"
          alt="Sleek Car Autokosmetyka"
          width={158}
          height={48}
          quality={60}
          sizes="8.8rem"
        />
      </Link>

      <details className="site-menu">
        <summary className="menu-toggle">
          <Menu aria-hidden="true" className="menu-icon-open" size={22} />
          <X aria-hidden="true" className="menu-icon-close" size={22} />
          <span className="menu-label menu-label-open">Otwórz menu</span>
          <span className="menu-label menu-label-close">Zamknij menu</span>
        </summary>
        <nav className="site-nav" aria-label="Główne menu">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </details>

      <div className="header-actions">
        <a className="phone-cta" href={settings.phoneHref}>
          <Phone aria-hidden="true" size={18} />
          <span className="phone-number">{settings.phoneDisplay}</span>
        </a>
      </div>
    </header>
  );
}
