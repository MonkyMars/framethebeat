"use client";
import { ThemeProvider } from "../utils/theme-hook";
import React from "react";
import { AuthProvider } from "../utils/AuthContext";
import Head from "next/head";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://zapqcxbffugqvfiiilci.supabase.co"
          crossOrigin="anonymous"
        />
      </Head>
      <Analytics />
      <SpeedInsights />
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </>
  );
}
