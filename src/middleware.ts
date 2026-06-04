import { auth } from "@/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                     req.nextUrl.pathname.startsWith("/register");
  
  const protectedRoutes = ["/dashboard", "/watchlist", "/saved", "/settings", "/add-salary", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isAuthPage && isAuth) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isProtectedRoute && !isAuth) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
