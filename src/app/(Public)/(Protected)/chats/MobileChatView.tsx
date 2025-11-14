import Image from "next/image";
import React from "react";
import { BsCheck2All, BsEmojiSmile, BsSendFill } from "react-icons/bs";
import { FiMic, FiPaperclip } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const MobileChatView = ({
  setActiveChat,
  activeChat,
  mockMessages,
  sendMessage,
  message,
  setMessage,
}: any) => {
  return (
    <div className="md:hidden fixed inset-0 bg-white z-10 flex flex-col">
      {/* Mobile header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button
          title="setActiveChat"
          onClick={() => setActiveChat(null)}
          className="mr-2 text-gray-600">
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
          <p className="text-xs text-gray-500">{activeChat.online ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Mobile messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {mockMessages[activeChat.id]?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "current" ? "justify-end" : "justify-start"}`}>
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
          <button title="smile" className="text-gray-400 hover:text-gray-600 mx-1">
            <BsEmojiSmile size={20} />
          </button>
          <button title="paperClip" className="text-gray-400 hover:text-gray-600 mx-1">
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
              title="sendMessage"
              onClick={sendMessage}
              className="bg-amber-500 text-white rounded-full p-2 mx-1 hover:bg-amber-600 transition-colors">
              <BsSendFill size={18} />
            </button>
          ) : (
            <button title="mic" className="text-gray-400 hover:text-gray-600 mx-1">
              <FiMic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileChatView;
