import { createApi } from "@reduxjs/toolkit/query";
import { baseQueryWithReauth } from "../BaseUrl";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notification"],
  endpoints: (build) => ({
    // Get notifications (paginated)
    getNotifications: build.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: `notifications`,

        params: { page, limit },
      }),
      providesTags: ["Notification"],
    }),
    // Mark notification as read
    markAsRead: build.mutation({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    // Mark all notifications as read
    markAllAsRead: build.mutation({
      query: () => ({
        url: `notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});
