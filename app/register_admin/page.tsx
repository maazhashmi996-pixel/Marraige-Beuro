"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiAlertCircle, FiUser, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAdminExists, setIsAdminExists] = useState(false);

    // Check if admin already exists on load
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                // Hum login route ya ek dummy request se check kar sakte hain
                // Lekin behtar hai seedha register hit karein, backend block kar dega
            } catch (err) {
                console.error("Check failed");
            }
        };
        checkAdmin();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/setup/admin-init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success! Redirect to login after 2 seconds
                setIsAdminExists(true);
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.message || "Admin setup failed. Maybe admin already exists?");
                if (data.message?.includes("exists")) setIsAdminExists(true);
            }
        } catch (err: any) {
            setError("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    if (isAdminExists) {
        return (
            <div className="min-h-screen bg-[#4a1111] flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
                    <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#4a1111]">Admin Already Configured</h2>
                    <p className="text-gray-500 mt-2">The system already has a Super Admin. Manual registration is locked for security.</p>
                    <button onClick={() => router.push("/login")} className="mt-6 w-full py-4 bg-[#c19206] text-white rounded-2xl font-bold">GO TO LOGIN</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#4a1111] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-[#c19206]"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#4a1111]">ADMIN <span className="text-[#c19206]">SETUP</span></h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">One-time System Initialization</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                        <div className="relative mt-1">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="Admin Name"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206]"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                        <div className="relative mt-1">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="email"
                                placeholder="admin@system.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206]"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="ml-4 text-[10px] font-bold text-gray-400 uppercase">Secure Password</label>
                        <div className="relative mt-1">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 ring-[#c19206]"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-[#4a1111] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#c19206] transition-all"
                    >
                        {loading ? "INITIALIZING..." : "CREATE ADMIN ACCOUNT"}
                    </button>
                </form>

                <p className="mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    This page will be locked after first use
                </p>
            </motion.div>
        </div>
    );
}