// import { fetchBaseQuery } from "@reduxjs/toolkit/query";
// import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { logoutUser, setUser } from "./features/authSlice";
// const baseUrl = "http://localhost:5000/api";

// // Create a custom baseQuery that can handle 401 Unauthorized
// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
//   args,
//   api,
//   extraOptions
// ) => {
//   let result = await fetchBaseQuery({
//     baseUrl,
//     credentials: "include",
//   })(args, api, extraOptions);

//   // If the backend returns a 401 and the payload indicates unauthentication
//   // (e.g., if both access and refresh tokens are invalid)
//   if (result.error && result.error.status === 401) {
//     console.log("Authentication error, logging out...");
//     // Dispatch the logout action to clear user state
//     api.dispatch(logoutUser());
//     // Optionally redirect to login page here, or let a wrapper component handle it
//   }
//   return result;
// };

// export { baseQueryWithReauth };
