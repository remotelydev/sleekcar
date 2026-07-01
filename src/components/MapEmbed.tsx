import { settings as fallbackSettings } from "@/lib/content";

type MapEmbedProps = {
  settings?: typeof fallbackSettings;
};

export function MapEmbed({ settings = fallbackSettings }: MapEmbedProps) {
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
