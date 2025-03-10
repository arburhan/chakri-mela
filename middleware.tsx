/* eslint-disable  */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // If user is not authenticated and tries to access protected pages, redirect to login
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            const url = new URL("/auth/login", request.url);
            url.searchParams.set("callbackUrl", encodeURI(pathname));
            return NextResponse.redirect(url);
        }

        // Check if user is trying to access a route they don't have permission for
        if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else if (pathname.startsWith("/dashboard/seeker") && token.role !== "seeker") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else if (pathname.startsWith("/dashboard/poster") && token.role !== "poster") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // For the general /dashboard path, route users to their specific dashboard
        if (pathname === "/dashboard") {
            if (token.role === "admin") {
                return NextResponse.redirect(new URL("/dashboard/admin", request.url));
            } else if (token.role === "seeker") {
                return NextResponse.redirect(new URL("/dashboard/seeker", request.url));
            } else if (token.role === "poster") {
                return NextResponse.redirect(new URL("/dashboard/poster", request.url));
            }
        }
    }

    // If user is authenticated and tries to access auth pages, redirect to their respective dashboard
    if (pathname.startsWith("/auth") && token) {
        if (token.role === "admin") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else if (token.role === "seeker") {
            return NextResponse.redirect(new URL("/dashboard/seeker", request.url));
        } else if (token.role === "poster") {
            return NextResponse.redirect(new URL("/dashboard/poster", request.url));
        }
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