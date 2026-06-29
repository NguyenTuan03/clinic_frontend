"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user from Cookie on mount (client side only)
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = Cookies.get("clinic_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          Cookies.remove("clinic_user");
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    setUser(null);
    Cookies.remove("clinic_token", { path: "/" });
    Cookies.remove("clinic_user", { path: "/" });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}