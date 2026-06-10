import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests for static files, API routes, and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    ["/login", "/signup"].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Check for the presence of session cookies directly to bypass `getToken` proxy issues in v5
  const hasSessionCookie = 
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token") ||
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  if (!hasSessionCookie) {
    // If no token, redirect to login page
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Base route redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
