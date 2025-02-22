import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Role } from "@prisma/client"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")

  // Handle auth pages (login, register)
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return null
  }

  // Check authentication for protected routes
  if (!isAuth) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    )
  }

  // Role-based access control
  const isHostRoute = req.nextUrl.pathname.startsWith("/dashboard/host")
  const isRenterRoute = req.nextUrl.pathname.startsWith("/dashboard/renter")
  const userRole = token.role as Role

  if (isHostRoute && userRole !== Role.HOST) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isRenterRoute && userRole !== Role.RENTER) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/properties/create",
    "/properties/edit/:path*"
  ]
}