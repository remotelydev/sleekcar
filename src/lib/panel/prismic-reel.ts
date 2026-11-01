import * as prismic from "@prismicio/client";
import { repositoryName } from "@/lib/prismic";
import { panelStore } from "./storage";
import { coverKey, readVideoRange, type ReelJob } from "./jobs";

export function isPrismicConfigured() {
  return Boolean(process.env.PRISMIC_WRITE_TOKEN);
}

const POLISH_CHARS: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z"
};

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (char) => POLISH_CHARS[char] ?? char)
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/g, "") || "rolka"
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ type: "paragraph" as const, text: line, spans: [] }));
}

function excerpt(text: string) {
  const firstLine = text.replace(/\s+/g, " ").trim();
  return firstLine.length > 160 ? `${firstLine.slice(0, 157).trimEnd()}...` : firstLine;
}

async function uniqueUid(client: prismic.Client, base: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const uid = attempt === 0 ? base : `${base}-${attempt + 1}`;
    try {
      await client.getByUID("post", uid);
    } catch (error) {
      if (error instanceof prismic.NotFoundError) {
        return uid;
      }
      throw error;
    }
  }
  return `${base}-${Date.now()}`;
}

/**
 * Uploads the video (and optional cover) to the Prismic Media Library and creates a `post`
 * document in the migration release, then publishes that release when the owner asked for it.
 */
export async function publishToPrismic(job: ReelJob) {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN;
  if (!writeToken) {
    throw new Error("Brak PRISMIC_WRITE_TOKEN.");
  }

  const writeClient = prismic.createWriteClient(repositoryName, { writeToken });
  const migration = prismic.createMigration();

  const video = await readVideoRange(job, 0, job.size);
  const videoAsset = migration.createAsset(
    new File([video], job.filename, { type: job.contentType }),
    job.filename,
    { notes: `Rolka dodana z panelu: ${job.title}` }
  );

  let coverAsset: prismic.PrismicMigrationAsset | undefined;
  if (job.cover) {
    const cover = await panelStore().getBytes(coverKey(job.id));
    if (cover) {
      coverAsset = migration.createAsset(
        new File([cover], job.cover.filename, { type: job.cover.contentType }),
        job.cover.filename,
        { alt: job.title }
      );
    }
  }

  const [repository, uid] = await Promise.all([
    writeClient.getRepository(),
    uniqueUid(writeClient, slugify(job.title))
  ]);

  const document = migration.createDocument(
    {
      type: "post",
      uid,
      lang: repository.languages[0].id,
      tags: ["rolka"],
      data: {
        title: job.title,
        category: job.category,
        excerpt: excerpt(job.description),
        cover_image: coverAsset,
        published_at: new Date().toISOString().slice(0, 10),
        reading_time: "Rolka",
        video_url: { link_type: "Media", id: videoAsset },
        body: paragraphs(job.description),
        related_services: [],
        seo_title: job.title,
        seo_description: excerpt(job.description)
      }
    },
    job.title
  );

  await writeClient.migrate(migration);

  if (job.publishPrismic) {
    await writeClient.publishMigrationRelease();
  }

  const videoUrl = videoAsset.asset?.url;
  if (!videoUrl) {
    throw new Error("Prismic nie zwrócił adresu wgranego wideo.");
  }

  return {
    documentId: document.document.id,
    uid,
    videoUrl,
    coverUrl: coverAsset?.asset?.url
  };
}
