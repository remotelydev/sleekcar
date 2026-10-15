import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/content";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="image-card post-card">
      <Link href={`/aktualnosci/${post.slug}`} aria-label={post.title}>
        <div className="image-card-media">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            quality={60}
            sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
          />
        </div>
        <div className="image-card-body">
          <p className="eyebrow">{post.category} / {post.readingTime}</p>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <span className="text-link">
            Przeczytaj <ArrowRight aria-hidden="true" size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}
