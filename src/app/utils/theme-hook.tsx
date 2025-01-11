"use client"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import React, { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null 
  }

  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
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