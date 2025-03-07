/* eslint-disable */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Get the pathname of the request
    const { pathname } = request.nextUrl;

    // Protect routes under /dashboard
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            const url = new URL("/auth/login", request.url);
            url.searchParams.set("callbackUrl", encodeURI(pathname));
            return NextResponse.redirect(url);
        }
    }

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (pathname.startsWith("/auth") && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

// Configure which routes to protect
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*"
    ],
};