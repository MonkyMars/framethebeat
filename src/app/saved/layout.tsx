"use client";
import "../globals.css";
import { ThemeProvider } from "../utils/theme-hook";
import { AuthProvider } from "../utils/AuthContext";

import React from "react";

import Head from "next/head";

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
          href="https://lastfm.freetls.fastly.net"
          crossOrigin="anonymous"
        />
      </Head>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </>
  );
}
