import type { Metadata, Viewport } from "next";
import { Hind, Young_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { jsonLd, site } from "@/lib/site";
import "./globals.css";

const hind = Hind({
  subsets: ["latin", "devanagari"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
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
    default: `${site.nameTitle} | Official Website`,
    template: "%s",
  },
  description:
    "Official website of Shobhaamma Charitable Foundation (Shobhamma, SCF), Patna. We support children and students who cannot afford school. Established 21 June 2024.",
  applicationName: site.nameTitle,
  keywords: [
    site.nameTitle,
    site.name,
    ...site.alsoKnownAs,
    "education charity India",
    "student support Patna",
  ],
  authors: [{ name: site.nameTitle, url: site.url }],
  creator: site.nameTitle,
  publisher: site.nameTitle,
  category: "nonprofit",
  formatDetection: { email: false, telephone: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: site.nameTitle,
    locale: "en_IN",
    url: site.url,
    title: `${site.nameTitle} | Official Website`,
    description:
      "Official website of Shobhaamma Charitable Foundation. Education support for children and students in India.",
    images: [
      {
        url: "/images/education-study.jpg",
        width: 1600,
        height: 900,
        alt: site.nameTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameTitle} | Official Website`,
    description:
      "Official website of Shobhaamma Charitable Foundation. Education support for children and students in India.",
    images: ["/images/education-study.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/hi/",
      "x-default": "/",
    },
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
