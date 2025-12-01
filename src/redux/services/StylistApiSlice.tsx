import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const stylistApi = createApi({
  reducerPath: "stylistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Stylist"],
  endpoints: (build) => ({
    // ==================== QUERIES ====================
    getStylists: build.query({
      query: ({ company, specialty, page = 1, limit = 10 }) => ({
        url: `stylist`,
        params: { company, specialty, page, limit },
      }),
      providesTags: ["Stylist"],
    }),

    getStylistDetail: build.query({
      query: (id) => ({
        url: `stylist/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Stylist", id }],
    }),

    // ==================== MUTATIONS ====================
    // Admin-only: Create stylist company
    createStylist: build.mutation({
      query: (data) => ({
        url: "stylist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stylist"],
    }),

    // Admin-only: Delete stylist
    deleteStylist: build.mutation({
      query: (id) => ({
        url: `stylist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stylist"],
    }),

    // Admin-only: Verify/Reject stylist
    verifyStylist: build.mutation({
      query: ({ id, action, rejectionReason }) => ({
        url: `stylist/verify/${id}`,
        method: "PATCH",
        body: { action, rejectionReason },
      }),
      invalidatesTags: ["Stylist"],
    }),

    // Update stylist (admin or owner)
    updateStylist: build.mutation({
      query: ({ id, data }) => ({
        url: `stylist/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),

    // Update stylist profile (stylist only)
    updateStylistProfile: build.mutation({
      query: ({ id, data }) => ({
        url: `stylist/${id}/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),

    // ==================== IMAGE UPLOADS ====================
    uploadStylistAvatar: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylist/${id}/upload-avatar`,
        method: "POST",
        body: formData,
        headers: {
          // Let the browser set content-type for FormData
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),

    uploadStylistBanner: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylist/${id}/upload-banner`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),

    addPortfolioImage: build.mutation({
      query: ({ id, formData }) => ({
        url: `stylist/${id}/portfolio`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),

    removePortfolioImage: build.mutation({
      query: ({ id, imageId }) => ({
        url: `stylist/${id}/portfolio/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stylist", id }, "Stylist"],
    }),
  }),
});

export const {
  useGetStylistDetailQuery,
  useGetStylistsQuery,
  useUpdateStylistMutation,
  useCreateStylistMutation,
  useDeleteStylistMutation,
  useVerifyStylistMutation,
  useUpdateStylistProfileMutation,
  useUploadStylistAvatarMutation,
  useUploadStylistBannerMutation,
  useAddPortfolioImageMutation,
  useRemovePortfolioImageMutation,
} = stylistApi;
