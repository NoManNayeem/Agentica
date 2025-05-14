// src/components/Footer.jsx
"use client";

import Link from "next/link";
import { FiTwitter, FiGithub, FiChevronUp } from "react-icons/fi";

export default function Footer() {
  const scrollToTop = () =>
    typeof window !== "undefined" &&
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & description */}
        <div className="space-y-2">
          <span className="text-2xl font-extrabold text-blue-600">Agentica</span>
          <p className="text-sm">
            Agentic AI Chat platform. Powered by LLMs to automate your tasks
            and streamline workflows.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/chat" className="hover:text-blue-600">
                Chat
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/swagger" className="hover:text-blue-600">
                API Docs
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/NoManNayeem/Agentica"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                GitHub Repo
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Back to Top */}
        <div className="flex flex-col items-start">
          <h4 className="font-semibold mb-2">Connect</h4>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://github.com/NoManNayeem/Agentica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FiTwitter size={20} />
            </a>
            <a
              href="https://github.com/NoManNayeem/Agentica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FiGithub size={20} />
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="mt-auto flex items-center text-sm hover:text-blue-600 focus:outline-none"
          >
            <FiChevronUp className="mr-1" /> Back to top
          </button>
        </div>
      </div>

      <div className="bg-gray-200 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Agentica. All rights reserved.
      </div>
    </footer>
  );
}
