import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    const path = req.nextUrl.pathname;

    // Allow access to /cart and /checkout if authenticated
    if (path.startsWith("/cart") || path.startsWith("/checkout")) {
        return NextResponse.next();
    }

    const roleAccess: Record<string, string[]> = {
      "super-admin": ["/dashboard", "/dashboard/users", "/dashboard/settings", "/dashboard/payments", "/dashboard/products", "/dashboard/orders", "/dashboard/profile"],
      "admin": ["/dashboard", "/dashboard/users", "/dashboard/products", "/dashboard/orders", "/dashboard/profile"],
      "manager": ["/dashboard", "/dashboard/products", "/dashboard/orders", "/dashboard/profile"],
      "user": ["/dashboard", "/dashboard/orders", "/dashboard/profile", "/dashboard"]
    };

    if (!token) return NextResponse.next();
    const userRole = token.role as string;
    const allowedPaths = roleAccess[userRole] || [];

    const isAllowed = allowedPaths.some((allowedPath) => path.startsWith(allowedPath));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*", "/checkout/:path*"]
};
