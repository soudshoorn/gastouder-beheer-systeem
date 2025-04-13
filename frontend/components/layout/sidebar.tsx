"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Baby, Home, Users, Calendar, Receipt } from "lucide-react"

export default function Sidebar() {
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
    <div className="hidden md:flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-14 items-center border-b px-4 bg-primary">
        <Link href="/" className="flex items-center font-semibold">
          <span className="text-xl text-primary-foreground">Qiddo Register</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 gap-1">
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
      </div>
    </div>
  )
}
