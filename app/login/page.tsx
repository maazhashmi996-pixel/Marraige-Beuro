"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Environment variable for API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Callback to handle role-based redirection
    const redirectUser = useCallback((role: string) => {
        if (role === 'admin') {
            router.replace("/admin");
        } else {
            router.replace("/matches");
        }
    }, [router]);

    // Check if user is already logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");
        const loginTime = localStorage.getItem("loginTimestamp");

        // 30 Min check even on mount
        if (loginTime) {
            const isExpired = Date.now() - parseInt(loginTime) > 30 * 60 * 1000;
            if (isExpired) {
                localStorage.clear();
                return;
            }
        }

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user.role) {
                    redirectUser(user.role);
                }
            } catch (e) {
                localStorage.clear();
            }
        }
    }, [redirectUser]);

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
                body: JSON.stringify({ email, password })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server error: Backend is not sending JSON.");
            }

            const data = await response.json();

            if (response.ok && data.success) {
                // --- 1. Save Core Auth Token ---
                localStorage.setItem("userToken", data.token);

                // --- 2. Save Timestamp for 30-min Auto-Logout ---
                localStorage.setItem("loginTimestamp", Date.now().toString());

                // --- 3. Save Gender for Filtering Logic ---
                // Backend se agar gender aa raha hai to save karein, warna default 'female' (agar male user hai)
                const gender = data.user?.gender || "male";
                localStorage.setItem("userGender", gender.toLowerCase());

                // --- 4. Sanitize and Save User Data ---
                const finalUserData = {
                    id: data.user?.id || data.user?._id,
                    name: data.user?.name || "User",
                    role: data.user?.role || "user",
                    gender: gender.toLowerCase(),
                    credits: data.user?.credits ?? data.user?.viewLimit ?? 0,
                    package: data.user?.package || "Basic"
                };

                localStorage.setItem("userData", JSON.stringify(finalUserData));

                // Redirection
                redirectUser(finalUserData.role);
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

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

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Field */}
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

                    {/* Password Field */}
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

                    {/* Submit Button */}
                    <button
                        disabled={loading}
                        className={`w-full py-5 bg-[#c19206] text-white rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#4a1111] hover:shadow-2xl active:scale-95"
                            }`}
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                    </button>
                </form>

                {/* Footer Disclaimer */}
                <p className="mt-8 text-gray-400 text-[11px] font-medium uppercase tracking-widest">
                    Secured by MatchCRM Encryption
                </p>
            </motion.div>
        </div>
    );
}