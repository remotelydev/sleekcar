import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/content";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="image-card">
      <Link href={`/oferta/${service.slug}`}>
        <div className="image-card-media">
          <Image
            src={service.cardImage.src}
            alt={service.cardImage.alt}
            fill
            quality={60}
            sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
          />
        </div>
        <div className="image-card-body">
          <p className="eyebrow">{service.eyebrow}</p>
          <h3>{service.title}</h3>
          <p>{service.summary}</p>
          <span className="text-link">
            Zobacz szczegóły <ArrowRight aria-hidden="true" size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}
