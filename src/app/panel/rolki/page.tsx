import { redirect } from "next/navigation";
import { ReelUploader } from "@/components/panel/ReelUploader";
import { hasPanelSession } from "@/lib/panel/auth";
import { isInstagramConfigured } from "@/lib/panel/instagram";
import { isPrismicConfigured } from "@/lib/panel/prismic-reel";
import { isTikTokConfigured, isTikTokConnected, tiktokPostMode } from "@/lib/panel/tiktok";

export default async function PanelReelsPage() {
  if (!(await hasPanelSession())) {
    redirect("/panel/logowanie");
  }

  const tiktokConfigured = isTikTokConfigured();

  return (
    <section className="section panel-narrow">
      <p className="eyebrow">Panel właściciela</p>
      <h1>Dodaj rolkę</h1>
      <p>
        Film trafi do Aktualności na stronie (Prismic) oraz, jeśli zaznaczysz, na Instagram (Reels) i
        TikToka. Plik MP4 lub MOV, pionowy 9:16, do 100 MB.
      </p>
      <ReelUploader
        status={{
          prismic: isPrismicConfigured(),
          instagram: isInstagramConfigured(),
          tiktok: tiktokConfigured,
          tiktokConnected: tiktokConfigured && (await isTikTokConnected()),
          tiktokMode: tiktokPostMode()
        }}
      />
    </section>
  );
}
