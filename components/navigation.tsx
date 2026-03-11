"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FloatingDrone } from "./drone-animation"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <FloatingDrone size="sm" className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg tracking-tight">
            <span className="text-primary">Solar</span>
            <span className="text-foreground">Scan</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "relative transition-all",
                  pathname === item.href && "text-primary"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            </Link>
          ))}
        </div>

        <Link href="/upload">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Analysis
          </Button>
        </Link>
      </nav>
    </header>
  )
}
