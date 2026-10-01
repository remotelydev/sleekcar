import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.prismic.io"
      }
    ]
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
