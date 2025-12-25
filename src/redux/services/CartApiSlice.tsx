import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import {
  setCartItems,
  addCartItem,
  clearCart as clearCartRedux,
  setCartLoading,
} from "../features/cartSlice";

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
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setCartLoading(true));
        try {
          const { data } = await queryFulfilled;
          if (data?.cart?.items) {
            dispatch(setCartItems(data.cart.items));
          }
        } catch (error) {
          console.error("Failed to fetch cart from server:", error);

          // Fallback to localStorage
          if (typeof window !== "undefined") {
            const localCart = localStorage.getItem("cart");
            if (localCart) {
              const parsedCart = JSON.parse(localCart);
              dispatch(setCartItems(parsedCart.items || []));
            }
          }
        } finally {
          dispatch(setCartLoading(false));
        }
      },
    }),

    addToCart: build.mutation({
      query: (data) => ({
        url: `cart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
          // Optimistically update Redux store
          const cartItem = {
            _id: tempId,
            product: args.productId,
            quantity: args.quantity || 1,
            price: 0,
          };

          // Add size/color only if provided (for Buy Now)
          if (args.selectedSize) {
            cartItem.selectedSize = args.selectedSize;
          }
          if (args.selectedColor) {
            cartItem.selectedColor = args.selectedColor;
          }

          dispatch(addCartItem(cartItem));

          const result = await queryFulfilled;

          // If successful, we don't need to do anything else as invalidateTags will trigger a refetch
        } catch (error) {
          console.error("Failed to add to cart:", error);
          // On error, remove the temp item from Redux
          dispatch(removeCartItem(tempId));
          // Re-throw error so component can handle it
          throw error;
        }
      },
    }),
    removeFromCart: build.mutation({
      query: (productId) => ({
        url: `cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // The cart will be refetched due to invalidateTags
        } catch (error) {
          console.error("Failed to remove from cart:", error);
        }
      },
    }),

    updateCart: build.mutation({
      query: ({ productId, quantity }) => ({
        url: `cart/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // The cart will be refetched due to invalidateTags
        } catch (error) {
          console.error("Failed to update cart:", error);
        }
      },
    }),

    clearCart: build.mutation({
      query: () => ({
        url: `cart/clear-cart`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          // Optimistically clear Redux store
          dispatch(clearCartRedux());

          await queryFulfilled;
        } catch (error) {
          console.error("Failed to clear cart:", error);
          // On error, invalidate the cart tag to trigger a refetch
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
