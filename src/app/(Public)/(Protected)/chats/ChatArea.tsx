import Image from "next/image";
import React, { useState, useRef } from "react";
import { BsCheck2All, BsEmojiSmile, BsSendFill } from "react-icons/bs";
import { FiMic, FiMoreVertical, FiPaperclip, FiX } from "react-icons/fi";
import { format } from "date-fns";

interface User {
  id: string;
  _id?: string;
  firstName: string;
  surname: string;
  avatar?: string;
  role?: string;
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

interface ChatAreaProps {
  activeChat: Chat | null;
  messages: Message[];
  sendMessage: (content: string, image?: string) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  currentUserId: string;
  isSending: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  markMessagesAsRead?: (messageIds: string[]) => void;
  isLoadingMessages: boolean;
}

export const ChatArea = ({
  activeChat,
  messages,
  sendMessage,
  newMessage,
  setNewMessage,
  currentUserId,
  isSending,
  onImageUpload,
  markMessagesAsRead,
  isLoadingMessages,
}: ChatAreaProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get user ID from message sender
  const getSenderId = (sender: User): string => {
    return sender.id || sender._id || "";
  };

  const handleSendMessage = async () => {
    if (isSending || isUploadingImage) return;

    // Check if we have either text or image
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let imageUrl: string | undefined;

      // Upload image if one is selected
      if (selectedFile && onImageUpload) {
        setIsUploadingImage(true);
        imageUrl = await onImageUpload(selectedFile);
      }

      // Send message with text and/or image
      sendMessage(newMessage.trim() || "", imageUrl);

      // Clear inputs
      setNewMessage("");
      clearImagePreview();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!activeChat) {
    return (
      <div className="hidden md:flex md:flex-col w-2/3">
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <BsSendFill size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500 max-w-md">
            Choose an existing chat from the sidebar or start a new conversation with one of our
            designers or tailors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:flex-col w-2/3">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="relative mr-3">
          <Image
            src={activeChat.avatar || "/avatar.jpg"}
            width={40}
            height={40}
            alt={activeChat.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{activeChat.userName}</h3>
          <p className="text-xs text-gray-500">Online • {activeChat.role}</p>
        </div>
        <button title="vertical" className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {isLoadingMessages ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full mb-4 flex items-center justify-center mx-auto">
              <BsSendFill className="text-amber-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h4>
            <p className="text-gray-500">Send your first message to {activeChat.userName}!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const senderId = getSenderId(msg.sender);
              const isCurrentUser = senderId === currentUserId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? "bg-amber-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow"
                    }`}>
                    {msg.image && (
                      <div className="mb-2">
                        <Image
                          src={msg.image}
                          alt="Message image"
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                    <div
                      className={`flex items-center justify-end mt-1 text-xs ${
                        isCurrentUser ? "text-amber-100" : "text-gray-400"
                      }`}>
                      <span>{format(new Date(msg.timestamp || msg.createdAt), "h:mm a")}</span>
                      {isCurrentUser && (
                        <BsCheck2All
                          className={`ml-1 ${msg.read ? "text-blue-300" : "text-amber-100"}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Preview"
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />
            <button
              onClick={clearImagePreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove image">
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <button title="emoji" className="text-gray-400 hover:text-gray-600 mx-2">
            <BsEmojiSmile size={20} />
          </button>
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-gray-400 hover:text-gray-600 mx-2">
            <FiPaperclip size={20} />
            <input
              ref={fileInputRef}
              title="imageUpload"
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={isSending || isUploadingImage}
            />
          </label>
          <input
            type="text"
            placeholder={imagePreview ? "Add a caption..." : "Type your message..."}
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mx-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending || isUploadingImage}
          />
          {newMessage.trim() || imagePreview ? (
            <button
              title="sendMessage"
              onClick={handleSendMessage}
              disabled={isSending || isUploadingImage}
              className="bg-amber-500 text-white rounded-full p-2 mx-2 hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSending || isUploadingImage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <BsSendFill size={18} />
              )}
            </button>
          ) : (
            <button title="mic" className="text-gray-400 hover:text-gray-600 mx-2">
              <FiMic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
