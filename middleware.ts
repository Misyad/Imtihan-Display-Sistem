import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pass-through during offline setup. Once next-auth is installed,
  // revert this to the commented NextAuth middleware below.
  return NextResponse.next();
}

/*
import { auth } from "./lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isProtectedRoute = nextUrl.pathname.startsWith("/operator") || nextUrl.pathname.startsWith("/settings");
  const isAuthRoute = nextUrl.pathname.startsWith("/login");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/operator", nextUrl));
  }

  return NextResponse.next();
});
*/

export const config = {
  matcher: ["/operator/:path*", "/settings/:path*", "/login"],
};
