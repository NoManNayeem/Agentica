// src/components/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiMessageSquare,
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkBase = "flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold text-blue-600">
              Agentica
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user && (
              <span className="flex items-center space-x-2 text-gray-700">
                <FiUser size={20} />
                <span className="font-medium">{user.username}</span>
              </span>
            )}

            {user ? (
              <>
                <Link href="/dashboard" className={linkBase}>
                  <FiHome className="mr-2" /> Dashboard
                </Link>
                <Link href="/chat" className={linkBase}>
                  <FiMessageSquare className="mr-2" /> Chat
                </Link>
                <button onClick={logout} className={linkBase}>
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
                  Register
                </Link>
                <Link href="/login" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <span className="flex items-center px-3 py-2 text-gray-700">
                  <FiUser className="mr-2" /> {user.username}
                </span>
                <Link href="/dashboard" className={linkBase}>
                  <FiHome className="mr-2" /> Dashboard
                </Link>
                <Link href="/chat" className={linkBase}>
                  <FiMessageSquare className="mr-2" /> Chat
                </Link>
                <button
                  onClick={logout}
                  className={`w-full text-left ${linkBase}`}
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
                  Register
                </Link>
                <Link href="/login" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
