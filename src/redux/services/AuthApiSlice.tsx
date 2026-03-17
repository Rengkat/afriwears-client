import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import { setUser, logoutUser } from "../features/authSlice";
import { clearCart } from "../features/cartSlice";
import { RootState } from "../Store";
import { cartApi } from "./CartApiSlice";

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
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          // Backend sets httpOnly cookies automatically.
          // We only store the user object in Redux/localStorage.
          if (data?.user) {
            dispatch(setUser(data.user));

            // ─── Merge guest cart into DB ────────────────────────────────
            // After login, check if there are items in the local (guest) cart
            const state = getState() as RootState;
            const guestItems = state.cartSlice.items;

            if (guestItems.length > 0) {
              console.log(`🛒 Merging ${guestItems.length} guest cart item(s) into DB...`);

              try {
                // Merge all guest items into the DB cart
                await dispatch(
                  cartApi.endpoints.mergeCart.initiate(
                    guestItems.map((item) => ({
                      productId: item.product,
                      quantity: item.quantity,
                    })),
                  ),
                ).unwrap();

                // Clear the guest cart from Redux + localStorage
                dispatch(clearCart());
                console.log("✅ Guest cart merged successfully");
              } catch (mergeError) {
                console.error("❌ Guest cart merge failed:", mergeError);
                // Don't block login if merge fails — user is still logged in
              }
            }
          }
        } catch (error) {
          // Login failed — don't dispatch anything
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
        } catch {
          // Even if API call fails, logout locally
        } finally {
          dispatch(logoutUser());
          dispatch(clearCart());
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
          if (error?.status === 429) {
            console.log("⚠️ Rate limited, skipping user fetch");
            return;
          }
          // 401 means session is truly gone
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
