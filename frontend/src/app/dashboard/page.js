// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiActivity,
  FiUser,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
} from "react-icons/fi";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("agenticaAccessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        // 1) Fetch user + profile
        const resUser = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me/`,
          { headers }
        );
        if (!resUser.ok) throw new Error("Failed to load user data");
        const userJson = await resUser.json();
        setUserData(userJson);

        // 2) Fetch chat sessions (includes nested messages)
        const resSessions = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/`,
          { headers }
        );
        if (!resSessions.ok) throw new Error("Failed to load chat sessions");
        const sessionsJson = await resSessions.json();
        setSessions(sessionsJson);
      } catch (e) {
        console.error(e);
        setError(e.message);
        // If token expired or user invalid, log out
        if (e.message.includes("Failed to load user data")) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user, router, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-500">Loading dashboard…</div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  // Compute actual stats
  const totalMessages = sessions.reduce(
    (sum, session) => sum + (session.messages?.length || 0),
    0
  );
  const activeSessions = sessions.length;
  const completeness = Math.floor(
    ((userData.profile.address ? 1 : 0) +
      (userData.profile.phone ? 1 : 0) +
      (userData.profile.photo ? 1 : 0)) /
      3 *
      100
  );

  const stats = [
    {
      label: "Total Messages",
      value: totalMessages,
      icon: FiMessageSquare,
    },
    {
      label: "Active Sessions",
      value: activeSessions,
      icon: FiActivity,
    },
    {
      label: "Profile Completeness",
      value: `${completeness}%`,
      icon: FiUser,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back,{" "}
          <span className="text-blue-600">{userData.username}</span>!
        </h1>
      </div>

      {/* Profile summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col md:flex-row md:items-center md:space-x-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mb-4 md:mb-0">
          {userData.profile.photo ? (
            <img
              src={userData.profile.photo}
              alt={`${userData.username} avatar`}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-600">
              <FiUser size={40} className="text-gray-400" />
            </div>
          )}
        </div>
        {/* Details */}
        <div className="flex-1 space-y-2">
          {userData.profile.address && (
            <div className="flex items-center text-gray-700">
              <FiMapPin className="mr-2" />
              <span>{userData.profile.address}</span>
            </div>
          )}
          {userData.profile.phone && (
            <div className="flex items-center text-gray-700">
              <FiPhone className="mr-2" />
              <span>{userData.profile.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white shadow rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <div className="p-3 bg-blue-50 rounded-full">
              <Icon className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-gray-600">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
