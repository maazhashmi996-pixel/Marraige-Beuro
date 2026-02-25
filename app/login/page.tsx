"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // --- LOGIC: Redirect Function ---
    const redirectUser = useCallback((role: string) => {
        if (role === 'admin') {
            router.push("/admin");
        } else {
            router.push("/matches");
        }
    }, [router]);

    // --- LOGIC: Check session on mount (Prevents re-login) ---
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin' && window.location.pathname !== "/admin") {
                    redirectUser('admin');
                } else if (user.role !== 'admin' && window.location.pathname !== "/matches") {
                    redirectUser('user');
                }
            } catch (e) {
                console.error("Session Error:", e);
                localStorage.clear();
            }
        }
    }, [redirectUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // --- UPDATED LOGIC: Smart Routing ---
            // Pehle hum Admin route try karenge
            let response = await fetch('http://localhost:5000/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data = await response.json();

            // Agar admin route ne mana kar diya (404 ya success false), to user route try karein
            if (!response.ok || data.success === false) {
                console.log("Switching to User Login route...");
                response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                data = await response.json();
            }

            if (response.ok && data.success) {
                // 1. Data Store Karein
                localStorage.setItem("userToken", data.token);

                // Role check: Agar backend se role nahi aa raha to email se guess karein
                const userRole = data.user?.role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
                const userData = data.user || { email, role: userRole };

                localStorage.setItem("userData", JSON.stringify(userData));

                // 2. Immediate Redirect
                redirectUser(userRole);

                // 3. Hard Redirect Backup
                setTimeout(() => {
                    if (window.location.pathname.includes("login")) {
                        window.location.href = userRole === 'admin' ? "/admin" : "/matches";
                    }
                }, 800);

            } else {
                setError(data.message || "Invalid email or password!");
            }
        } catch (err) {
            setError("Server connection failed! Please ensure backend is running.");
            console.error("Login Error:", err);
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

                {/* Error Message Display */}
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
                    {/* Email Input */}
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

                    {/* Password Input */}
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
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                AUTHENTICATING...
                            </span>
                        ) : (
                            "ENTER SYSTEM"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-gray-400 text-[11px] font-medium uppercase tracking-widest">
                    Secured by MatchCRM Encryption
                </p>
            </motion.div>
        </div>
    );
}