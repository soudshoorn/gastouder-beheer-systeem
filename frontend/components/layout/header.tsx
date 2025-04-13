"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Baby, Home, Users, Calendar, Receipt } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Kinderen",
      icon: Baby,
      href: "/children",
      active: pathname.includes("/children"),
    },
    {
      label: "Ouders",
      icon: Users,
      href: "/parents",
      active: pathname.includes("/parents"),
    },
    {
      label: "Aanwezigheid",
      icon: Calendar,
      href: "/attendance",
      active: pathname.includes("/attendance"),
    },
    {
      label: "Facturen",
      icon: Receipt,
      href: "/invoices",
      active: pathname.includes("/invoices"),
    },
  ]

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 sm:max-w-sm">
          <div className="flex h-14 items-center px-4 bg-primary text-primary-foreground">
            <Link href="/" className="flex items-center font-semibold">
              <span className="text-xl">Qiddo Register</span>
            </Link>
          </div>
          <nav className="grid items-start px-2 gap-1 mt-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1 md:hidden">
        <Link href="/" className="flex items-center font-semibold">
          <span className="text-xl text-primary">Qiddo Register</span>
        </Link>
      </div>
    </header>
  )
}
