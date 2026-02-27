import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const path = request.nextUrl.pathname;

    // 1. Redirect logged-in users away from auth pages
    // If user is logged in, they shouldn't see sign-in/up pages
    const authPages = ["/sign-in", "/sign-up", "/forgot-password"];
    if (
      token &&
      authPages.some((p) => path === p || path.startsWith(p + "/"))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. RBAC Logic
    // If needed, we can restrict access based on role here.
    // Currently, we ensure authenticated users can access the dashboard.
    if (token) {
      const rawRole = (token as any).user?.role ?? (token as any).role ?? "";
      const role = typeof rawRole === "string" ? rawRole.toLowerCase() : "";

      // Example: If we wanted to restrict non-owners
      // const isOwner = role === "owner";
      // if (!isOwner && path.startsWith("/admin")) {
      //   return NextResponse.redirect(new URL("/errors/prohibited", request.url));
      // }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths that do NOT require authentication
        const publicPaths = [
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/landing",
        ];

        // Check if path matches any public path (exact or sub-path)
        const isPublic = publicPaths.some(
          (p) => path === p || path.startsWith(p + "/"),
        );

        if (isPublic) {
          return true;
        }

        // Allow static assets (though usually handled by matcher)
        if (
          path.startsWith("/_next") ||
          path.startsWith("/static") ||
          path === "/favicon.ico"
        ) {
          return true;
        }

        // All other paths (/, /dashboard, etc.) require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/sign-in",
      error: "/errors/unauthorized",
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
