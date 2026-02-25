"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '../ui/ProfileCard';
import {
    Sparkles, Users, ArrowUpRight, Search, Zap,
    X, ShieldCheck, CheckCircle2, MessageSquare, Copy, Loader2, Banknote, Smartphone
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// Fallback data agar server connect na ho
const defaultProfiles = [
    { _id: 'f1', name: 'Premium Member', age: 28, gender: 'Male', city: 'Lahore', images: ['/m1.jpg'] },
    { _id: 'f2', name: 'Premium Member', age: 26, gender: 'Female', city: 'Karachi', images: ['/f1.jpg'] },
];

export default function FeaturedProfiles() {
    // 1. Initial state hamesha empty array rakhein
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    const API_BASE_URL = "http://localhost:5000/api";

    const fetchProfiles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/public/profiles`);
            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const data = await response.json();
            console.log("API Response Check:", data);

            // 2. Data extraction logic ko safe banaya hai
            let fetchedData = [];
            if (data && data.success && Array.isArray(data.profiles)) {
                fetchedData = data.profiles;
            } else if (Array.isArray(data)) {
                fetchedData = data;
            }

            // 3. Agar data mila toh set karein, warna default dikhayein
            setProfiles(fetchedData.length > 0 ? fetchedData : defaultProfiles);

        } catch (error) {
            console.error("Fetch error:", error);
            setProfiles(defaultProfiles);
            toast.error("Server down. Using offline data.");
        } finally {
            setTimeout(() => setIsLoaded(true), 400);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleProfileClick = (profile: any) => {
        setSelectedProfile(profile);
        setStep(1);
        setIsModalOpen(true);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRequest(true);
        setTimeout(() => {
            setLoadingRequest(false);
            setStep(2);
            toast.success("Request submitted!");
        }, 1200);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Number copied to clipboard!");
    };

    return (
        <section className="py-28 bg-[#f8fafc] relative overflow-hidden font-sans">
            <Toaster position="top-center" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-6 group cursor-default">
                            <Zap size={14} className="text-amber-500 fill-amber-500 group-hover:animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Profiles</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-[950] text-slate-900 tracking-[-0.04em] leading-[0.95] mb-6">
                            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">perfect match</span>
                        </h2>
                    </div>

                    <button
                        onClick={() => { setIsLoaded(false); fetchProfiles(); }}
                        className="h-14 flex items-center gap-3 bg-slate-900 text-white px-8 rounded-2xl font-bold text-sm transition-all hover:bg-blue-600 active:scale-95 shadow-lg"
                    >
                        Refresh List
                        <ArrowUpRight size={18} />
                    </button>
                </div>

                {/* 4. SAFE MAPPING: Check karein ke profiles array hai ya nahi */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    {Array.isArray(profiles) && profiles.length > 0 ? (
                        profiles.map((p, index) => (
                            <div
                                key={p._id || index}
                                onClick={() => handleProfileClick(p)}
                                className="relative group cursor-pointer"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <div className="relative bg-white rounded-[2rem] transition-transform duration-500 group-hover:-translate-y-3 shadow-sm border border-slate-100 overflow-hidden">
                                    <ProfileCard
                                        profile={{
                                            ...p,
                                            image: p.mainImage
                                                ? (p.mainImage.startsWith('http') ? p.mainImage : `http://localhost:5000${p.mainImage}`)
                                                : (p.images && p.images.length > 0 ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`) : '/placeholder.jpg')
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-slate-400 font-medium">No profiles found.</div>
                    )}
                </div>

                {/* Modal ka code wahi hai (Shortened for space) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                            {/* ... Modal Content (Jo pehle diya tha bilkul wahi hai) ... */}
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full z-10 transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                            {step === 1 ? (
                                <div className="p-10 md:p-14">
                                    <div className="text-center mb-10">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck className="text-blue-600" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-[950] text-slate-900 tracking-tight uppercase">Unlock Access</h2>
                                        <p className="text-slate-500 text-sm mt-2 font-medium">Verify your info to see the full profile</p>
                                    </div>
                                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                        <input required type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        <input required type="tel" placeholder="WhatsApp Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        <button disabled={loadingRequest} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all flex items-center justify-center">
                                            {loadingRequest ? <Loader2 className="animate-spin" /> : "Request Details"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-10 md:p-14 text-center">
                                    <CheckCircle2 className="text-green-500 mx-auto mb-4" size={50} />
                                    <h2 className="text-3xl font-[950] text-slate-900 uppercase">One More Step</h2>
                                    <p className="text-slate-500 text-sm mt-2 mb-8">Send <b>Rs. 1500</b> to view {selectedProfile?.name || 'this'} contact details.</p>
                                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 flex items-center justify-between mb-8">
                                        <div className="text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EasyPaisa / JazzCash</p>
                                            <p className="font-bold text-slate-800 text-lg">0300 1234567</p>
                                            <p className="text-xs text-slate-500">Title: Rishta Admin</p>
                                        </div>
                                        <button onClick={() => copyToClipboard('03001234567')} className="p-3 bg-white shadow-sm rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                    <a href={`https://wa.me/923001234567?text=Hi, Proof for ${selectedProfile?.name}`} target="_blank" className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase w-full">
                                        <MessageSquare size={18} /> Send Proof
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}