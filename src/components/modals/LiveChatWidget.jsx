"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { useSocket } from "@/hooks/useSocket";
import { useLiveChat } from "@/hooks/useLiveChat";

export default function LiveChatWidget({ token, role = "user" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const { socket } = useSocket(token);
  const { sendMessage } = useLiveChat(socket, role);

  const messages = useSelector(
    (state) => state.chat.messages["me"] || []
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (messages.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">

      {/* ================= Chat Window ================= */}
      {open && (
        <div
          className="
            absolute bottom-14 sm:bottom-16 right-0
            w-[calc(100vw-32px)] max-w-[320px]
            h-[420px] sm:h-[450px]
            bg-white rounded-2xl
            shadow-2xl
            flex flex-col overflow-hidden
            border border-gray-100
          "
        >
          {/* Header */}
          <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                Customer Support
              </p>
              <p className="text-[11px] text-blue-100">
                We&apos;re here to help
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-blue-700 transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "me"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.type === "me"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2.5 sm:p-3 bg-white border-t flex gap-2">
            <input
              className="
                flex-1 min-w-0
                bg-gray-100
                rounded-full
                px-3 sm:px-4
                py-2
                text-sm
                focus:ring-2
                focus:ring-blue-500
                outline-none
              "
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
            />

            <button
              onClick={handleSend}
              className="
                w-9 h-9
                flex-shrink-0
                flex items-center justify-center
                bg-blue-600
                text-white
                rounded-full
                hover:bg-blue-700
                transition
                active:scale-95
              "
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= Floating Chat Button ================= */}
      <button
        onClick={() => {
          setOpen(!open);
          setUnreadCount(0);
        }}
        className="
          relative top-[-60px] md:top-0
          w-11 h-11
          sm:w-12 sm:h-12
          rounded-full
          bg-blue-600
          text-white
          flex items-center justify-center
          shadow-lg
          hover:bg-blue-700
          hover:scale-105
          transition-all
          active:scale-95
        "
        aria-label="Live Chat"
      >
        {open ? (
          <FiX size={20} />
        ) : (
          <FiMessageCircle size={21} />
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && !open && (
          <span
            className="
              absolute
              -top-1 -right-1
              min-w-[17px] h-[17px]
              px-1
              bg-red-500
              text-white
              text-[9px]
              font-bold
              rounded-full
              flex items-center justify-center
              border-2 border-white
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}