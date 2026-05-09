import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");
  const isWardenRoute = pathname.startsWith("/warden");
  const isStudentRoute = pathname.startsWith("/student");
  const isProtected = isAdminRoute || isWardenRoute || isStudentRoute;

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    const role = token.role as string;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "WARDEN") return NextResponse.redirect(new URL("/warden/dashboard", req.url));
    return NextResponse.redirect(new URL("/student/dashboard", req.url));
  }

  // Redirect unauthenticated users to login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access enforcement
  if (token && isProtected) {
    const role = token.role as string;
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (isWardenRoute && role !== "WARDEN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (isStudentRoute && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/warden/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};
