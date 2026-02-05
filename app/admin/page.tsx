"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */
interface Profile {
    id: string;
    title: string;
    age: number | string;
    status: string;
    gender: string;
    city: string;
    image: string;
}

interface Inquiry {
    profileId: string;
    maritalStatus: string;
    gender: string;
    caste: string;
    profession: string;
    city: string;
    country: string;
    qualification: string;
    date?: string;
}

/* ================= COMPONENT ================= */
export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState<"profiles" | "inquiries">("profiles");
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Profile>({
        id: "",
        title: "",
        age: "",
        status: "Single",
        gender: "Male",
        city: "",
        image: "",
    });

    const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });

    const [adminUser, setAdminUser] = useState({
        name: "Admin User",
        role: "Super Admin",
        email: "admin@gmail.com",
        password: "123456",
        avatar: "/admin-avatar.png",
    });

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        // Load admin from localStorage or set defaults
        const savedAdmin = JSON.parse(localStorage.getItem("adminUser") || "null");
        if (savedAdmin) setAdminUser(savedAdmin);
        else localStorage.setItem("adminUser", JSON.stringify(adminUser));

        setProfiles(JSON.parse(localStorage.getItem("profiles") || "[]"));
        setInquiries(JSON.parse(localStorage.getItem("inquiries") || "[]"));
        setIsLoggedIn(localStorage.getItem("isAdmin") === "true");
    }, []);

    /* ================= HANDLERS ================= */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const savedAdmin = JSON.parse(localStorage.getItem("adminUser") || "null");
        if (
            loginCreds.email === savedAdmin.email &&
            loginCreds.password === savedAdmin.password
        ) {
            localStorage.setItem("isAdmin", "true");
            setIsLoggedIn(true);
        } else {
            alert("Invalid Credentials");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        window.location.reload();
    };

    const handleAdminImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedAdmin = { ...adminUser, avatar: reader.result as string };
            setAdminUser(updatedAdmin);
            localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
        };
        reader.readAsDataURL(file);
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
        reader.readAsDataURL(file);
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: Profile[];
        if (editingId) {
            updated = profiles.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p));
            setEditingId(null);
        } else {
            updated = [...profiles, { ...formData, id: `SMB-${Math.floor(100 + Math.random() * 900)}` }];
        }
        setProfiles(updated);
        localStorage.setItem("profiles", JSON.stringify(updated));
        setFormData({ id: "", title: "", age: "", status: "Single", gender: "Male", city: "", image: "" });
    };

    const deleteProfile = (id: string) => {
        if (!confirm("Delete this profile?")) return;
        const filtered = profiles.filter((p) => p.id !== id);
        setProfiles(filtered);
        localStorage.setItem("profiles", JSON.stringify(filtered));
    };

    /* ================= LOGIN SCREEN ================= */
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#4a1111]">
                <motion.form
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-3xl w-full max-w-md shadow-2xl"
                >
                    <h2 className="text-3xl font-black text-center text-[#4a1111] mb-6">
                        Admin Portal
                    </h2>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-4 rounded-2xl bg-gray-50 mb-4"
                        onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 rounded-2xl bg-gray-50 mb-6"
                        onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                    />
                    <button className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-black hover:bg-[#c19206]">
                        Login
                    </button>
                </motion.form>
            </div>
        );
    }

    /* ================= DASHBOARD ================= */
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* SIDEBAR */}
            <aside className="w-72 bg-[#4a1111] text-white p-8 hidden lg:flex flex-col">
                <h1 className="text-2xl font-black mb-10">
                    Match<span className="text-[#c19206]">CRM</span>
                </h1>
                <button
                    onClick={() => setActiveTab("profiles")}
                    className={`p-4 rounded-2xl mb-3 font-bold ${activeTab === "profiles" ? "bg-[#c19206]" : "hover:bg-white/10"
                        }`}
                >
                    Profiles
                </button>
                <button
                    onClick={() => setActiveTab("inquiries")}
                    className={`p-4 rounded-2xl font-bold ${activeTab === "inquiries" ? "bg-[#c19206]" : "hover:bg-white/10"
                        }`}
                >
                    Inquiries ({inquiries.length})
                </button>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-10">
                {/* TOP HEADER */}
                <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow">
                    <div>
                        <h2 className="text-3xl font-black text-[#4a1111]">Admin Dashboard</h2>
                        <p className="text-gray-400 text-sm">Manage system data</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-black">{adminUser.name}</p>
                            <p className="text-xs text-gray-400 uppercase">{adminUser.role}</p>
                        </div>
                        <div className="relative">
                            <img
                                src={adminUser.avatar}
                                className="w-12 h-12 rounded-2xl border-2 border-[#c19206]"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAdminImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-2xl"
                            />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 font-bold hover:bg-red-500 hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <AnimatePresence mode="wait">
                    {activeTab === "profiles" ? (
                        <motion.div key="profiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-2xl font-black mb-6">Profiles ({profiles.length})</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {profiles.map((p) => (
                                    <div key={p.id} className="bg-white p-6 rounded-3xl shadow">
                                        <div className="flex gap-4 items-center">
                                            <img src={p.image} className="w-20 h-20 rounded-2xl object-cover" />
                                            <div>
                                                <h4 className="font-black">{p.title}</h4>
                                                <p className="text-sm text-gray-400">{p.city} • {p.age}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-4 text-sm font-bold">
                                            <button
                                                onClick={() => {
                                                    setEditingId(p.id);
                                                    setFormData(p);
                                                }}
                                                className="text-blue-500"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteProfile(p.id)} className="text-red-500">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="inquiries" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-2xl font-black mb-6">Inquiries</h3>
                            {inquiries.length === 0 && <p className="text-gray-400 italic">No inquiries yet</p>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
