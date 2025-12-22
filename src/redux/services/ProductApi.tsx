import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Product", "MyProducts"],
  endpoints: (build) => ({
    getApprovedProducts: build.query({
      query: ({ stylist, page = 1, name, limit = 10, category, type, featured }) => ({
        url: `products`,
        params: { stylist, page, name, limit, category, type, featured },
      }),
      providesTags: ["Products"],
    }),

    getMyProducts: build.query({
      query: ({ page = 1, limit = 10, status, category, type, featured }) => ({
        url: `products/my-products`,
        params: { page, limit, status, category, type, featured },
      }),
      providesTags: ["MyProducts"],
    }),

    getAllProductsAdmin: build.query({
      query: ({ page = 1, limit = 10, name, category, type, featured, status }) => ({
        url: `products/all-products-admin`,
        params: { page, limit, name, category, type, featured, status },
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
      invalidatesTags: ["MyProducts"], // Invalidate MyProducts since this adds to user's products
    }),

    updateProduct: build.mutation({
      query: ({ id, ...data }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        "MyProducts",
        { type: "Product", id },
      ],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "MyProducts"],
    }),

    uploadProductImage: build.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: `products/upload-product-image`,
          method: "POST",
          body: formData,
        };
      },
    }),

    deleteProductImage: build.mutation({
      query: (imageUrl) => ({
        url: `products/delete-product-image`,
        method: "DELETE",
        body: { imageUrl },
      }),
      invalidatesTags: ["Products", "MyProducts"],
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
      invalidatesTags: (result, error, { productId }) => [
        "Products",
        "MyProducts",
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useGetApprovedProductsQuery,
  useGetMyProductsQuery,
  useGetAllProductsAdminQuery,
  useGetFeaturedProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useVerifyProductMutation,
} = productApi;
