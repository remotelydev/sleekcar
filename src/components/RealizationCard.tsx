import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Realization } from "@/lib/content";

type RealizationCardProps = {
  realization: Realization;
};

export function RealizationCard({ realization }: RealizationCardProps) {
  return (
    <article className="image-card realization-card">
      <Link href={`/realizacje/${realization.slug}`} aria-label={realization.title}>
        <div className="image-card-media">
          <Image
            src={realization.coverImage.src}
            alt={realization.coverImage.alt}
            fill
            sizes="(min-width: 980px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="image-card-body">
          <p className="eyebrow">{realization.service}</p>
          <h3>{realization.title}</h3>
          <p>{realization.summary}</p>
          <span className="text-link">
            Czytaj więcej <ArrowRight aria-hidden="true" size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}
