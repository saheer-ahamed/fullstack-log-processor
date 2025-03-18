import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
    let res = NextResponse.next({ request: { headers: requestHeaders } });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            res = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // // Log session and any errors
    // if (error) console.error("Session error:", error);

    // Get the pathname
    const path = request.nextUrl.pathname;

    // Protected routes that require authentication
    const protectedRoutes = [
      "/dashboard",
      "/api/v1/*",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      path.startsWith(route)
    );

    // Auth routes that should redirect to dashboard if already authenticated
    const authRoutes = ["/login", "/signup"];
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    // Handle protected routes
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Handle auth routes
    if (isAuthRoute && user) {
      const redirectUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    return NextResponse.next();
  }
}

// Specify which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
