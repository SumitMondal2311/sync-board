import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export default function proxy(request: NextRequest) {
    const sessionCookie = !!request.cookies.get("__session_id");
    const pathname = request.nextUrl.pathname;

    if (!sessionCookie && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/sign-up", request.url));
    }

    if (sessionCookie && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
