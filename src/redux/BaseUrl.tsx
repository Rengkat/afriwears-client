import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logoutUser, setUser } from "./features/authSlice";

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
      extraOptions
    ).finally(() => {
      isRefreshing = false;
      refreshPromise = null; // ✅ Reset for next refresh
    });
  }
  return refreshPromise;
};

// --- Main BaseQuery Wrapper ---
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Identify if current call is an auth endpoint
  const isAuthEndpoint =
    typeof args === "string" ? args.includes("auth/") : args.url?.includes("auth/");

  // Handle 401 Unauthorized (expired/invalid token)
  if (result.error?.status === 401 && !isAuthEndpoint) {
    console.log("🔄 Access token expired, attempting refresh...");

    try {
      const refreshResult = await refreshToken(api, extraOptions);

      if (refreshResult?.data) {
        console.log("✅ Refresh successful, retrying original request...");
        const refreshData = refreshResult.data as any;
        // Update Redux store with fresh user data
        if (refreshData.user) {
          api.dispatch(setUser(refreshData.user));
        }

        // Retry original request with new cookies
        result = await baseQuery(args, api, extraOptions);

        // If retried call also has user data, update store again
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
  }

  // Handle 403 Forbidden (auth issues vs permission issues)
  if (result.error?.status === 403) {
    const errorData = result.error.data as any;

    if (isAuthError(errorData)) {
      console.log("🔐 Auth error detected, logging out...");
      await handleAuthFailure(api);
    } else {
      console.warn("🚫 Permission denied (403):", errorData?.message);
      // Don't logout for permission errors - just let the 403 propagate
    }
  }

  return result;
};

// --- Helper Functions ---
const isAuthError = (errorData: any): boolean => {
  if (!errorData) return false;

  const authIndicators = ["INVALID_REFRESH_TOKEN", "SESSION_EXPIRED", "NO_TOKENS", "AUTH_ERROR"];

  return (
    authIndicators.includes(errorData?.error) ||
    errorData?.message?.toLowerCase().includes("token") ||
    errorData?.message?.toLowerCase().includes("session") ||
    errorData?.message?.toLowerCase().includes("auth") ||
    errorData?.message?.toLowerCase().includes("authenticate")
  );
};

const handleAuthFailure = async (api: any) => {
  // Dispatch logout to clear Redux state
  api.dispatch(logoutUser());

  if (typeof window !== "undefined") {
    try {
      // Optional: Call logout endpoint to clear server-side token
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout endpoint call failed, proceeding with client cleanup");
    }

    // Clear client-side storage
    document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("user");

    // Redirect to login (avoid infinite redirect loop)
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
