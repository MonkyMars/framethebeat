import React from "react";
import { AuthProvider } from "../utils/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function TourLayout({
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