import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";
import { clearCart, setCartItems } from "../features/cartSlice";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (build) => ({
    getCartProducts: build.query({
      query: () => ({
        url: "cart",
      }),
      providesTags: ["Cart"],
      // Sync DB cart into Redux slice when fetched
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.items) {
            dispatch(
              setCartItems(
                data.data.items.map((item: any) => ({
                  _id: item._id,
                  product: item.product?._id || item.product,
                  quantity: item.quantity,
                  price: item.price,
                  name: item.product?.name,
                  mainImage: item.product?.mainImage,
                  stock: item.product?.stock,
                })),
              ),
            );
          }
        } catch {
          // Silently fail — guest cart in Redux/localStorage is still valid
        }
      },
    }),

    addToCart: build.mutation({
      query: (data) => ({
        url: "cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Merge guest cart items into DB after login
    mergeCart: build.mutation<any, Array<{ productId: string; quantity: number }>>({
      query: (items) => ({
        url: "cart/merge",
        method: "POST",
        body: { items },
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
        url: `cart/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    moveToWishlist: build.mutation({
      query: (productId: string) => ({
        url: "cart/move-to-wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: build.mutation<void, void>({
      query: () => ({
        url: "cart/clear-cart",
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearCart());
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
  useMergeCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
  useMoveToWishlistMutation,
} = cartApi;
