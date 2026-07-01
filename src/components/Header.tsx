import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { navItems, settings } from "@/lib/content";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Sleek Car - strona główna">
        <Image
          src="/assets/LOGO-bez-tla-632x192-k7awc6bu.png"
          alt="Sleek Car Autokosmetyka"
          width={158}
          height={48}
          priority
        />
      </Link>

      <nav className="site-nav" aria-label="Główne menu">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <a className="phone-cta" href={settings.phoneHref}>
        <Phone aria-hidden="true" size={18} />
        <span>{settings.phoneDisplay}</span>
      </a>
    </header>
  );
}
