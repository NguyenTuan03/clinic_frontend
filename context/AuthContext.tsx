"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserRegister, UserRole } from "../types";

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, phone: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserRegister | null>(null);
    const router = useRouter();

    // Load user from localStorage on mount (client side only)
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem("clinic_user");
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    localStorage.removeItem("clinic_user");
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const login = (email: string, password: string): boolean => {
        // Mock check password length
        if (password.length < 1) return false;
        const finalRole = email.toLowerCase().endsWith("@clinic.com") ? UserRole.DOCTOR : UserRole.PATIENT;

        // Tạo tên hiển thị đẹp từ email
        const fallbackName = email.split("@")[0].split(/[._-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

        const loggedInUser: User = {
            id: `user-${Date.now()}`,
            name: fallbackName,
            email: email,
            phone: "0999999999",
            role: finalRole
        };

        setUser(loggedInUser);
        localStorage.setItem("clinic_user", JSON.stringify(loggedInUser));
        return true;
    };

    const register = (name: string, email: string, password: string) => {
        const newUser: UserRegister = {
            name: name,
            email: email,
            password: password,
        };
        setUser(newUser);
        localStorage.setItem("clinic_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("clinic_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
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