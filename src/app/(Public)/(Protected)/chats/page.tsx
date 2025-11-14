"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiMoreVertical, FiPaperclip, FiMic } from "react-icons/fi";
import { BsEmojiSmile, BsCheck2All, BsSendFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import Image from "next/image";
import ChatList from "./ChatList";
import { ChatArea } from "./ChatArea";
import MobileChatView from "./MobileChatView";

// Mock data for chats and messages
const mockChats = [
  {
    id: "1",
    userId: "user2",
    userName: "Amina Designs",
    avatar: "/designer1.jpg",
    lastMessage: "I've completed your dress design",
    time: "10:30 AM",
    unread: 2,
    online: true,
    role: "Designer",
  },
  {
    id: "2",
    userId: "user3",
    userName: "Kente Royalty",
    avatar: "/designer2.jpg",
    lastMessage: "Your order has been shipped",
    time: "Yesterday",
    unread: 0,
    online: false,
    role: "Tailor",
  },
  {
    id: "3",
    userId: "user4",
    userName: "Zainab Couture",
    avatar: "/designer3.jpg",
    lastMessage: "What color would you prefer?",
    time: "2 days ago",
    unread: 1,
    online: true,
    role: "Designer",
  },
];

const mockMessages = {
  "1": [
    {
      id: "m1",
      text: "Hello! I'm working on your Ankara dress design",
      sender: "user2",
      time: "10:00 AM",
      read: true,
    },
    {
      id: "m2",
      text: "I've sent some design options, please let me know what you think",
      sender: "user2",
      time: "10:15 AM",
      read: true,
    },
    {
      id: "m3",
      text: "I like option 2, but can we make the sleeves longer?",
      sender: "current",
      time: "10:20 AM",
      read: true,
    },
    {
      id: "m4",
      text: "I've completed your dress design with the modifications",
      sender: "user2",
      time: "10:30 AM",
      read: false,
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Your Kente outfit is ready for shipping",
      sender: "user3",
      time: "9:00 AM",
      read: true,
    },
    {
      id: "m2",
      text: "Great! When can I expect delivery?",
      sender: "current",
      time: "9:05 AM",
      read: true,
    },
    {
      id: "m3",
      text: "Your order has been shipped and will arrive in 3 days",
      sender: "user3",
      time: "Yesterday",
      read: true,
    },
  ],
  "3": [
    {
      id: "m1",
      text: "I'm starting your custom Adire outfit",
      sender: "user4",
      time: "2 days ago",
      read: true,
    },
    {
      id: "m2",
      text: "What color would you prefer for the embroidery?",
      sender: "user4",
      time: "2 days ago",
      read: false,
    },
  ],
};

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const { user } = useSelector((store: any) => store.shop);

  const filteredChats = mockChats.filter((chat) =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim() && activeChat) {
      // In a real app, you would send this to your backend
      const newMessage = {
        id: `m${Date.now()}`,
        text: message,
        sender: "current",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };

      mockMessages[activeChat.id] = [...(mockMessages[activeChat.id] || []), newMessage];
      setMessage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex h-[70vh]">
          {/* Chat List Sidebar */}
          <ChatList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredChats={filteredChats}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
          />
          {/* Chat Area */}
          <ChatArea
            activeChat={activeChat}
            mockMessages={mockMessages}
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
          />
          {/* Mobile chat view */}
          {activeChat && (
            <MobileChatView
              setActiveChat={setActiveChat}
              activeChat={activeChat}
              mockMessages={mockMessages}
              sendMessage={sendMessage}
              message={message}
              setMessage={setMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
