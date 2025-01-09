import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./utils/AuthContext";
import { ThemeProvider } from "./utils/theme-hook";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Head from "next/head";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frame The Beat",
  description:
    "Frame The Beat is an open-source platform for album cover art. Search here for your favorite album covers and save them.",
  keywords:
    "album covers, music art, album artwork, music database, cover art search, vinyl artwork",
  authors: [{ name: "Frame The Beat" }],
  creator: "Frame The Beat",
  publisher: "Frame The Beat",
  metadataBase: new URL("https://www.framethebeat.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Frame The Beat",
    description:
      "Frame The Beat is an open-source platform for album cover art. Search here for your favorite album covers and save them.",
    url: "https://www.framethebeat.com",
    siteName: "Frame The Beat",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "Frame The Beat Logo",
      },
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Frame The Beat Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frame The Beat",
    description:
      "Frame The Beat is an open-source platform for album cover art. Search here for your favorite album covers and save them.",
    images: ["/favicon.ico"],
    creator: "@framethebeat",
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
  verification: {
    yandex: "6a82b9bbc4f433a8",
  },
  alternates: {
    canonical: "https://www.framethebeat.com",
    languages: {
      "en-US": "https://www.framethebeat.com",
      "es-ES": "https://www.framethebeat.com",
    },
  },
  category: "Music",
};

export const viewport = {
  themeColor: "#d17e3b",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content={viewport.viewport} />
        <meta name="theme-color" content={viewport.themeColor} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        <SpeedInsights />
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
