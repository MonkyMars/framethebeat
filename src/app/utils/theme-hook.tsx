"use client"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import React, { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // This effect runs only on the client after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Force a specific theme for server-side rendering to ensure consistency
  // This prevents the hydration mismatch by ensuring server and client start with the same theme
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="light" // Always use light theme for SSR
      enableSystem={mounted} // Only enable system theme after mounting
      forcedTheme={!mounted ? "light" : undefined} // Force light theme during SSR and initial render
      value={{
        light: "light",
        dark: "dark",
        system: "system"
      }}
      disableTransitionOnChange
      storageKey="theme"
    >
      {children}
    </NextThemeProvider>
  )
}

export { useTheme } from "next-themes"