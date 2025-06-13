import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
import type { JWT } from "next-auth/jwt";

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: JWT | null }}) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Protect the brand setup page, allowing only SUPER_ADMIN
    if (pathname.startsWith('/admin/brand-setup')) {
      if (token?.role !== 'SUPER_ADMIN') {
        // Redirect to the home page or an "access denied" page
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User is authorized if a token exists
    },
    pages: {
      signIn: '/login', // Redirect to custom login page
    }
  }
);

export const config = {
  matcher: [
    "/personas/:path*",
    "/admin/:path*",
  ],
}; 