import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths (accessible without authentication)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/register/stylist",
  "/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/products",
  "/stylists",
  "/unauthorized",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-email",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/refresh-token",
];

// Auth paths (should be blocked if user has valid tokens)
const AUTH_PATHS = [
  "/login",
  "/register",
  "/register/stylist",
  "/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

// Check if user is authenticated by calling your backend
const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:5000/api"}/auth/validate-tokens`,
      {
        method: "GET",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.valid === true;
    }

    return false;
  } catch (error) {
    console.error("Auth validation failed:", error);
    return false;
  }
};

// Check if user has any tokens (even if expired)
const hasTokens = (req: NextRequest): boolean => {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  return !!(accessToken || refreshToken);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ CRITICAL: Skip middleware for ALL static files
  const isStaticFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|json|woff|woff2|ttf|eot)$/i); // All static file types

  if (isStaticFile) {
    console.log(`[Middleware] Skipping static file: ${pathname}`);
    return NextResponse.next();
  }

  // Check if user has valid tokens by calling backend
  const isAuth = await isAuthenticated(request);
  const hasAnyTokens = hasTokens(request);

  console.log(
    `[Middleware] Path: ${pathname}, Authenticated: ${isAuth}, HasTokens: ${hasAnyTokens}`,
  );

  // 🔒 If user is authenticated and tries to access auth pages, redirect to home
  if (isAuth && AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    console.log(
      `[Middleware] Authenticated user accessing auth page ${pathname}. Redirecting to home.`,
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Allow public paths for everyone
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 🔒 Handle protected routes (both pages and API)
  if (!isAuth) {
    // User is not authenticated

    // For API routes, return 401 JSON response
    if (pathname.startsWith("/api/")) {
      console.log(`[Middleware] Unauthenticated API access to ${pathname}. Returning 401.`);
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Please log in",
          success: false,
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // For page routes, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    // Add session=expired if user had tokens but they're invalid
    if (hasAnyTokens && !isAuth) {
      loginUrl.searchParams.set("session", "expired");
      console.log(`[Middleware] Expired tokens for ${pathname}. Redirecting to login.`);
    } else {
      console.log(`[Middleware] No valid authentication for ${pathname}. Redirecting to login.`);
    }

    return NextResponse.redirect(loginUrl);
  }

  // ✅ Allow access for authenticated users
  console.log(`[Middleware] Allowing authenticated access to: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  // Update matcher to be more specific - exclude all static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js)$).*)",
  ],
};
