import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Iconic - HQ Icon Generator",
  description: "Create beautiful icons for any size project",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Iconic - HQ Icon Generator</title>
  <meta name="title" content="Iconic - HQ Icon Generator" />
  <meta name="description" content="Create beautiful icons for any size project" />
  <meta name="author" content="Jesse Roper" />


  <meta property="og:site_name" content="iconic.jessejesse.xyz" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://iconic.jessejesse.xyz/" />
  <meta property="og:title" content="Iconic - HQ Icon Generator" />
  <meta property="og:description" content="Create beautiful icons for any size project" />
  <meta property="og:image" content="https://iconic.jessejesse.xyz/iconic-og.png" />


  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://iconic.jessejesse.xyz/" />
  <meta property="twitter:title" content="Iconic - HQ Icon Generator" />
  <meta property="twitter:description" content="Create beautiful icons for any size project" />
  <meta property="twitter:image" content="https://iconic.jessejesse.xyz/iconic-og.png" />


  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
    rel="stylesheet"
  />


  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
  <link rel="icon" type="image/png" sizes="48x48" href="/icon-48x48.png" />
  <link rel="icon" type="image/png" sizes="64x64" href="/icon-64x64.png" />
  <link rel="icon" type="image/png" sizes="128x128" href="/icon-128x128.png" />
  <link rel="icon" type="image/png" sizes="256x256" href="/icon-256x256.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
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


