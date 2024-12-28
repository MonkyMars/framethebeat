"use client";
import "../globals.css";
import { ThemeProvider } from "../utils/theme-hook";
import React from "react";
import { AuthProvider } from "../utils/AuthContext";
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Analytics/>
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
    </>
  );
}
