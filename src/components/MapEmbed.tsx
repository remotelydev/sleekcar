"use client";

import { useState } from "react";
import { settings as fallbackSettings } from "@/lib/content";

type MapEmbedProps = {
  settings?: typeof fallbackSettings;
};

export function MapEmbed({ settings = fallbackSettings }: MapEmbedProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="map-frame">
      {showMap ? (
        <iframe
          title="Mapa dojazdu do Sleek Car Autokosmetyka"
          src={settings.mapEmbedUrl}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button className="map-placeholder" type="button" onClick={() => setShowMap(true)}>
          <span>Pokaż mapę dojazdu</span>
          <small>Google Maps ładuje się dopiero po kliknięciu</small>
        </button>
      )}
    </div>
  );
}
