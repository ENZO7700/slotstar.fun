import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/types/admin/auth";
import { canAccessRoute, isPublicAdminPath } from "@/lib/admin/roles";
import { decodeSessionEdge } from "@/lib/admin/session-edge";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = decodeSessionEdge(token);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-user-role", session.role);
  response.headers.set("x-user-name", session.username);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
