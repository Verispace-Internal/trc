import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// ── Routes that require a valid login ────────────────────────────────
const protectedRoutes = ["/admin/dashboard"]

// ── Routes that logged-in users should not visit ─────────────────────
const authRoutes = ["/admin/login", "/admin/register"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  // ── Helper: verify token ────────────────────────────────────────────
  const isValidToken = async (): Promise<boolean> => {
    if (!token) return false
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return true
    } catch {
      return false
    }
  }

  // ── 1. Visiting dashboard (protected) ──────────────────────────────
  if (isProtected) {
    const valid = await isValidToken()

    if (!valid) {
      const response = NextResponse.redirect(new URL("/", req.url))
      if (token) response.cookies.delete("token")
      return response
    }

    return NextResponse.next()
  }

  // ── 2. Visiting login/register while already logged in ────────────
  if (isAuthRoute) {
    const valid = await isValidToken()

    if (valid) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}