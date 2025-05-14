// src/app/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 mt-6">
      {/* Decorative background blobs */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="container mx-auto px-4 py-24 flex flex-col-reverse lg:flex-row items-center">
        {/* Text content */}
        <div className="relative z-10 lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900">
            Welcome to <span className="text-blue-600">Agentica</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-md mx-auto lg:mx-0">
            Agentica is an agentic AI chat platform powered by the latest LLMs.
            Sign up or log in to start intelligent conversations and automate tasks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium transition"
            >
              Sign Up <FiUserPlus className="ml-2 animate-bounce" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 hover:bg-blue-50 text-blue-600 rounded-md text-base font-medium transition"
            >
              Log In <FiLogIn className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative z-10 lg:w-1/2 mb-12 lg:mb-0">
          <Image
            src="/agentica.png"
            alt="Agentica chat illustration"
            width={600}
            height={400}
            className="mx-auto"
            priority
          />

        </div>
      </div>
    </section>
  );
}
