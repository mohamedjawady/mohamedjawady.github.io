"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Posts", href: "/posts" },
  { name: "Visualizations", href: "/visualizations" },
  { name: "Tags", href: "/tags" },
  { name: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <Terminal className="w-6 h-6 text-green-500" />
            <span className="font-bold font-mono text-xl relative">
              <span className="inline-block">
                0x<span className="text-green-500">H</span>
              </span>
              <span className="text-green-500 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                abib
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-500",
                  pathname === item.href ? "text-green-500" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-2 py-1 text-sm font-medium transition-colors hover:text-green-500",
                    pathname === item.href ? "text-green-500" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
