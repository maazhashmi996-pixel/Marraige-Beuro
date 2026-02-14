"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Dummy Check (Yahan aap apni marzi ka email/pass rakh saktay hain)
        if (email === "admin@test.com" && password === "admin123") {
            localStorage.setItem("isAdminLoggedIn", "true");
            router.push("/dashboard"); // Dashboard ka path yahan likhein
        } else {
            alert("Ghalat email ya password!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                <input
                    type="email" placeholder="Email"
                    className="w-full p-2 mb-4 border"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Password"
                    className="w-full p-2 mb-4 border"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-[#4a1111] text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}