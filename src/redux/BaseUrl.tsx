import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logoutUser, setUser } from "./features/authSlice";
import { RootState } from "./Store";

const baseUrl = "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

// --- Refresh Deduplication ---
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const refreshToken = async (api: any, extraOptions: any) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = baseQuery(
      { url: "auth/refresh-token", method: "POST" },
      api,
      extraOptions,
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
  let result = await baseQuery(args, api, extraOptions);

  // Identify if current call is an auth endpoint
  const isAuthEndpoint =
    typeof args === "string" ? args.includes("auth/") : args.url?.includes("auth/");

  // Get current state to check token
  const state = api.getState() as RootState;
  const token = state.authSlice.token;

  // Handle 403 Forbidden - IMPORTANT FIX HERE
  if (result.error?.status === 403) {
    const errorData = result.error.data as any;

    // CRITICAL FIX: Only logout if we have a token AND it's an auth error
    if (token && isAuthError(errorData)) {
      console.log("🔐 Auth error detected (invalid token), logging out...");
      await handleAuthFailure(api);
    } else if (!token) {
      // No token exists, just return the error without logging out
      console.log("⚠️ 403 without token - not logging out");
      return result;
    } else {
      // We have a token but it's a permission error, not auth error
      console.warn("🚫 Permission denied (403):", errorData?.message);
      // Don't logout for permission errors
    }
  }

  // Handle 401 Unauthorized (expired/invalid token)
  if (result.error?.status === 401 && !isAuthEndpoint) {
    // Only attempt refresh if we have a token
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

  // Specific auth-related indicators
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

    document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("user");

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
