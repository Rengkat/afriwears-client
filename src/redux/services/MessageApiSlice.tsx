import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Messages", "Chats", "UnreadCount"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ senderId, receiverId, page = 1, limit = 50 }) => ({
        url: "/messages",
        params: { senderId, receiverId, page, limit },
      }),
      providesTags: (result, error, { senderId, receiverId }) => [
        { type: "Messages", id: `${senderId}-${receiverId}` },
      ],
    }),

    getChats: builder.query({
      query: () => "/messages/chats",
      providesTags: ["Chats"],
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/send",
        method: "POST",
        body: data,
      }),
      // Invalidate all related caches when a message is sent
      invalidatesTags: (result, error, { sender, receiver }) => [
        "Chats",
        "UnreadCount",
        { type: "Messages", id: `${sender}-${receiver}` },
        { type: "Messages", id: `${receiver}-${sender}` },
      ],
    }),

    markAsRead: builder.mutation({
      query: (messageIds) => ({
        url: "/messages/mark-read",
        method: "PATCH",
        body: { messageIds },
      }),
      // Invalidate caches to update unread badges
      invalidatesTags: ["Chats", "UnreadCount"],
    }),

    createChat: builder.mutation({
      query: (data) => ({
        url: "/messages/start-chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chats"],
    }),

    uploadMessageImage: builder.mutation({
      query: (formData) => ({
        url: "/messages/upload-image",
        method: "POST",
        body: formData,
      }),
    }),

    getUnreadMessagesCount: builder.query({
      query: () => "/messages/unread-count",
      providesTags: ["UnreadCount"],
    }),

    getUnreadCountByChat: builder.query({
      query: () => "/messages/unread-by-chat",
      providesTags: ["UnreadCount"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetChatsQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useCreateChatMutation,
  useUploadMessageImageMutation,
  useGetUnreadMessagesCountQuery,
  useGetUnreadCountByChatQuery,
} = messageApi;
