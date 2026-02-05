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
        if (loginCreds.email === adminUser.email && loginCreds.password === adminUser.password) {
            localStorage.setItem("isAdmin", "true");
            setIsLoggedIn(true);
        } else {
            alert("Ghalat Email ya Password!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        window.location.reload();
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
            const newId = `SMB-${Math.floor(100 + Math.random() * 900)}`;
            updated = [...profiles, { ...formData, id: newId }];
        }
        setProfiles(updated);
        localStorage.setItem("profiles", JSON.stringify(updated));
        // Reset Form
        setFormData({ id: "", title: "", age: "", status: "Single", gender: "Male", city: "", image: "" });
        alert("Profile Successfully Save Ho Gai!");
    };

    const deleteProfile = (id: string) => {
        if (!confirm("Kya aap waqai ye profile delete karna chahte hain?")) return;
        const filtered = profiles.filter((p) => p.id !== id);
        setProfiles(filtered);
        localStorage.setItem("profiles", JSON.stringify(filtered));
    };

    const deleteInquiry = (index: number) => {
        const updated = inquiries.filter((_, i) => i !== index);
        setInquiries(updated);
        localStorage.setItem("inquiries", JSON.stringify(updated));
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#4a1111]">
                <motion.form
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-3xl w-full max-w-md shadow-2xl"
                >
                    <h2 className="text-3xl font-black text-center text-[#4a1111] mb-6">Admin Portal</h2>
                    <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-gray-50 mb-4 border"
                        onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-gray-50 mb-6 border"
                        onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })} />
                    <button className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-black hover:bg-[#c19206] transition-all">Login</button>
                </motion.form>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* SIDEBAR */}
            <aside className="w-72 bg-[#4a1111] text-white p-8 hidden lg:flex flex-col">
                <h1 className="text-2xl font-black mb-10">Match<span className="text-[#c19206]">CRM</span></h1>
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab("profiles")}
                        className={`w-full text-left p-4 rounded-2xl font-bold transition ${activeTab === "profiles" ? "bg-[#c19206]" : "hover:bg-white/10"}`}>
                        Manage Profiles
                    </button>
                    <button onClick={() => setActiveTab("inquiries")}
                        className={`w-full text-left p-4 rounded-2xl font-bold transition ${activeTab === "inquiries" ? "bg-[#c19206]" : "hover:bg-white/10"}`}>
                        User Inquiries ({inquiries.length})
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm">
                    <div>
                        <h2 className="text-3xl font-black text-[#4a1111]">Control Panel</h2>
                        <p className="text-gray-400">Welcome back, {adminUser.name}</p>
                    </div>
                    <button onClick={handleLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition">Logout</button>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === "profiles" ? (
                        <motion.div key="profiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* CREATE PROFILE FORM */}
                            <section className="bg-white p-8 rounded-3xl shadow-md mb-10">
                                <h3 className="text-xl font-black mb-6 text-[#4a1111]">{editingId ? "Edit Profile" : "Create New Profile"}</h3>
                                <form onSubmit={saveProfile} className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Job/Title</label>
                                        <input type="text" value={formData.title} required className="w-full p-3 rounded-xl bg-gray-50 border" placeholder="e.g. Software Engineer"
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Age</label>
                                        <input type="number" value={formData.age} required className="w-full p-3 rounded-xl bg-gray-50 border" placeholder="e.g. 28"
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">City</label>
                                        <input type="text" value={formData.city} required className="w-full p-3 rounded-xl bg-gray-50 border" placeholder="e.g. Lahore"
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Gender</label>
                                        <select value={formData.gender} className="w-full p-3 rounded-xl bg-gray-50 border"
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">Profile Image</label>
                                        <input type="file" accept="image/*" className="w-full p-2 text-xs" onChange={handleProfileImageChange} />
                                    </div>
                                    <div className="flex items-end">
                                        <button className="w-full p-3 bg-[#c19206] text-white font-black rounded-xl hover:bg-[#4a1111] transition">
                                            {editingId ? "Update Now" : "Publish Profile"}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* LIST OF PROFILES */}
                            <h3 className="text-2xl font-black mb-6">Active Website Profiles</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {profiles.map((p) => (
                                    <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={p.image || "/placeholder.jpg"} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c19206]" />
                                            <div>
                                                <h4 className="font-black text-[#4a1111]">{p.title}</h4>
                                                <p className="text-xs text-gray-400">{p.city} • {p.age} yrs • {p.gender}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingId(p.id); setFormData(p); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg font-bold">Edit</button>
                                            <button onClick={() => deleteProfile(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg font-bold">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="inquiries" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-2xl font-black mb-6">User Inquiry Requests</h3>
                            <div className="space-y-4">
                                {inquiries.length === 0 ? (
                                    <p className="text-gray-400 italic bg-white p-10 rounded-3xl text-center">Abhi tak koi inquiry nahi aai.</p>
                                ) : (
                                    inquiries.map((inq, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-[#c19206]">
                                            <div className="flex justify-between items-start">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                                    <div><p className="text-[10px] uppercase font-bold text-gray-400">Profile ID</p><p className="font-bold">{inq.profileId}</p></div>
                                                    <div><p className="text-[10px] uppercase font-bold text-gray-400">Profession</p><p className="font-bold">{inq.profession}</p></div>
                                                    <div><p className="text-[10px] uppercase font-bold text-gray-400">Caste</p><p className="font-bold">{inq.caste}</p></div>
                                                    <div><p className="text-[10px] uppercase font-bold text-gray-400">City/Country</p><p className="font-bold">{inq.city}, {inq.country}</p></div>
                                                </div>
                                                <button onClick={() => deleteInquiry(idx)} className="text-red-500 text-sm font-bold">Remove</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
