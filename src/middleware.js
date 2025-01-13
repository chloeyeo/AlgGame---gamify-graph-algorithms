import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Protect /myaccount route
  if (request.nextUrl.pathname === "/myaccount") {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Prevent authenticated users from accessing /auth
  if (request.nextUrl.pathname === "/auth") {
    if (token) {
      return NextResponse.redirect(new URL("/myaccount", request.url));
    }
  }

  return NextResponse.next();
}

// Add config to specify which routes middleware should run on
export const config = {
  matcher: ["/myaccount", "/auth", "/leaderboard"],
};
