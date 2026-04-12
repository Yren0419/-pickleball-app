import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  const isAdminRoute = pathname.startsWith("/admin")

  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)

      if (isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }

      return NextResponse.next()

    } catch (err) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}