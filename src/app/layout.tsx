import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ThemeProvider } from "./utils/theme-hook"
import { AuthProvider } from "./utils/AuthContext"
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
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

// export const generateMetadata = ({ params, searchParams }: {
//   params: { slug?: string[] }
//   searchParams: { [key: string]: string | string[] | undefined }
// }): Metadata => {
//   const path = params.slug ? `/${params.slug.join('/')}` : ''
  
//   const canonical = path === '' ? 'https://framethebeat.com' : undefined

//   return {
//     ...(canonical && { 
//       alternates: {
//         canonical
//       }
//     })
//   }
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/albumcovers/nothingbutthieves_moralpanic.webp" as="image" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}