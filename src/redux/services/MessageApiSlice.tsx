import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../BaseUrl";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Message", "Chat"],
  endpoints: (build) => ({
    // Get chat history (paginated)
    getMessages: build.query({
      query: ({ senderId, receiverId, page = 1, limit = 50 }) => ({
        url: `messages`,
        params: { senderId, receiverId, page, limit },
      }),
      providesTags: ["Message"],
    }),

    // Get user's chat list/conversations
    getChats: build.query({
      query: () => ({
        url: `messages/chats`,       }),
      providesTags: ["Chat"],
    }),

    // Upload message image
    uploadMessageImage: build.mutation({
      query: (formData) => ({
        url: `messages/upload-image`,
        method: "POST",
        body: formData,
      }),
    }),

    // Mark messages as read (batch)
    markAsRead: build.mutation({
      query: (messageIds) => ({
        url: `messages/read`,
        method: "PATCH",
        body: { messageIds },
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetChatsQuery,
  useUploadMessageImageMutation,
  useMarkAsReadMutation,
} = messageApi;
