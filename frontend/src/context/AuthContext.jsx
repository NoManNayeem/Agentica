// src/context/AuthContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  authFetch: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Keys in localStorage
  const KEY_USER = "agenticaUser";
  const KEY_ACCESS = "agenticaAccessToken";
  const KEY_REFRESH = "agenticaRefreshToken";

  // Helper to get tokens
  const getAccessToken = () => localStorage.getItem(KEY_ACCESS);
  const getRefreshToken = () => localStorage.getItem(KEY_REFRESH);

  // Log user out
  const logout = useCallback(() => {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_USER);
    setUser(null);
    router.push("/login");
  }, [router]);

  // Log user in and persist
  const login = async ({ access, refresh, user: u }) => {
    localStorage.setItem(KEY_ACCESS, access);
    localStorage.setItem(KEY_REFRESH, refresh);
    localStorage.setItem(KEY_USER, JSON.stringify(u));
    setUser(u);
  };

  // Wrapped fetch: attach token, logout on 401
  const authFetch = useCallback(
    async (url, opts = {}) => {
      const token = getAccessToken();
      const headers = {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      };
      const res = await fetch(url, { ...opts, headers });
      if (res.status === 401) {
        logout();
        throw new Error("Unauthorized");
      }
      return res;
    },
    [logout]
  );

  // On mount: hydrate user from storage
  useEffect(() => {
    const storedUser = localStorage.getItem(KEY_USER);
    const token = getAccessToken();
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
