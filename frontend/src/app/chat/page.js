// src/app/chat/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiSend, FiLoader, FiLogOut } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);           // { sender, text, timestamp }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // Initialize: load or create session, then fetch history
  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = localStorage.getItem("agenticaAccessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      try {
        // 1) fetch existing sessions
        let res = await fetch(`${API_URL}/chat/sessions/`, { headers });
        if (!res.ok) throw new Error("Could not load sessions");
        const sessions = await res.json();
        let sid = sessions[0]?.id;

        // 2) create one if none
        if (!sid) {
          res = await fetch(`${API_URL}/chat/sessions/`, {
            method: "POST",
            headers,
            body: JSON.stringify({}),
          });
          if (!res.ok) throw new Error("Could not create session");
          const newSession = await res.json();
          sid = newSession.id;
        }
        setSessionId(sid);

        // 3) load history
        res = await fetch(`${API_URL}/chat/sessions/${sid}/`, { headers });
        if (!res.ok) throw new Error("Could not load chat history");
        const { messages: history } = await res.json();
        setMessages(history.map(m => ({
          sender: m.sender,
          text: m.content,
          timestamp: m.timestamp,
        })));
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setInitLoading(false);
      }
    })();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Enter to send, Shift+Enter newline
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    const token = localStorage.getItem("agenticaAccessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch(`${API_URL}/chat/messages/`, {
        method: "POST",
        headers,
        body: JSON.stringify({ session: sessionId, content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Send failed");

      // Append user & bot messages
      setMessages(prev => [
        ...prev,
        { sender: data.user_message.sender, text: data.user_message.content, timestamp: data.user_message.timestamp },
        { sender: data.bot_message.sender,  text: data.bot_message.content,  timestamp: data.bot_message.timestamp },
      ]);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-3xl text-gray-500" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error || "Unable to start chat."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow rounded-lg mt-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Agentica Chat</h2>
        
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-lg shadow mb-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="block text-xs text-gray-500 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg animate-pulse">
              ...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-full disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {loading
              ? <FiLoader className="animate-spin text-white" />
              : <FiSend size={20} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
