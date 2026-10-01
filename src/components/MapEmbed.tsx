"use client";

import { useEffect, useState } from "react";
import { settings as fallbackSettings } from "@/lib/content";

type MapEmbedProps = {
  settings?: typeof fallbackSettings;
};

export function MapEmbed({ settings = fallbackSettings }: MapEmbedProps) {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setShowMap(true);
      return;
    }

    const showAfterLoad = () => setShowMap(true);
    window.addEventListener("load", showAfterLoad);
    return () => window.removeEventListener("load", showAfterLoad);
  }, []);

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
        <div className="map-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
