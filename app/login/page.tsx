"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Aapka original logic
        if (email === "admin@test.com" && password === "admin123") {
            localStorage.setItem("isAdminLoggedIn", "true");
            router.push("/featured-profiles"); // Check karein aapka dashboard path kya hai
        } else {
            alert("Ghalat email ya password!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-xl overflow-hidden">
                <div className="bg-[#4a1111] py-6 text-center">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Admin Access</h2>
                </div>

                <form onSubmit={handleLogin} className="p-8">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@test.com"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c19206]"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c19206]"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#4a1111] hover:bg-[#360d0d] text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg"
                    >
                        LOGIN TO DASHBOARD
                    </button>
                </form>
            </div>
        </div>
    );
}