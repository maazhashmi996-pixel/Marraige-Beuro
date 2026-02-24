"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '../ui/ProfileCard';
import {
    Sparkles, Users, ArrowUpRight, Search, Zap,
    X, ShieldCheck, CheckCircle2, MessageSquare, Copy, Loader2, Banknote, Smartphone
} from 'lucide-react';

// Ye data tab show hoga jab localStorage khali ho
const defaultProfiles = [
    { id: 'SMB-917', title: 'Software Engineer', age: 28, status: 'Single', gender: 'Male', city: 'Lahore', image: '/m1.jpg' },
    { id: 'SMB-825', title: 'Lawyer', age: 28, status: 'Single', gender: 'Female', city: 'Lahore', image: '/f1.jpg' },
    { id: 'SMB-877', title: 'Nurse', age: 32, status: 'Single', gender: 'Female', city: 'Sialkot', image: '/f2.jpg' },
    { id: 'SMB-59', title: 'Govt Employee', age: 28, status: 'Single', gender: 'Male', city: 'Faisalabad', image: '/m2.jpg' },
];

export default function FeaturedProfiles() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Modal & Business Logic States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Register, 2: Payment/Thanks
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    useEffect(() => {
        const savedData = localStorage.getItem("profiles");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setProfiles(parsedData.length > 0 ? parsedData : defaultProfiles);
            } catch (error) {
                setProfiles(defaultProfiles);
            }
        } else {
            setProfiles(defaultProfiles);
        }
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    const handleProfileClick = (profile: any) => {
        setSelectedProfile(profile);
        setStep(1); // Hamesha register se start ho
        setIsModalOpen(true);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRequest(true);

        // Simulation: Yahan aap apni API call kar saktay hain
        // e.g., await axios.post('/api/requests', { ...formData, profileId: selectedProfile.id })

        setTimeout(() => {
            setLoadingRequest(false);
            setStep(2); // Payment step par le jao
        }, 1500);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard: " + text);
    };

    return (
        <section className="py-28 bg-[#f8fafc] relative overflow-hidden font-sans">
            {/* Background Aesthetic Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* --- Premium Header Section --- */}
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
                            Discover hand-picked profiles. Click on a card to unlock full details.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-14 items-center px-6 rounded-2xl bg-white border border-slate-200 text-slate-400 gap-3 focus-within:border-blue-500 transition-all">
                            <Search size={18} />
                            <span className="text-sm font-semibold">Search by city...</span>
                        </div>
                        <button className="h-14 flex items-center gap-3 bg-slate-900 text-white px-8 rounded-2xl font-bold text-sm transition-all hover:bg-blue-600 active:scale-95 group shadow-lg">
                            Explore All
                            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* --- Profile Grid --- */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    {profiles.map((p, index) => (
                        <div
                            key={p.id}
                            onClick={() => handleProfileClick(p)}
                            className="relative group cursor-pointer"
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
                            <div className="relative bg-white rounded-[2rem] transition-transform duration-500 group-hover:-translate-y-3">
                                <ProfileCard profile={p} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Registration & Payment Multi-Step Modal --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>

                        <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
                                <X size={20} className="text-slate-400" />
                            </button>

                            {step === 1 ? (
                                /* STEP 1: REGISTRATION */
                                <div className="p-10 md:p-14">
                                    <div className="text-center mb-10">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck className="text-blue-600" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-[950] text-slate-900 tracking-tight uppercase">Unlock Full Access</h2>
                                        <p className="text-slate-500 text-sm mt-2 font-medium">Please register to view <span className="text-blue-600 font-bold">{selectedProfile?.id}</span> details.</p>
                                    </div>

                                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                            <input required type="text" placeholder="Your Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800"
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">WhatsApp Number</label>
                                            <input required type="tel" placeholder="03xx xxxxxxx" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800"
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <button disabled={loadingRequest} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center">
                                            {loadingRequest ? <Loader2 className="animate-spin" /> : "Verify & See Payment Details"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* STEP 2: PAYMENT INFO */
                                <div className="p-10 md:p-14">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="text-green-500" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-[950] text-slate-900 tracking-tight uppercase">Final Step!</h2>
                                        <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">
                                            Thanks <span className="text-slate-900 font-bold">{formData.name}</span>! Send the screenshot of payment to get instant access.
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><Smartphone size={24} /></div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EasyPaisa / JazzCash</p>
                                                    <p className="font-bold text-slate-800">0300 1234567</p>
                                                </div>
                                            </div>
                                            <button onClick={() => copyToClipboard('03001234567')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-blue-600"><Copy size={18} /></button>
                                        </div>

                                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Banknote size={24} /></div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bank Account (HBL)</p>
                                                    <p className="font-bold text-slate-800">PK75 HABL 0001 2222 3333</p>
                                                </div>
                                            </div>
                                            <button onClick={() => copyToClipboard('PK75HABL000122223333')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-blue-600"><Copy size={18} /></button>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600 p-8 rounded-[2.5rem] text-center shadow-2xl shadow-blue-200">
                                        <p className="text-white/90 text-[11px] font-bold uppercase tracking-widest mb-3">Instant Activation</p>
                                        <p className="text-white text-sm font-black italic mb-6 leading-relaxed">
                                            "Please send payment screenshot on WhatsApp. Admin will approve you in 5-10 mins."
                                        </p>
                                        <a
                                            href={`https://wa.me/923001234567?text=Hi, I am ${formData.name}. I've sent the payment for profile ${selectedProfile?.id}. Please grant access.`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                                        >
                                            <MessageSquare size={18} className="fill-blue-600" />
                                            Send Screenshot
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- Sophisticated Empty State --- */}
                {profiles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-[3rem] border border-slate-200 shadow-inner">
                        <Users size={48} className="text-slate-200 mb-4" />
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Updating Profiles...</h3>
                        <p className="text-slate-500 mt-2 font-medium">New premium members are being verified.</p>
                    </div>
                )}
            </div>
        </section>
    );
}