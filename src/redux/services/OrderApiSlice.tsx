import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

// Types
export interface ShippingAddress {
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  homeAddress: string;
  phone: string;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    mainImage: string;
    price: number;
  };
  quantity: number;
  priceAtPurchase: number;
  stylist?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  orderType: "standard" | "custom";
  measurements?: any;
  materialSample?: string;
}

export interface Order {
  _id: string;

  orderItems: OrderItem[];
  totalPages?: number;
  orderNumber?: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  shippingAddress: ShippingAddress & {
    address?: string;
  };
  shippingInfo?: {
    courier?: string;
    trackingNumber?: string;
  };
  paymentInfo: {
    paymentMethod: "credit_card" | "bank_transfer" | "cash_on_delivery" | "wallet";
    paymentStatus: "pending" | "completed" | "failed" | "refunded" | "partially_paid";
    transactionId?: string;
    reference?: string;
    amountPaid: number;
    paymentDate?: string;
    balanceDue: number;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  isCustomOrder?: boolean;
  paidPercentage?: number;
  awaitingBalancePayment?: boolean;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: "credit_card" | "bank_transfer" | "wallet" | "cash_on_delivery";
  orderType: "standard" | "custom";
  measurements?: any;
  materialSample?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  authorizationUrl?: string;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
  fromCache?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalOrders?: number;
}

export interface SingleOrderResponse {
  success: boolean;
  order: Order;
  fromCache?: boolean;
  message?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order", "Orders"],
  endpoints: (build) => ({
    // Create a new order
    createOrder: build.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: "orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Verify payment for an order
    verifyPayment: build.mutation<SingleOrderResponse, { reference: string; orderId?: string }>({
      query: ({ reference }) => ({
        url: `orders/verify-payment?reference=${reference}`,
        method: "GET",
      }),
      invalidatesTags: (result, error, { orderId }) =>
        result?.order?._id ? [{ type: "Order", id: result.order._id }, "Orders"] : ["Orders"],
    }),

    // Complete custom order payment
    completeCustomOrderPayment: build.mutation<
      SingleOrderResponse,
      { orderId: string; reference: string }
    >({
      query: ({ orderId, reference }) => ({
        url: `orders/${orderId}/complete-payment`,
        method: "POST",
        body: { reference },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }, "Orders"],
    }),

    // Get single order details
    getOrder: build.query<SingleOrderResponse, string>({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Get all orders (admin)
    getAllOrders: build.query<OrdersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "orders",
        params: { page, limit },
      }),
      providesTags: ["Orders"],
    }),

    // Get user's orders
    getMyOrders: build.query<OrdersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "orders/my-orders",
        params: { page, limit },
      }),
      providesTags: ["Orders"],
    }),

    // Get stylist's orders
    getStylistOrders: build.query<
      OrdersResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "orders/stylist",
        params: { page, limit, ...(status && { status }) },
      }),
      providesTags: ["Orders"],
    }),

    // Update order status
    updateOrderStatus: build.mutation<SingleOrderResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }, "Orders"],
    }),

    // Update order item status
    updateOrderItemStatus: build.mutation<
      SingleOrderResponse,
      { id: string; itemId: string; status: string }
    >({
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
