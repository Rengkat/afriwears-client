// @/redux/services/notificationApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
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

    // Get unread count
    getUnreadCount: build.query({
      query: () => ({
        url: `notifications/unread-count`,
      }),
      providesTags: ["Notification"],
    }),

    // Mark notification as read
    markAsRead: build.mutation<void, string>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Mark all notifications as read
    markAllAsRead: build.mutation<void, void>({
      query: () => ({
        url: `notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Delete notification
    deleteNotification: build.mutation({
      query: (notificationId) => ({
        url: `notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
