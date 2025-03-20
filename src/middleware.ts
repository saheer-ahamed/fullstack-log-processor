import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
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
            const res = NextResponse.next();
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
    const isProtectedPage = path.startsWith("/dashboard");
    const isProtectedApiRoute =
      path.startsWith("/api/v1/") && !path.startsWith("/api/v1/auth");

    // Auth routes that should redirect to dashboard if already authenticated
    const authRoutes = ["/login", "/signup"];
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    if (isProtectedApiRoute) {
      if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // Handle protected routes
    if (isProtectedPage && !user) {
      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Handle auth routes
    if (isAuthRoute && user) {
      const redirectUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
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
