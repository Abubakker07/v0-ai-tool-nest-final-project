'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Combine ThemeProviderProps with a children prop
type CombinedProviderProps = ThemeProviderProps & {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: CombinedProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}