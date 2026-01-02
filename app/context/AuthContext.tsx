// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  branch_code: number
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // Sync access token with API client whenever it changes
  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  // Try to refresh token on mount
  useEffect(() => {
    refreshAccessToken().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    setAccessToken(data.accessToken); // Stored in memory
    setUser(data.user);

    // Store user info in sessionStorage
    sessionStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccessToken(null);
    setUser(null);

    // Clear sessionStorage
    sessionStorage.removeItem("user");

    router.push("/login");
//    router.push("/pos/dashboard/dash01");
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      setAccessToken(data.accessToken); // Stored in memory

      // If we have user data, keep it; otherwise try to get it
      if (!user && data.user) {
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      return data.accessToken;
    } catch (error) {

      console.error("Token refresh failed:", error);
    router.push("/pos/dashboard/dash01");

      setAccessToken(null);
      setUser(null);
      sessionStorage.removeItem("user");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        refreshAccessToken,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
