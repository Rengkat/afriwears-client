import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Product"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: ({ stylist, page = 1, name, limit = 10, category, type, featured, status }) => ({
        url: `products`,
        params: { stylist, page, name, limit, category, type, featured, status },
      }),
      providesTags: ["Products"],
    }),
    getFeaturedProducts: build.query({
      query: () => ({
        url: `products?featured=true`,
      }),
      providesTags: ["Products"],
    }),
    getProductDetail: build.query({
      query: (id) => ({
        url: `products/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: build.mutation({
      query: (data) => ({
        url: `products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation({
      query: ({ id, ...data }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: build.mutation({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        return {
          url: `products/upload-product-image`,
          method: "POST",
          body: formData,
        };
      },
    }),
    addReview: build.mutation({
      query: ({ productId, ...data }) => ({
        url: `products/${productId}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    updateReview: build.mutation({
      query: ({ productId, reviewId, ...data }) => ({
        url: `products/${productId}/review/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    verifyProduct: build.mutation({
      query: ({ productId, ...data }) => ({
        url: `products/verify/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useVerifyProductMutation,
} = productApi;
