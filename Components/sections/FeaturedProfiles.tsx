"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '../ui/ProfileCard';
import {
    Sparkles, Users, ArrowUpRight, Search, Zap,
    X, ShieldCheck, CheckCircle2, MessageSquare, Copy, Loader2, Banknote, Smartphone
} from 'lucide-react';

// Default data sirf fallback ke liye agar API fail ho jaye
const defaultProfiles = [
    { _id: 'fallback-1', title: 'Software Engineer', age: 28, gender: 'Male', city: 'Lahore', mainImage: '/m1.jpg' },
    { _id: 'fallback-2', title: 'Lawyer', age: 28, gender: 'Female', city: 'Lahore', mainImage: '/f1.jpg' },
];

export default function FeaturedProfiles() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    // API URL - Ensure it matches your backend
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Admin Panel ka create kiya hua data is PUBLIC route se aata hai
                const res = await fetch(`${API_URL}/api/public/profiles`);
                if (res.ok) {
                    const data = await res.json();
                    // Agar data empty na ho to set karein, warna default dikhaein
                    setProfiles(data.length > 0 ? data : defaultProfiles);
                } else {
                    setProfiles(defaultProfiles);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setProfiles(defaultProfiles);
            } finally {
                setTimeout(() => setIsLoaded(true), 100);
            }
        };

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

        try {
            // User ki registration request backend bhejne ke liye
            const res = await fetch(`${API_URL}/api/user/register-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    profileId: selectedProfile?._id,
                    package: "Premium" // Default package
                })
            });

            if (res.ok) {
                setStep(2);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            // Agar API fail bhi ho jaye tab bhi payment step dikha saktay hain user experience ke liye
            setStep(2);
        } finally {
            setLoadingRequest(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <section className="py-28 bg-[#f8fafc] relative overflow-hidden font-sans">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-6 group cursor-default">
                            <Zap size={14} className="text-amber-500 fill-amber-500 group-hover:animate-bounce" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Premium Matchmaking</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-[950] text-slate-900 tracking-[-0.04em] leading-[0.95] mb-6">
                            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">perfect match</span>
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed italic">
                            Discover hand-picked profiles from our database.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-14 flex items-center gap-3 bg-slate-900 text-white px-8 rounded-2xl font-bold text-sm transition-all hover:bg-blue-600 active:scale-95 group shadow-lg">
                            Refresh Profiles
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>

                {/* --- Profile Grid --- */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    {profiles.map((p, index) => (
                        <div
                            key={p._id || index}
                            onClick={() => handleProfileClick(p)}
                            className="relative group cursor-pointer"
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
                            <div className="relative bg-white rounded-[2rem] transition-transform duration-500 group-hover:-translate-y-3">
                                {/* IMAGE PATH FIX: Hum yahan check kar rahay hain ke image API se aa rahi hai ya local */}
                                <ProfileCard
                                    profile={{
                                        ...p,
                                        // Agar image path 'uploads' se start ho raha hai to backend URL lagao
                                        image: p.mainImage ? (p.mainImage.startsWith('http') ? p.mainImage : `${API_URL}${p.mainImage}`) : '/placeholder.jpg'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Modal Section --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full z-10">
                                <X size={20} className="text-slate-400" />
                            </button>

                            {step === 1 ? (
                                <div className="p-10 md:p-14">
                                    <div className="text-center mb-10">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck className="text-blue-600" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-[950] text-slate-900 tracking-tight uppercase">Unlock Access</h2>
                                        <p className="text-slate-500 text-sm mt-2 font-medium">Register to see details of <span className="text-blue-600 font-bold">{selectedProfile?.name}</span></p>
                                    </div>
                                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                        <input required type="text" placeholder="Your Name" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        <input required type="tel" placeholder="WhatsApp Number" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        <button disabled={loadingRequest} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all flex items-center justify-center">
                                            {loadingRequest ? <Loader2 className="animate-spin" /> : "Verify & Get Account"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-10 md:p-14">
                                    <div className="text-center mb-8">
                                        <CheckCircle2 className="text-green-500 mx-auto mb-4" size={50} />
                                        <h2 className="text-3xl font-[950] text-slate-900 uppercase">Payment Info</h2>
                                        <p className="text-slate-500 text-sm mt-2">Send payment screenshot of Rs. 1500 to Admin</p>
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EasyPaisa</p>
                                                <p className="font-bold text-slate-800">0300 1234567</p>
                                            </div>
                                            <button onClick={() => copyToClipboard('03001234567')} className="text-blue-600"><Copy size={18} /></button>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://wa.me/923001234567?text=Hi, I sent payment for ${selectedProfile?.name}`}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase"
                                    >
                                        <MessageSquare size={18} /> Send Screenshot
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