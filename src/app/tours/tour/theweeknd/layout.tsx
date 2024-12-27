"use client";
import "../../../globals.css";
import { ThemeProvider } from "../../../utils/theme-hook";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
