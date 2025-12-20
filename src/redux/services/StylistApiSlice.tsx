import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const stylistApi = createApi({
  reducerPath: "stylistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Stylist", "MyStylist"],
  endpoints: (build) => ({
    // ==================== QUERIES ====================
    getStylists: build.query({
      query: ({ company, specialty, page = 1, limit = 10 }) => ({
        url: `stylists`,
        params: { company, specialty, page, limit },
      }),
      providesTags: ["Stylist"],
    }),

    // Get logged-in stylist's own profile
    getMyStylistProfile: build.query({
      query: () => ({
        url: "stylists/my/profile",
      }),
      providesTags: ["MyStylist"],
    }),

    // Get any stylist by ID
    getStylistDetail: build.query({
      query: (id) => ({
        url: `stylists/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Stylist", id }],
    }),

    // ==================== MUTATIONS ====================
    // Admin-only: Create stylist company
    createStylist: build.mutation({
      query: (data) => ({
        url: "stylists",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stylist"],
    }),

    // Admin-only: Delete stylist
    deleteStylist: build.mutation({
      query: (id) => ({
        url: `stylists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stylist"],
    }),

    // Admin-only: Update any stylist
    updateStylist: build.mutation({
      query: ({ id, data }) => ({
        url: `stylists/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),

    // Admin-only: Verify/Reject stylist
    verifyStylist: build.mutation({
      query: ({ id, action, rejectionReason }) => ({
        url: `stylists/verify/${id}`,
        method: "PATCH",
        body: { action, rejectionReason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),
    // Add to your stylistApi endpoints
    suspendStylist: build.mutation({
      query: ({ id, action, suspensionReason }) => ({
        url: `stylists/suspend/${id}`,
        method: "PATCH",
        body: { action, suspensionReason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),
    // Stylist-only: Update own profile via /my/profile
    updateMyStylistProfile: build.mutation({
      query: (data) => ({
        url: `stylists/my/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["MyStylist", "Stylist"],
    }),

    // ==================== IMAGE UPLOADS ====================
    uploadStylistAvatar: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylists/${id}/upload-avatar`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),

    uploadStylistBanner: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylists/${id}/upload-banner`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),

    addPortfolioImage: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylists/${id}/portfolio`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),
    uploadStylistDocument: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylists/${id}/upload-document`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),
    removePortfolioImage: build.mutation({
      query: ({ id, imageId }) => ({
        url: `stylists/${id}/portfolio/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist", "MyStylist"],
    }),
  }),
});

export const {
  useGetStylistDetailQuery,
  useGetStylistsQuery,
  useGetMyStylistProfileQuery,
  useUpdateStylistMutation,
  useCreateStylistMutation,
  useDeleteStylistMutation,
  useVerifyStylistMutation,
  useUpdateMyStylistProfileMutation,
  useUploadStylistAvatarMutation,
  useUploadStylistBannerMutation,
  useAddPortfolioImageMutation,
  useRemovePortfolioImageMutation,
  useUploadStylistDocumentMutation,
  useSuspendStylistMutation,
} = stylistApi;
