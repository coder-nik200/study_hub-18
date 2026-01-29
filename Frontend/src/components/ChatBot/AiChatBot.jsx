import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import { Bot, RotateCcw, Send, X } from "lucide-react";

function AiChatBot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW

  const chatEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  const resetChat = () => {
    setChat([]);
    setMessage("");
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return; // ✅ block spam

    const userText = message;
    setMessage("");
    setLoading(true);

    // show user message immediately
    setChat((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      const res = await api.post("/chat", { message: userText });

      setChat((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#5028c9] text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
      >
        <Bot />
      </button>

      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-20 right-6 w-[360px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-[#5028c9] text-white py-3 px-4 font-semibold flex justify-between items-center">
            <span className="flex gap-2">
              <Bot /> StudyHub AI Assistant
            </span>
            <div className="flex gap-3">
              <button onClick={resetChat}>
                <RotateCcw size={18} />
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[280px] p-3 space-y-2 overflow-y-auto bg-gray-100">
            {chat.length === 0 && (
              <p className="text-gray-400 text-sm text-center">
                Start chatting with the bot ✨
              </p>
            )}

            {chat.map((c, i) => (
              <div
                key={i}
                className={`flex ${
                  c.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 text-sm rounded-xl whitespace-pre-wrap ${
                    c.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-gray-200 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-3 py-2 rounded-xl text-sm text-gray-600 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-500">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 text-sm border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-[#5028c9] text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-900 transition"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center p-1">
            StudyBot may make mistakes.
          </p>
        </div>
      )}
    </>
  );
}

export default AiChatBot;
