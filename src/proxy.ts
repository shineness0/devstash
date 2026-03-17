import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export const proxy = auth(function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = (req as NextRequest & { auth: unknown }).auth;

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) && !session) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
