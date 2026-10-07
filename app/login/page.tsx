"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle, FiUserPlus, FiShield } from "react-icons/fi"; // FiShield add kiya icon ke liye
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const redirectUser = useCallback((role: string) => {
        setIsRedirecting(true);
        const path = role === 'admin' ? "/admin" : "/matches";
        router.replace(path);
    }, [router]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");
        const loginTime = localStorage.getItem("loginTimestamp");

        if (token && userData) {
            if (loginTime) {
                const isExpired = Date.now() - parseInt(loginTime) > 30 * 60 * 1000;
                if (isExpired) {
                    localStorage.clear();
                    return;
                }
            }
            try {
                const user = JSON.parse(userData);
                if (user?.role) redirectUser(user.role);
            } catch (e) {
                localStorage.clear();
            }
        }
    }, [mounted, redirectUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const backendUser = data.user;

                const finalUserData = {
                    id: backendUser.id || backendUser._id,
                    name: backendUser.name || "User",
                    role: backendUser.role || "user",
                    gender: (backendUser.gender || "male").toLowerCase(),
                    credits: backendUser.viewLimit ?? backendUser.credits ?? 0,
                    package: backendUser.package || "Basic Plan"
                };

                localStorage.setItem("userToken", data.token);
                localStorage.setItem("loginTimestamp", Date.now().toString());
                localStorage.setItem("userData", JSON.stringify(finalUserData));
                localStorage.setItem("userGender", finalUserData.gender);
                localStorage.setItem("userCredits", finalUserData.credits.toString());

                redirectUser(finalUserData.role);
            } else {
                setError(data.message || "Invalid credentials.");
                setLoading(false);
            }
        } catch (err: any) {
            setError("Server connection failed.");
            setLoading(false);
        }
    };

    if (!mounted || isRedirecting) {
        return (
            <div className="min-h-screen bg-[#4a1111] flex items-center justify-center">
                <div className="animate-pulse text-[#c19206] font-black text-2xl tracking-tighter">
                    MATCHCRM...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#4a1111] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-[#c19206]"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-[#4a1111] tracking-tighter">
                        MATCH<span className="text-[#c19206]">CRM</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Secure Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                        <div className="relative mt-1">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="email"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206]"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase">Password</label>
                        <div className="relative mt-1">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="password"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206]"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 bg-[#c19206] text-white rounded-2xl font-black text-lg shadow-xl ${loading ? "opacity-70" : "hover:bg-[#4a1111] transition-colors"}`}
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                    </button>
                </form>

                {/* --- REGISTER ADMIN SECTION ADDED --- */}
                <div className="mt-6">
                    <Link
                        href="/register_admin"
                        className="flex items-center justify-center gap-2 text-[#4a1111] hover:text-[#c19206] font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <FiShield /> Register as Admin
                    </Link>
                </div>
                {/* ------------------------------------ */}

                <div className="mt-8 pt-6 border-t border-gray-100 text-gray-400 text-[11px] font-medium tracking-widest uppercase">
                    Secured by MatchCRM Encryption
                </div>
            </motion.div>
        </div>
    );
}