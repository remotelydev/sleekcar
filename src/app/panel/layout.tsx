import type { Metadata } from "next";

// The owner panel must never be indexed: meta robots here, X-Robots-Tag in next.config.ts,
// Disallow in robots.ts, and it is not listed in sitemap.ts.
export const metadata: Metadata = {
  title: "Panel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true }
  }
};

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="panel-shell">{children}</div>;
}
