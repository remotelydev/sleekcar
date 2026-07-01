import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <section className="page-hero compact not-found">
      <p className="eyebrow">404</p>
      <h1>Nie znaleziono strony.</h1>
      <p>Ten adres nie prowadzi do aktywnej podstrony Sleek Car.</p>
      <div className="hero-actions">
        <ButtonLink href="/">Wróć na stronę główną</ButtonLink>
        <Link className="button button-secondary" href="/oferta">
          Oferta
        </Link>
      </div>
    </section>
  );
}
