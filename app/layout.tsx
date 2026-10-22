import type { Metadata, Viewport } from "next";
import { Hind, Young_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { jsonLd, site } from "@/lib/site";
import "./globals.css";

const hind = Hind({
  subsets: ["latin", "devanagari"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const young = Young_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.nameTitle,
    template: "%s",
  },
  description:
    "Shobhaamma Charitable Foundation supports students who cannot afford to learn and elderly women who have no one to lean on. Established 21 June 2024.",
  applicationName: site.nameTitle,
  authors: [{ name: site.nameTitle, url: site.url }],
  creator: site.nameTitle,
  category: "nonprofit",
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    siteName: site.nameTitle,
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hind.variable} ${young.variable}`}
    >
      <body>
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
