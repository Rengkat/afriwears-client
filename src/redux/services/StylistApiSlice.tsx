import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const stylistApi = createApi({
  reducerPath: "stylistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Stylist"],
  endpoints: (build) => ({
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
    }),
    updateStylist: build.mutation({
      query: ({ id, data }) => ({
        url: `stylist/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useGetStylistDetailQuery, useGetStylistsQuery, useUpdateStylistMutation } =
  stylistApi;
