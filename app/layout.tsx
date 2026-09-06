import "./globals.css";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: new URL(site.url).host,
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-pp.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-pp-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-pp-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-pp-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-pp-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-pp-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon-pp.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

const jetbrains = LocalFont({
  src: [
    { path: "./fonts/JetBrainsMonoNerdFont-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMonoNerdFont-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[jetbrains.variable, calSans.variable].join(" ")}>
      <body className="bg-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
