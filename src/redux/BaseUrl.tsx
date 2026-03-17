import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logoutUser, setUser } from "./features/authSlice";
import { RootState } from "./Store";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

// --- Rate Limiting State ---
let rateLimitUntil: number | null = null;
const RATE_LIMIT_BACKOFF = 60000;

// --- Refresh Deduplication ---
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const refreshToken = async (api: any, extraOptions: any) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = Promise.resolve(
      baseQuery({ url: "auth/refresh-token", method: "POST" }, api, extraOptions),
    ).finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // --- Rate limit gate ---
  if (rateLimitUntil && Date.now() < rateLimitUntil) {
    const isAuthEndpoint =
      typeof args === "string" ? args.includes("auth/") : args.url?.includes("auth/");

    if (isAuthEndpoint) {
      return {
        error: {
          status: 429,
          data: {
            message: "Too many requests. Please wait a moment and try again.",
            rateLimited: true,
          },
        },
      };
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // --- Handle 429 ---
  if (result.error?.status === 429) {
    console.warn("⏰ Rate limited (429) - backing off");
    rateLimitUntil = Date.now() + RATE_LIMIT_BACKOFF;
    const retryAfter = (result.error as any)?.headers?.get("retry-after");
    if (retryAfter) {
      const waitTime = parseInt(retryAfter) * 1000;
      rateLimitUntil = Date.now() + (isNaN(waitTime) ? RATE_LIMIT_BACKOFF : waitTime);
    }
    return result;
  }

  const isAuthEndpoint =
    typeof args === "string" ? args.includes("auth/") : args.url?.includes("auth/");

  const state = api.getState() as RootState;
  const isLoggedIn = !!state.authSlice.user;

  // --- Handle 401: Token expired → attempt refresh ---
  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (isLoggedIn) {
      console.log("🔄 Access token expired, attempting refresh...");
      try {
        const refreshResult = await refreshToken(api, extraOptions);

        if (refreshResult?.data) {
          console.log("✅ Refresh successful, retrying original request...");
          const refreshData = refreshResult.data as any;
          if (refreshData.user) {
            api.dispatch(setUser(refreshData.user));
          }
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log("❌ Refresh failed, logging out...");
          await handleAuthFailure(api);
        }
      } catch (err) {
        console.error("❌ Refresh error:", err);
        await handleAuthFailure(api);
      }
    } else {
      console.log("⚠️ 401 received but user not in Redux - not attempting refresh");
    }
  }

  // --- Handle 403 ---
  // A plain 403 from a role-based guard (e.g. stylist hitting /cart) must NOT
  // trigger logout — it's a permission issue, not an auth failure.
  if (result.error?.status === 403) {
    const errorData = result.error.data as any;

    if (isLoggedIn && isTokenError(errorData)) {
      // Backend explicitly says the token itself is bad → logout
      console.log("🔐 Token error on 403, logging out...");
      await handleAuthFailure(api);
    } else {
      // Role-based denial, guest access, or any other 403 → just warn, never logout
      console.warn("🚫 403 Permission denied:", errorData?.message || "Access denied");
    }
  }

  return result;
};

// --- Strict token error detection ---
// ONLY matches when the backend explicitly returns these error codes.
// Does NOT match on message text — too broad, catches role-based errors.
const isTokenError = (errorData: any): boolean => {
  if (!errorData) return false;

  const errorCode = errorData?.error || errorData?.code || "";

  // Only these specific codes mean the TOKEN is bad (not just the role)
  const tokenErrorCodes = [
    "INVALID_REFRESH_TOKEN",
    "SESSION_EXPIRED",
    "NO_TOKENS",
    "AUTH_ERROR",
    "TOKEN_EXPIRED",
    "INVALID_TOKEN",
  ];

  return tokenErrorCodes.includes(errorCode);
};

const handleAuthFailure = async (api: any) => {
  api.dispatch(logoutUser());

  if (typeof window !== "undefined") {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.log("Logout endpoint call failed (safe to ignore)");
    }

    if (!window.location.pathname.includes("/login")) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("redirect", currentPath);
      loginUrl.searchParams.set("session", "expired");
      window.location.href = loginUrl.toString();
    }
  }
};

export { baseQueryWithReauth };
