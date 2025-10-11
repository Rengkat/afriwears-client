import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Transaction", "Wallet"],
  endpoints: (build) => ({
    // Initialize wallet funding
    fundWallet: build.mutation({
      query: (data) => ({
        url: "transactions/fund-wallet",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transaction"],
    }),

    // Verify wallet funding payment
    verifyWalletFunding: build.mutation({
      query: (data) => ({
        url: "transactions/verify-fund-wallet",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transaction", "Wallet"],
    }),

    // Get all transactions (admin)
    getAllTransactions: build.query({
      query: ({ page = 1, limit = 10, type, status }) => ({
        url: "transactions",
        params: { page, limit, type, status },
      }),
      providesTags: ["Transaction"],
    }),

    // Get current user's transactions
    getMyTransactions: build.query({
      query: ({ page = 1, limit = 10, type, status }) => ({
        url: "transactions/my-transactions",
        params: { page, limit, type, status },
      }),
      providesTags: ["Transaction"],
    }),

    // Get specific user's transactions (admin)
    getUserTransactions: build.query({
      query: ({ userId, page = 1, limit = 10, type, status }) => ({
        url: `transactions/user/${userId}`,
        params: { page, limit, type, status },
      }),
      providesTags: ["Transaction"],
    }),

    // Get transaction details
    getTransaction: build.query({
      query: (id) => `transactions/${id}`,
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),

    // Get wallet balance
    getWalletBalance: build.query({
      query: () => "wallet/balance",
      providesTags: ["Wallet"],
    }),
  }),
});

export const {
  useFundWalletMutation,
  useVerifyWalletFundingMutation,
  useGetAllTransactionsQuery,
  useGetMyTransactionsQuery,
  useGetUserTransactionsQuery,
  useGetTransactionQuery,
  useGetWalletBalanceQuery,
} = transactionApi;
