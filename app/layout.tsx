import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Iconic - Icon Creator",
  description: "Create beautiful icons powered by cloudflared workers"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Icon links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" sizes="48x48" href="/icon-48x48.png" />
        <link rel="icon" sizes="64x64" href="/icon-64x64.png" />
        <link rel="icon" sizes="128x128" href="/icon-128x128.png" />
        <link rel="icon" sizes="256x256" href="/icon-256x256.png" />
        <link rel="icon" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

