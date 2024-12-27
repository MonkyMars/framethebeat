"use client";
import "../globals.css";
import { ThemeProvider } from "../utils/theme-hook";
import React from "react";
import { AuthProvider } from "../utils/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
    </>
  );
}
