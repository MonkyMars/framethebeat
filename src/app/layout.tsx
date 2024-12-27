import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./utils/AuthContext";
import { ThemeProvider } from "./utils/theme-hook";
import { Analytics } from "@vercel/analytics/next";

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
    url: "localhost:3000",
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
            <Analytics/>
        <AuthProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AuthProvider>
      </body>
    </html>
  );
}