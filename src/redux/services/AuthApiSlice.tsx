import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import { logoutUser, setUser } from "../features/authSlice";

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
          dispatch(setUser(data.user));
          // dispatch(authApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }));
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
        }
      },
    }),
    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("getCurrentUser query failed:", error);

          dispatch(logoutUser());
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
