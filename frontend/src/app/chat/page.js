"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiSend, FiLoader } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Initialize chat session
  useEffect(() => {
  if (!user) return;

  const fetchSession = async () => {
    const token = localStorage.getItem("agenticaAccessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Try to fetch existing sessions
      let res = await fetch(`${API_URL}/chat/sessions/`, { headers });

      if (!res.ok) {
        const errorBody = await res.text(); // Fallback if JSON fails
        console.error("Session fetch failed", res.status, errorBody);
        throw new Error("Could not load sessions. Please try again later.");
      }

      const sessions = await res.json();
      let sid = sessions[0]?.id;

      // If no session exists, create one
      if (!sid) {
        res = await fetch(`${API_URL}/chat/sessions/`, {
          method: "POST",
          headers,
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          const errorBody = await res.text();
          console.error("Session creation failed", res.status, errorBody);
          throw new Error("Could not create session. Please try again later.");
        }

        const newSession = await res.json();
        sid = newSession.id;
      }

      setSessionId(sid);

      // Fetch session messages
      res = await fetch(`${API_URL}/chat/sessions/${sid}/`, { headers });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error("Chat history fetch failed", res.status, errorBody);
        throw new Error("Could not load chat history.");
      }

      const { messages: history } = await res.json();
      setMessages(
        history.map((m) => ({
          sender: m.sender,
          text: m.content,
          timestamp: m.timestamp,
        }))
      );
    } catch (e) {
      console.error("Chat initialization error:", e);
      setError(e.message || "An unknown error occurred.");
    } finally {
      setInitLoading(false);
    }
  };

  fetchSession();
}, [user]);


  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle message send
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

      setMessages((prev) => [
        ...prev,
        {
          sender: data.user_message.sender,
          text: data.user_message.content,
          timestamp: data.user_message.timestamp,
        },
        {
          sender: data.bot_message.sender,
          text: data.bot_message.content,
          timestamp: data.bot_message.timestamp,
        },
      ]);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) sendMessage();
    }
  };

  if (initLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FiLoader className="animate-spin text-3xl text-gray-500" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-600">
        {error || "Unable to start chat."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900">Agentica Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-lg shadow space-y-4 max-h-[60vh]">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-100 text-gray-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
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

      {/* Input Box */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            {loading ? (
              <FiLoader className="animate-spin text-white" />
            ) : (
              <FiSend size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
