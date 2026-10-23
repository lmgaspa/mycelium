import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.cookies.get("myc_session")) {
    const destination = new URL("/login", request.url);
    destination.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(destination);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/settings/:path*"] };
