import type { NextConfig } from "next";
import path from "path";

const emptyPolyfill = path.join(__dirname, "src/lib/empty-polyfill.js");

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[/\\]dist[/\\]build[/\\]polyfills[/\\]polyfill-module\.js$/,
          emptyPolyfill
        )
      );
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.prismic.io"
      }
    ]
  },
  async headers() {
    const noindex = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Referrer-Policy", value: "same-origin" },
      { key: "X-Frame-Options", value: "DENY" }
    ];
    return [
      { source: "/panel", headers: noindex },
      { source: "/panel/:path*", headers: noindex },
      { source: "/api/panel/:path*", headers: noindex }
    ];
  },
  async redirects() {
    return [
      {
        source: "/folia-ppf",
        destination: "/oferta/folia-ochronna-ppf",
        permanent: true
      },
      {
        source: "/korekta-lakieru",
        destination: "/oferta/renowacja-lakieru",
        permanent: true
      },
      {
        source: "/przyciemnianie-szyb",
        destination: "/oferta/przyciemnianie-szyb",
        permanent: true
      },
      {
        source: "/polerowanie-lamp",
        destination: "/oferta/polerowanie-lamp",
        permanent: true
      },
      {
        source: "/przyciemnianie-lamp",
        destination: "/oferta/przyciemnianie-lamp",
        permanent: true
      },
      {
        source: "/czyszczenie-wnetrza",
        destination: "/oferta/czyszczenie-wnetrza",
        permanent: true
      },
      {
        source: "/zabezpieczenie-lakieru",
        destination: "/oferta/zabezpieczenie-lakieru",
        permanent: true
      },
      {
        source: "/usuwanie-wgniecen",
        destination: "/oferta/usuwanie-wgniecen",
        permanent: true
      },
      {
        source: "/ozonowanie",
        destination: "/oferta/ozonowanie",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
