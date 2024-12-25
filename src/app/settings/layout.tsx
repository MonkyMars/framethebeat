"use client"
import "../globals.css";
import { ThemeProvider } from "../utils/theme-hook";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  if(!ready) return null;
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
