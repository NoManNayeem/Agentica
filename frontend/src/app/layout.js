// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// load Geist Sans & Geist Mono into CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agentica",
  description: "Agentic AI Chat powered by LLMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body
        className={`${geistMono.variable} antialiased flex flex-col min-h-screen
                    bg-gradient-to-br from-blue-50 via-white to-blue-50
                    text-gray-900 transition-colors duration-300`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
