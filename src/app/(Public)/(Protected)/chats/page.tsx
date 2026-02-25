"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { BsSendFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/redux/Store";
import {
  useGetMessagesQuery,
  useGetChatsQuery,
  useUploadMessageImageMutation,
  useMarkAsReadMutation,
  useCreateChatMutation,
  useGetUnreadMessagesCountQuery,
} from "@/redux/services/MessageApiSlice";
import { useGetStylistDetailQuery } from "@/redux/services/StylistApiSlice";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/redux/SocketContext";
import { ChatArea } from "./ChatArea";

// Types
interface User {
  id: string;
  _id?: string;
  firstName: string;
  surname: string;
  avatar?: string;
  role?: string;
  companyName?: string;
}

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  image?: string;
  read: boolean;
  timestamp: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  userId: string;
  userName: string;
  avatar: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isLastMessageFromMe: boolean;
}

const ChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stylistId = searchParams.get("stylist");
  const owner = searchParams.get("owner");

  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [realTimeMessages, setRealTimeMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCreatedChat, setHasCreatedChat] = useState(false);
  const hasInitializedRef = useRef(false);

  const { user } = useSelector((store: RootState) => store.authSlice);
  const { socket, isConnected } = useSocket();

  const userId = user?.id || user?._id;

  // Fetch stylist data
  const { data: stylistData } = useGetStylistDetailQuery(stylistId || "", {
    skip: !stylistId || !userId,
  });

  // API Hooks
  const {
    data: chatsData,
    isLoading: isLoadingChats,
    refetch: refetchChats,
  } = useGetChatsQuery(undefined, {
    skip: !userId,
  });

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    {
      senderId: userId || "",
      receiverId: activeChat?.userId || "",
      page: 1,
      limit: 50,
    },
    {
      skip: !activeChat || !userId,
    },
  );

  const [uploadMessageImage] = useUploadMessageImageMutation();
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [createChat] = useCreateChatMutation();
  const { refetch: refetchUnreadCount } = useGetUnreadMessagesCountQuery(undefined, {
    skip: !userId,
  });

  // Filter chats
  const filteredChats = (chatsData?.data || []).filter((chat: Chat) =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Combine messages and remove duplicates
  const messages = useMemo(() => {
    const apiMessages = messagesData?.data || [];
    const allMessages = [...apiMessages, ...realTimeMessages];

    // Remove duplicates based on _id
    const uniqueMessages = allMessages.reduce((acc, current) => {
      const exists = acc.find((msg: any) => msg._id === current._id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as Message[]);

    // Sort by timestamp
    return uniqueMessages.sort(
      (a: any, b: any) =>
        new Date(a.timestamp || a.createdAt).getTime() -
        new Date(b.timestamp || b.createdAt).getTime(),
    );
  }, [messagesData?.data, realTimeMessages]);

  // Helper functions (defined before useEffect that uses them)
  const markMessagesAsRead = async (messageIds: string[]) => {
    if (messageIds.length === 0) return;

    try {
      await markAsReadMutation(messageIds).unwrap();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadMessageImage(formData).unwrap();
      return response.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  // Clear realTimeMessages when switching chats
  useEffect(() => {
    setRealTimeMessages([]);
  }, [activeChat?._id]);

  // Auto-mark messages as read when viewing a chat
  useEffect(() => {
    if (!activeChat || !userId || messages.length === 0) return;

    // Find unread messages where current user is receiver
    const unreadMessageIds = messages
      .filter((msg: any) => {
        const receiverId = msg.receiver.id || msg.receiver._id;
        return receiverId === userId && !msg.read;
      })
      .map((msg: any) => msg._id)
      .filter((id: any) => !id.startsWith("temp-")); // Don't try to mark temp messages as read

    if (unreadMessageIds.length > 0) {
      // Mark as read after a short delay (so user has time to see the messages)
      const timer = setTimeout(async () => {
        await markMessagesAsRead(unreadMessageIds);
        refetchUnreadCount(); // Update navbar count
        refetchChats(); // Update chat list unread badges
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeChat, userId, messages, refetchChats, refetchUnreadCount]);

  // Initialize chat with stylist
  const initializeChat = async () => {
    const targetOwnerId = owner || stylistData?.stylist?.owner?._id;
    if (!targetOwnerId || !userId || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    try {
      const existingChat = filteredChats.find((chat: Chat) => chat.userId === targetOwnerId);

      if (existingChat) {
        setActiveChat(existingChat);
        setIsLoading(false);
        return;
      }

      const result = await createChat({ receiverId: targetOwnerId }).unwrap();

      if (result.success) {
        setHasCreatedChat(true);
        const { data: newChatsData } = await refetchChats();
        const newChat = newChatsData?.data?.find((chat: Chat) => chat.userId === targetOwnerId);

        if (newChat) {
          setActiveChat(newChat);
        } else {
          const stylist = stylistData?.stylist;
          const tempChat: Chat = {
            _id: `temp-${targetOwnerId}`,
            userId: targetOwnerId,
            userName: stylist?.companyName || "Stylist",
            avatar: stylist?.avatar || "/avatar.jpg",
            role: stylist?.owner?.role || "stylist",
            lastMessage: "Start a conversation...",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            isLastMessageFromMe: false,
          };
          setActiveChat(tempChat);
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("Failed to initialize chat:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stylistId && userId && stylistData?.stylist) {
      initializeChat();
    } else if (!stylistId && userId && !isLoadingChats) {
      setIsLoading(false);
    }
  }, [stylistId, userId, stylistData, isLoadingChats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Socket handlers
  useEffect(() => {
    if (!socket || !userId || !activeChat) return;

    const handleNewMessage = (message: Message) => {
      const senderId = message.sender.id || message.sender._id;
      const receiverId = message.receiver.id || message.receiver._id;

      if (senderId === activeChat.userId || receiverId === activeChat.userId) {
        setRealTimeMessages((prev) => {
          // Check if message already exists
          const exists = prev.find((msg) => msg._id === message._id);
          if (exists) {
            console.log("Message already exists, skipping:", message._id);
            return prev;
          }
          return [...prev, message];
        });
      }

      // Refetch chats to update unread badges
      refetchChats();
    };

    const handleMessageUpdated = (message: Message) => {
      setRealTimeMessages((prev) => prev.map((msg) => (msg._id === message._id ? message : msg)));
      // Refetch chats when messages are updated (read status changed)
      refetchChats();
    };

    const handleMessageDeleted = (message: Message) => {
      setRealTimeMessages((prev) => prev.filter((msg) => msg._id !== message._id));
      refetchChats();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, userId, activeChat, refetchChats]);

  // Send message
  const sendMessage = async (content: string, image?: string) => {
    if (!userId || !activeChat || (!content.trim() && !image)) return;

    setIsSending(true);
    const messageContent = content.trim();

    try {
      if (activeChat._id.startsWith("temp-") && !hasCreatedChat) {
        try {
          await createChat({ receiverId: activeChat.userId }).unwrap();
          setHasCreatedChat(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Failed to create backend chat:", error);
        }
      }

      const messageData: any = {
        sender: userId,
        receiver: activeChat.userId,
      };

      // Add content only if it exists
      if (messageContent) {
        messageData.content = messageContent;
      }

      // Add image if it exists
      if (image) {
        messageData.image = image;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;

      const optimisticMessage: Message = {
        _id: tempId,
        sender: {
          id: userId,
          _id: userId,
          firstName: user?.firstName || "",
          surname: user?.surname || "",
          avatar: user?.avatar,
          role: user?.role,
        },
        receiver: {
          id: activeChat.userId,
          _id: activeChat.userId,
          firstName: activeChat.userName.split(" ")[0],
          surname: activeChat.userName.split(" ")[1] || "",
          avatar: activeChat.avatar,
          role: activeChat.role,
        },
        content: messageContent,
        image: image,
        read: false,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      setRealTimeMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");

      if (socket && socket.connected) {
        socket.emit("sendMessage", messageData);

        socket.once("messageSent", (response: any) => {
          console.log("Message sent confirmation:", response);

          if (response.success && response.messageId) {
            // Remove temp message - real one comes via newMessage
            setRealTimeMessages((prev) => prev.filter((msg) => msg._id !== tempId));

            setTimeout(() => {
              refetchChats();
              refetchMessages();
            }, 500);
          }
        });

        socket.once("messageError", (error: any) => {
          console.error("Message error:", error);
          setRealTimeMessages((prev) => prev.filter((msg) => msg._id !== tempId));
          alert(`Failed to send message: ${error.error}`);
        });
      } else {
        setRealTimeMessages((prev) => prev.filter((msg) => msg._id !== tempId));
        alert("Connection lost. Please refresh the page.");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat system...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!userId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the messaging system.</p>
          <button
            onClick={() =>
              router.push(`/login?redirect=/chats${stylistId ? `?stylist=${stylistId}` : ""}`)
            }
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        {socket && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex h-[70vh]">
          {/* Chat List Sidebar */}
          <div className="hidden md:flex flex-col w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <div className="mt-3 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingChats ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start messaging with stylists!</p>
                </div>
              ) : (
                filteredChats.map((chat: Chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeChat?._id === chat._id ? "bg-amber-50" : ""
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Image
                          src={chat.avatar || "/avatar.jpg"}
                          alt={chat.userName}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 truncate">{chat.userName}</h3>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(chat.lastMessageTime), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.isLastMessageFromMe ? "You: " : ""}
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {activeChat ? (
            <ChatArea
              activeChat={activeChat}
              messages={messages}
              sendMessage={sendMessage}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              currentUserId={userId}
              isSending={isSending}
              onImageUpload={handleImageUpload}
              markMessagesAsRead={markMessagesAsRead}
              isLoadingMessages={isLoadingMessages}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <BsSendFill size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 max-w-md">
                Choose an existing chat from the sidebar or start a new conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
