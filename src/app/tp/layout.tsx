"use client";
import React from "react";
import { AuthProvider } from "../utils/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <AuthProvider>
        {children}
      </AuthProvider>
    </>
  )
}
