"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiMoreVertical, FiPaperclip, FiMic } from "react-icons/fi";
import { BsEmojiSmile, BsCheck2All, BsSendFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import Image from "next/image";
import ChatList from "./ChatList";
import { ChatArea } from "./ChatArea";

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
            <div className="md:hidden fixed inset-0 bg-white z-10 flex flex-col">
              {/* Mobile header */}
              <div className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button onClick={() => setActiveChat(null)} className="mr-2 text-gray-600">
                  <IoMdClose size={24} />
                </button>
                <div className="relative mr-3">
                  <Image
                    src={activeChat.avatar}
                    width={40}
                    height={40}
                    alt={activeChat.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeChat.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activeChat.userName}</h3>
                  <p className="text-xs text-gray-500">
                    {activeChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Mobile messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {mockMessages[activeChat.id]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "current" ? "justify-end" : "justify-start"
                      }`}>
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          msg.sender === "current"
                            ? "bg-amber-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow"
                        }`}>
                        <p>{msg.text}</p>
                        <div
                          className={`flex items-center justify-end mt-1 text-xs ${
                            msg.sender === "current" ? "text-amber-100" : "text-gray-400"
                          }`}>
                          <span>{msg.time}</span>
                          {msg.sender === "current" && (
                            <BsCheck2All
                              className={`ml-1 ${msg.read ? "text-blue-300" : "text-amber-100"}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <button className="text-gray-400 hover:text-gray-600 mx-1">
                    <BsEmojiSmile size={20} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 mx-1">
                    <FiPaperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mx-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  {message ? (
                    <button
                      onClick={sendMessage}
                      className="bg-amber-500 text-white rounded-full p-2 mx-1 hover:bg-amber-600 transition-colors">
                      <BsSendFill size={18} />
                    </button>
                  ) : (
                    <button className="text-gray-400 hover:text-gray-600 mx-1">
                      <FiMic size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
