import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import "katex/dist/katex.min.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getCanonicalUrl } from "@/lib/url"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const baseUrl = getCanonicalUrl('')

export const metadata: Metadata = {
  title: "0xHabib - Cybersecurity Learning Journey",
  description: "Documenting what I break, build, and learn in security, malware analysis, and networking.",
  keywords: ["cybersecurity", "malware analysis", "reverse engineering", "networking", "golang", "threat hunting"],
  authors: [{ name: "Mohamed Habib Jaouadi" }],
  creator: "Mohamed Habib Jaouadi",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "0xHabib - Cybersecurity Learning Journey",
    description: "Documenting what I break, build, and learn in security, malware analysis, and networking.",
    siteName: "0xHabib",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "0xHabib - Cybersecurity Learning Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "0xHabib - Cybersecurity Learning Journey",
    description: "Documenting what I break, build, and learn in security, malware analysis, and networking.",
    creator: "@0xhabib",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/feed.xml',
          title: '0xHabib RSS Feed'
        }
      ]
    }
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XBNDLMQFHF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XBNDLMQFHF');
          `}
        </Script>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
            <footer className="border-t border-border/40 py-12 px-4">
              <div className="max-w-6xl mx-auto text-center space-y-4">
                <p className="text-muted-foreground">
                  Built with Love.
                  <span className="text-green-500 font-mono"> 0xHabib </span>© 2025
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Anonymous analytics are collected for performance monitoring and site improvement purposes.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
