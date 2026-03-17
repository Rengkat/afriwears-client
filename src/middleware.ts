import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths — accessible without any authentication
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

// Auth pages — redirect away if user already has tokens
const AUTH_PATHS = [
  "/login",
  "/register",
  "/register/stylist",
  "/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

// Strategy:
//   - For ROUTING decisions: just check if the cookie EXISTS (optimistic)
//   - For ACTUAL AUTH: the backend protect middleware handles verification
//   - If backend returns 401, baseQueryWithReauth handles refresh + redirect
// ────────────────────────────────────────────────────────────────────────────

/*
 * Check if any auth cookie exists (does NOT verify — backend does that)
 */
const hasTokens = (req: NextRequest): boolean => {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  return !!(accessToken || refreshToken);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files entirely
  const isStaticFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    /\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|json|woff|woff2|ttf|eot)$/i.test(pathname);

  if (isStaticFile) return NextResponse.next();

  const hasAnyTokens = hasTokens(request);

  // 🔒 If tokens exist and user tries to access auth pages → redirect to home
  // This is optimistic — if the token is actually expired, backend will 401
  // and baseQueryWithReauth will handle refresh or redirect to login
  if (hasAnyTokens && AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Allow public paths for everyone
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicPath) return NextResponse.next();

  // 🔒 Protected routes — no tokens at all → redirect to login
  if (!hasAnyTokens) {
    // API routes → return 401 JSON
    if (pathname.startsWith("/api/")) {
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

    // Page routes → redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Token exists — let through, backend will verify
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js)$).*)",
  ],
};
