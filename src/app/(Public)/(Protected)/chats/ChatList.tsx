import Image from "next/image";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

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

interface ChatListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredChats: Chat[];
  setActiveChat: (chat: Chat) => void;
  activeChat: Chat | null;
}

const ChatList = ({
  searchTerm,
  setSearchTerm,
  filteredChats,
  setActiveChat,
  activeChat,
}: ChatListProps) => {
  return (
    <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        <div className="relative mt-3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations found</p>
            <p className="text-sm mt-1">
              {searchTerm ? "Try a different search term" : "Start a new conversation"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeChat?._id === chat._id ? "bg-amber-50" : ""
              }`}>
              <div className="relative mr-3">
                <Image
                  src={chat.avatar || "/avatar.jpg"}
                  width={48}
                  height={48}
                  alt={chat.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">{chat.userName}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {chat.isLastMessageFromMe ? "You: " : ""}
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-amber-500 text-white text-xs font-bold h-5 min-w-5 rounded-full flex items-center justify-center px-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{chat.role}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
