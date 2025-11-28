import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/sign-up", "/sign-in"];
const PROTECTED_ROUTES = [
    "/select-workspace",
    "/dashboard/boards",
    "/dashboard/team",
    "/dashboard/billing",
    "/dashboard/settings",
];

export default function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/dashboard/boards", request.url));
    }

    if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const isAuthenticated = request.cookies.get("__session_id");

    if (isAuthenticated) {
        if (AUTH_ROUTES.some((route) => route === pathname)) {
            return NextResponse.redirect(new URL("/dashboard/boards", request.url));
        }
    } else {
        if (PROTECTED_ROUTES.some((route) => route === pathname)) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/data|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
