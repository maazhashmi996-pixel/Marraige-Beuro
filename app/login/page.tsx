"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle, FiUserPlus } from "react-icons/fi";
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

    // --- Role-based redirection logic ---
    const redirectUser = useCallback((role: string) => {
        setIsRedirecting(true); // Stop rendering form to prevent flicker
        const path = role === 'admin' ? "/admin" : "/matches";

        // Use replace instead of push to prevent back-button loops
        router.replace(path);
    }, [router]);

    // --- 1. Initial Mount Check ---
    useEffect(() => {
        setMounted(true);
    }, []);

    // --- 2. Session Check (Run only once on mount to prevent loops) ---
    useEffect(() => {
        if (!mounted) return;

        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");
        const loginTime = localStorage.getItem("loginTimestamp");

        if (token && userData) {
            // Expiry Check (30 mins)
            if (loginTime) {
                const isExpired = Date.now() - parseInt(loginTime) > 30 * 60 * 1000;
                if (isExpired) {
                    console.warn("Session expired on login check.");
                    localStorage.clear();
                    return;
                }
            }

            try {
                const user = JSON.parse(userData);
                if (user?.role) {
                    // Agar pehle se login hai, toh seedha andar bhejo
                    redirectUser(user.role);
                }
            } catch (e) {
                console.error("Auth parsing error");
                localStorage.clear();
            }
        }
    }, [mounted, redirectUser]);

    // --- 3. Login Submission ---
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
                // 🔥 CRITICAL: Store everything consistently
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("loginTimestamp", Date.now().toString());

                const finalUserData = {
                    id: data.user?.id || data.user?._id,
                    name: data.user?.name || "User",
                    role: data.user?.role || "user",
                    gender: (data.user?.gender || "male").toLowerCase(),
                    credits: data.user?.credits ?? 0,
                    package: data.user?.package || "Basic"
                };

                localStorage.setItem("userData", JSON.stringify(finalUserData));
                localStorage.setItem("userGender", finalUserData.gender);

                // Success redirect
                redirectUser(finalUserData.role);
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
                setLoading(false);
            }
        } catch (err: any) {
            setError("Server connection failed. Is your backend running?");
            setLoading(false);
        }
    };

    // --- Loop Guard: Don't render anything while checking or redirecting ---
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
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-[#c19206]"
            >
                {/* Logo Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-[#4a1111] tracking-tighter">
                        MATCH<span className="text-[#c19206]">CRM</span>
                    </h1>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <div className="h-[1px] w-8 bg-gray-200"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Portal</p>
                        <div className="h-[1px] w-8 bg-gray-200"></div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border border-red-100"
                    >
                        <FiAlertCircle className="shrink-0" /> {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative mt-1">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="email"
                                placeholder="example@mail.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206] transition-all font-medium text-gray-700"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                    </div>

                    <div className="relative text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                        <div className="relative mt-1">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206] transition-all font-medium text-gray-700"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 bg-[#c19206] text-white rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#4a1111] hover:shadow-2xl active:scale-95"}`}
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                    </button>
                </form>

                {/* Admin Setup Link */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-gray-500 text-sm mb-4">Need to initialize the system?</p>
                    <Link href="/register_admin">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 border-2 border-[#c19206] text-[#c19206] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c19206] hover:text-white transition-all cursor-pointer"
                        >
                            <FiUserPlus /> SETUP ADMIN ACCOUNT
                        </motion.div>
                    </Link>
                </div>

                <p className="mt-8 text-gray-400 text-[11px] font-medium uppercase tracking-widest">
                    Secured by MatchCRM Encryption
                </p>
            </motion.div>
        </div>
    );
}