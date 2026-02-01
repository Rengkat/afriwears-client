import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Wishlist"],
  endpoints: (build) => ({
    // Add product to wishlist
    addToWishlist: build.mutation({
      query: (data: { productId: string }) => ({
        url: "wishlist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Get user's wishlist
    getMyWishlist: build.query<WishlistResponse, void>({
      query: () => "wishlist",
      providesTags: ["Wishlist"],
      transformResponse: (response: ApiResponse<WishlistResponse>) => response.data,
    }),

    // Remove product from wishlist
    removeFromWishlist: build.mutation({
      query: (productId: string) => ({
        url: `wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Move product from wishlist to cart
    moveToCart: build.mutation({
      query: (productId: string) => ({
        url: "wishlist/move-to-cart",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

// Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  stylist: string;
  addedAt: string;
}

interface WishlistResponse {
  items: WishlistItem[];
}

// Export hooks for usage in components
export const {
  useAddToWishlistMutation,
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} = wishlistApi;
