import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the path is /leaderboard
  if (request.nextUrl.pathname.startsWith("/leaderboard")) {
    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/leaderboard/:path*"],
};
