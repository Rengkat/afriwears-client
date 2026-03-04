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
const RATE_LIMIT_BACKOFF = 60000; // 60 seconds

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

// --- Main BaseQuery Wrapper ---
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // Check if we're currently rate limited
  if (rateLimitUntil && Date.now() < rateLimitUntil) {
    console.log(`⏳ Rate limited until ${new Date(rateLimitUntil).toLocaleTimeString()}`);

    // For auth endpoints, return a special error
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

  // Handle Rate Limiting (429)
  if (result.error?.status === 429) {
    console.warn("⏰ Rate limited (429) - backing off");

    // Set rate limit cooldown
    rateLimitUntil = Date.now() + RATE_LIMIT_BACKOFF;

    // Extract retry-after header if available
    const retryAfter = (result.error as any)?.headers?.get("retry-after");
    if (retryAfter) {
      const waitTime = parseInt(retryAfter) * 1000;
      rateLimitUntil = Date.now() + (isNaN(waitTime) ? RATE_LIMIT_BACKOFF : waitTime);
    }

    // Don't attempt refresh for rate limiting
    return result;
  }

  // Identify if current call is an auth endpoint
  const isAuthEndpoint =
    typeof args === "string" ? args.includes("auth/") : args.url?.includes("auth/");

  // Get current state to check token
  const state = api.getState() as RootState;
  const token = state.authSlice?.token;

  // Handle 403 Forbidden
  if (result.error?.status === 403) {
    const errorData = result.error.data as any;

    if (token && isAuthError(errorData)) {
      console.log("🔐 Auth error detected (invalid token), logging out...");
      await handleAuthFailure(api);
    } else if (!token) {
      console.log("⚠️ 403 without token - not logging out");
      return result;
    } else {
      console.warn("🚫 Permission denied (403):", errorData?.message);
    }
  }

  // Handle 401 Unauthorized (expired/invalid token)
  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (token) {
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
          if (result.data && (result.data as any).user) {
            api.dispatch(setUser((result.data as any).user));
          }
        } else {
          console.log("❌ Refresh failed, logging out...");
          await handleAuthFailure(api);
        }
      } catch (err) {
        console.error("❌ Refresh error:", err);
        await handleAuthFailure(api);
      }
    } else {
      console.log("⚠️ 401 received but no token - not attempting refresh");
    }
  }

  return result;
};

// --- Helper Functions ---
const isAuthError = (errorData: any): boolean => {
  if (!errorData) return false;

  const message = errorData?.message?.toLowerCase() || "";
  const errorCode = errorData?.error || "";

  const authIndicators = [
    "INVALID_REFRESH_TOKEN",
    "SESSION_EXPIRED",
    "NO_TOKENS",
    "AUTH_ERROR",
    "UNAUTHORIZED",
  ];

  const isAuthMessage =
    message.includes("token") ||
    message.includes("session") ||
    message.includes("auth") ||
    message.includes("authenticate") ||
    message.includes("unauthorized");

  return authIndicators.includes(errorCode) || isAuthMessage;
};

const handleAuthFailure = async (api: any) => {
  api.dispatch(logoutUser());

  if (typeof window !== "undefined") {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout endpoint call failed");
    }

    // Clear cookies
    document.cookie =
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure";
    document.cookie =
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure";

    localStorage.removeItem("user");
    sessionStorage.clear();

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
