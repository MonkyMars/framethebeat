import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Frame The Beat is an open-source platform for album cover art. Search here for your favorite album covers and save them.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Frame The Beat",
    description: "Frame The Beat is an open-source platform for album cover art. Search here for your favorite album covers and save them.",
    url: "https://www.framethebeat.vercel.app",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
      },
    ],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}