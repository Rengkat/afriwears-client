// @/redux/services/AuthApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import { setCredentials, setUser, logoutUser } from "../features/authSlice"; // Added setUser

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: true,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.token) {
            dispatch(setCredentials({ user: data.user, token: data.token }));
          }
        } catch (error) {
          console.error("Registration mutation failed:", error);
        }
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.token) {
            dispatch(setCredentials({ user: data.user, token: data.token }));
          }
        } catch (error) {
          console.error("Login mutation failed:", error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutUser());
        } catch (error) {
          console.error("Logout mutation failed:", error);
          // Even if API call fails, logout locally
          dispatch(logoutUser());
        }
      },
    }),

    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (error: any) {
          // console.error("getCurrentUser query failed:", error);
          // Only logout if it's an authentication error
          if (error?.status === 401 || error?.error?.status === 401) {
            dispatch(logoutUser());
          }
        }
      },
    }),

    verifyEmail: builder.mutation({
      query: ({ verificationToken, email }) => ({
        url: "auth/verify-email",
        method: "POST",
        body: { verificationToken, email },
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email, verificationToken, password }) => ({
        url: "auth/reset-password",
        method: "POST",
        body: { email, verificationToken, password },
      }),
    }),

    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: "auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendVerificationEmailMutation,
  useGetCurrentUserQuery,
} = authApi;
