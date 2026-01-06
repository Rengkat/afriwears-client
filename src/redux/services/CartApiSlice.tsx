import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import { setCartItems, clearCart } from "../features/cartSlice";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (build) => ({
    getCartProducts: build.query({
      query: () => ({
        url: `cart`,
      }),
      providesTags: ["Cart"],
      // REMOVE onQueryStarted entirely - let RTK Query handle cache
      // This prevents state conflicts with auth
    }),

    addToCart: build.mutation({
      query: (data) => ({
        url: `cart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCart: build.mutation({
      query: ({ productId, quantity }) => ({
        url: `cart/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: build.mutation({
      query: (productId) => ({
        url: `cart`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: build.mutation({
      query: () => ({
        url: `cart/clear-cart`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearCart());
          localStorage.removeItem("cart");
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to clear cart:", error);
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
    }),
  }),
});

export const {
  useGetCartProductsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
} = cartApi;
