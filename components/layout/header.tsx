import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"
import { MainNav } from "@/components/layout/main-nav"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">LaLa Rentals</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <MainNav />
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}