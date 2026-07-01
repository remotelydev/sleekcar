import { settings } from "@/lib/content";

export function MapEmbed() {
  return (
    <div className="map-frame">
      <iframe
        title="Mapa dojazdu do Sleek Car Autokosmetyka"
        src={settings.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
