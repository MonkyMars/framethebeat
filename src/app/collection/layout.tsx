"use client";
import "../globals.css";
import { ThemeProvider } from "../utils/theme-hook";
import React from "react";

import Head from "next/head";
import { AuthProvider } from "../utils/AuthContext";

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
