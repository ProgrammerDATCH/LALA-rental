import { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { AddPropertyButton } from "@/components/properties/add-property-button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainNav } from "@/components/layout/main-nav"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaLa Rentals",
  description: "Find and book your perfect rental property",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <TooltipProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1">{children}</main>
              </div>
              <AddPropertyButton />
              <Toaster />
            </ThemeProvider>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  )
}