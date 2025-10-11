import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order", "Orders"],
  endpoints: (build) => ({
    // Create a new order
    createOrder: build.mutation({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Verify payment for an order
    verifyPayment: build.mutation({
      query: ({ orderId, reference }) => ({
        url: `orders/${orderId}/verify-payment`,
        method: "POST",
        body: { reference },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }, "Orders"],
    }),

    // Complete custom order payment
    completeCustomOrderPayment: build.mutation({
      query: ({ orderId, reference }) => ({
        url: `orders/${orderId}/complete-payment`,
        method: "POST",
        body: { reference },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }, "Orders"],
    }),

    // Get single order details
    getOrder: build.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Get all orders (admin)
    getAllOrders: build.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "orders",
        params: { page, limit },
      }),
      providesTags: ["Orders"],
    }),

    // Get user's orders
    getMyOrders: build.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "orders/my-orders",
        params: { page, limit },
      }),
      providesTags: ["Orders"],
    }),

    // Get stylist's orders
    getStylistOrders: build.query({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "orders/stylist",
        params: { page, limit, status },
      }),
      providesTags: ["Orders"],
    }),

    // Update order status
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }, "Orders"],
    }),

    // Update order item status
    updateOrderItemStatus: build.mutation({
      query: ({ id, itemId, status }) => ({
        url: `orders/${id}/items/${itemId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }, "Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCompleteCustomOrderPaymentMutation,
  useGetOrderQuery,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetStylistOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderItemStatusMutation,
} = orderApi;
