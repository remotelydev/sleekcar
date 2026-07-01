"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { navItems, settings } from "@/lib/content";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-header${isMenuOpen ? " is-menu-open" : ""}`}>
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
          <Link href={item.href} key={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <a className="phone-cta" href={settings.phoneHref}>
          <Phone aria-hidden="true" size={18} />
          <span>{settings.phoneDisplay}</span>
        </a>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          className="menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>
    </header>
  );
}
