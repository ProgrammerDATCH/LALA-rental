"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Menu, 
  PlusCircle, 
  Building2, 
  CalendarDays, 
  Search,
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"
import { ModeToggle } from "./mode-toggle"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isHost = session?.user?.role === Role.HOST

  const menuItems = isHost 
    ? [
        {
          href: "/properties/create",
          label: "Add Property",
          icon: PlusCircle
        },
        {
          href: "/dashboard/host/properties",
          label: "My Properties",
          icon: Building2
        },
        {
          href: "/dashboard/host",
          label: "Bookings",
          icon: CalendarDays
        }
      ]
    : [
        {
          href: "/dashboard/renter",
          label: "My Bookings",
          icon: CalendarDays
        }
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LaLa Rentals"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-xl hidden md:inline-block">
              LaLa Rentals
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" 
                  ? "text-black dark:text-white" 
                  : "text-muted-foreground"
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="/properties"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/properties" 
                  ? "text-black dark:text-white" 
                  : "text-muted-foreground"
              )}
            >
              <Search className="h-4 w-4" />
              Browse
            </Link>

            {session?.user && menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href 
                    ? "text-black dark:text-white" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <ModeToggle />

        {session?.user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm">
                {session.user.name}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <span>{session.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({isHost ? "Host" : "Renter"})
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/properties" className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Link>
                </DropdownMenuItem>

                {menuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  )
}