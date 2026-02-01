"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces for Type Safety ---
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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'profiles' | 'inquiries'>('profiles');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form States
    const [formData, setFormData] = useState<Profile>({
        id: '', title: '', age: '', status: 'Single', gender: 'Male', city: '', image: ''
    });

    // Login State
    const [loginCreds, setLoginCreds] = useState({ email: '', password: '' });

    useEffect(() => {
        const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        const savedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const auth = localStorage.getItem('isAdmin') === 'true';

        setProfiles(savedProfiles);
        setInquiries(savedInquiries);
        setIsLoggedIn(auth);
    }, []);

    // --- Handlers ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginCreds.email === "admin@match.com" && loginCreds.password === "admin123") {
            localStorage.setItem('isAdmin', 'true');
            setIsLoggedIn(true);
        } else {
            alert("Invalid Credentials!");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedProfiles: Profile[];

        if (editingId) {
            updatedProfiles = profiles.map(p => p.id === editingId ? { ...formData, id: editingId } : p);
            setEditingId(null);
        } else {
            const newId = `SMB-${Math.floor(100 + Math.random() * 900)}`;
            const newProfile = { ...formData, id: newId };
            updatedProfiles = [...profiles, newProfile];
        }

        setProfiles(updatedProfiles);
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        setFormData({ id: '', title: '', age: '', status: 'Single', gender: 'Male', city: '', image: '' });
    };

    const deleteProfile = (id: string) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            const filtered = profiles.filter(p => p.id !== id);
            setProfiles(filtered);
            localStorage.setItem('profiles', JSON.stringify(filtered));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        window.location.reload();
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#4a1111] p-4 font-sans">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border-t-8 border-[#c19206]">
                    <h2 className="text-3xl font-black text-[#4a1111] mb-2 text-center">Admin Portal</h2>
                    <p className="text-gray-500 text-center mb-8 text-sm font-medium">Enter your credentials to manage profiles</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] transition-all outline-none"
                            onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] transition-all outline-none"
                            onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                            required
                        />
                        <button className="w-full py-4 bg-[#4a1111] hover:bg-[#c19206] text-white rounded-2xl font-black shadow-lg shadow-[#4a1111]/20 transition-all active:scale-95">
                            Access Dashboard
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <div className="w-72 bg-[#4a1111] text-white p-8 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12">
                    <h1 className="text-2xl font-black tracking-tighter text-[#c19206]">MATCH<span className="text-white font-light">ADMIN</span></h1>
                    <div className="w-10 h-1 bg-[#c19206] mt-1"></div>
                </div>

                <nav className="space-y-3 flex-1">
                    <button
                        onClick={() => setActiveTab('profiles')}
                        className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'profiles' ? 'bg-[#c19206] shadow-lg font-bold' : 'hover:bg-white/10 text-gray-300'}`}
                    >
                        <span>👥</span> Profiles
                    </button>
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'inquiries' ? 'bg-[#c19206] shadow-lg font-bold' : 'hover:bg-white/10 text-gray-300'}`}
                    >
                        <span>📩</span> Inquiries
                        <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">{inquiries.length}</span>
                    </button>
                </nav>

                <button onClick={handleLogout} className="mt-auto p-4 bg-red-500/10 hover:bg-red-500 text-red-200 rounded-2xl transition-all font-bold flex items-center justify-center gap-2">
                    <span>Logout</span> 👋
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'profiles' ? (
                        <motion.div
                            key="profiles"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Add/Edit Form */}
                            <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-fit sticky top-0">
                                <h2 className="text-2xl font-black mb-6 text-[#4a1111]">
                                    {editingId ? 'Edit Profile' : 'New Profile'}
                                </h2>
                                <form onSubmit={saveProfile} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title / Profession</label>
                                        <input type="text" placeholder="e.g. Doctor" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#c19206] transition-all outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Age</label>
                                            <input type="number" placeholder="28" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#c19206] outline-none" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">City</label>
                                            <input type="text" placeholder="Lahore" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#c19206] outline-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Gender</label>
                                        <select className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 outline-none" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Photo</label>
                                        <div className="border-2 border-dashed border-gray-100 p-6 text-center rounded-[2rem] hover:bg-gray-50 transition-all cursor-pointer relative group">
                                            <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            {formData.image ? (
                                                <img src={formData.image} className="w-24 h-24 mx-auto rounded-3xl object-cover shadow-xl border-4 border-white" />
                                            ) : (
                                                <div className="text-gray-400">
                                                    <span className="text-3xl">📸</span>
                                                    <p className="text-[10px] mt-2 font-bold uppercase">Upload Photo</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-[#4a1111] text-white rounded-[2rem] font-black shadow-xl shadow-[#4a1111]/10 hover:bg-[#c19206] transition-all active:scale-95">
                                        {editingId ? 'Update Profile' : 'Publish Profile'}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={() => { setEditingId(null); setFormData({ id: '', title: '', age: '', status: 'Single', gender: 'Male', city: '', image: '' }) }} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 hover:text-red-500 transition-all">Cancel Edit</button>
                                    )}
                                </form>
                            </div>

                            {/* List Profiles */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <h3 className="text-4xl font-black text-[#4a1111]">Live Database</h3>
                                        <p className="text-gray-400 font-medium">Currently managing {profiles.length} profiles</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profiles.map(p => (
                                        <motion.div layout key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                                            <div className="relative">
                                                <img src={p.image || '/placeholder.jpg'} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-gray-50 group-hover:scale-105 transition-all shadow-md" alt="" />
                                                <div className="absolute -top-2 -left-2 bg-[#c19206] text-white text-[9px] font-black px-2 py-1 rounded-full">{p.id}</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-xl text-gray-800 truncate leading-tight">{p.title}</h4>
                                                <p className="text-sm font-bold text-[#c19206] uppercase tracking-tighter">{p.city} • {p.age}y</p>
                                                <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => { setEditingId(p.id); setFormData(p); }} className="text-[10px] font-black uppercase text-blue-500 hover:underline">Edit</button>
                                                    <button onClick={() => deleteProfile(p.id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Delete</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Inquiries Section */
                        <motion.div
                            key="inquiries"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[3rem] shadow-xl p-10 border border-gray-100"
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-[#4a1111]">Pending Inquiries</h2>
                                <p className="text-gray-400 font-medium italic">Latest user responses from the inquiry form</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-100">
                                            <th className="pb-6 px-4">Profile Info</th>
                                            <th className="pb-6 px-4">User Background</th>
                                            <th className="pb-6 px-4">Profession</th>
                                            <th className="pb-6 px-4">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {inquiries.map((iq, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                                                <td className="py-6 px-4">
                                                    <span className="font-black text-[#c19206] bg-[#c19206]/10 px-3 py-1 rounded-full text-xs">{iq.profileId}</span>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{iq.date || 'New Entry'}</p>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <p className="font-black text-gray-800">{iq.gender} • {iq.maritalStatus}</p>
                                                    <p className="text-xs text-[#4a1111] font-bold">Caste: {iq.caste}</p>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <p className="font-black text-gray-800">{iq.profession}</p>
                                                    <p className="text-xs text-gray-400 font-medium italic">{iq.qualification}</p>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <p className="font-bold text-gray-800">{iq.city}</p>
                                                    <p className="text-xs text-gray-400">{iq.country}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {inquiries.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-gray-300 font-black uppercase text-xl tracking-tighter italic">No Applications Found Yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}