"use client";
import "../../../globals.css";
import { ThemeProvider } from "../../../utils/theme-hook";
import { AuthProvider } from "@/app/utils/AuthContext";
import React from "react";
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
