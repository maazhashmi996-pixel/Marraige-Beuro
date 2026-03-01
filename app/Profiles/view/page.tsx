"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    FiLock, FiCheckCircle, FiPhone, FiInfo,
    FiArrowLeft, FiAlertTriangle, FiImage, FiArrowRight, FiExternalLink
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PRODUCTION NOTE: 
 * Static export mein dynamic [id] folder build error deta hai.
 * Isliye humne folder ka naam 'view' rakha hai aur ID ko Query Params (?id=) se handle kiya hai.
 * Suspense boundary zaroori hai taake useSearchParams build time par crash na kare.
 */

export default function SingleProfilePage() {
    return (
        <Suspense fallback={<LoadingUI />}>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // URL se ?id=... nikalne ke liye
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.asaanrishta.com";

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchFullProfile = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem("userToken") : null;

            if (!token) {
                setError("Full details dekhne ke liye membership plan select karein ya login karein.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/profiles/view/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    if (res.status === 403) {
                        setError("Aapki limit khatam ho chuki hai ya aapka plan is profile ko allow nahi karta.");
                    } else {
                        setError("Profile details is waqt dastiyab nahi hain.");
                    }
                    return;
                }

                const data = await res.json();
                setProfile(data.profile || data);
            } catch (err) {
                setError("Network error. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchFullProfile();
    }, [id, BASE_URL]);

    const getFullImageUrl = useMemo(() => (path: string) => {
        if (!path) return "/placeholder-avatar.png";
        if (path.startsWith('http')) return path;
        return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }, [BASE_URL]);

    if (loading) return <LoadingUI />;

    return (
        <div className="min-h-screen bg-[#fcfafa] py-6 md:py-12 px-4 selection:bg-[#4a1111] selection:text-white">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-[#4a1111] transition-all"
                >
                    <FiArrowLeft className="text-lg" /> Back to Search
                </button>

                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 md:p-20 rounded-[3rem] shadow-xl border border-gray-100 text-center"
                        >
                            <div className="w-20 h-20 bg-[#4a1111] text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl rotate-3">
                                <FiLock />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-[#4a1111] mb-4 italic tracking-tighter">Access Restricted</h2>
                            <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">{error}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => router.push('/Packages')} className="px-10 py-5 bg-[#4a1111] text-white rounded-2xl font-bold hover:bg-[#c19206] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                                    View Packages <FiArrowRight />
                                </button>
                                <button onClick={() => router.push('/')} className="px-10 py-5 bg-gray-50 text-[#4a1111] rounded-2xl font-bold border border-gray-200 hover:bg-gray-100 transition-all">
                                    Home
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        profile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100"
                            >
                                {/* Hero Header */}
                                <div className="relative h-[450px] md:h-[600px]">
                                    <img
                                        src={getFullImageUrl(profile.mainImage || profile.image)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a1111] via-black/10 to-transparent" />

                                    <div className="absolute top-6 right-6">
                                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-2 shadow-2xl">
                                            <FiCheckCircle className="text-green-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a1111]">Verified Member</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-8 md:left-16 text-white">
                                        <motion.h1
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="text-5xl md:text-8xl font-black italic tracking-tighter drop-shadow-2xl"
                                        >
                                            {profile.name}
                                        </motion.h1>
                                        <div className="flex items-center gap-4 mt-4 font-bold text-lg md:text-xl opacity-90 uppercase tracking-tighter">
                                            <span>{profile.age} Years</span>
                                            <span className="w-1.5 h-1.5 bg-[#c19206] rounded-full" />
                                            <span>{profile.city}</span>
                                            <span className="hidden md:inline w-1.5 h-1.5 bg-[#c19206] rounded-full" />
                                            <span className="hidden md:inline">{profile.education}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border-b border-gray-100">
                                    <QuickStat label="Caste" value={profile.caste} />
                                    <QuickStat label="Profession" value={profile.profession} />
                                    <QuickStat label="Sect" value={profile.sect} />
                                    <QuickStat label="Gender" value={profile.gender} />
                                </div>

                                {/* Main Content Area */}
                                <div className="p-8 md:p-16 space-y-16">

                                    {/* About Section */}
                                    <section>
                                        <SectionHeading title="Background & Bio" icon={<FiInfo />} />
                                        <div className="bg-[#fcfafa] p-8 md:p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 relative">
                                            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed italic font-medium">
                                                "{profile.description || "No description provided by the candidate."}"
                                            </p>
                                        </div>
                                    </section>

                                    {/* Requirements Section */}
                                    <section className="bg-blue-50/50 p-8 md:p-12 rounded-[2.5rem] border border-blue-100">
                                        <SectionHeading title="Partner Preferences" icon={<FiCheckCircle />} />
                                        <p className="text-blue-900/80 text-xl font-bold leading-relaxed">
                                            {profile.requirements || "Seeking a compatible and respectful partner."}
                                        </p>
                                    </section>

                                    {/* Gallery */}
                                    {profile.gallery?.length > 0 && (
                                        <section>
                                            <SectionHeading title="Photo Gallery" icon={<FiImage />} />
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {profile.gallery.map((img: string, i: number) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.02 }}
                                                        className="aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-lg shadow-black/5"
                                                    >
                                                        <img src={getFullImageUrl(img)} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* WhatsApp CTA Card */}
                                    <div className="bg-gradient-to-br from-[#4a1111] to-[#2c0a0a] rounded-[3rem] p-8 md:p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
                                        <div className="space-y-4 text-center lg:text-left">
                                            <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter">Direct Contact</h3>
                                            <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">Verified Representative Access</p>
                                            <div className="text-3xl md:text-4xl font-black text-[#c19206] tabular-nums flex items-center justify-center lg:justify-start gap-4">
                                                <FiPhone /> {profile.phone || "Private"}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => window.open(`https://wa.me/${profile.phone?.toString().replace(/\D/g, '')}`, '_blank')}
                                            className="w-full lg:w-auto bg-[#25D366] px-12 py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-900/20"
                                        >
                                            MESSAGE ON WHATSAPP <FiExternalLink />
                                        </button>
                                    </div>

                                    {/* Safety Footer */}
                                    <div className="flex gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
                                        <FiAlertTriangle className="text-red-600 text-2xl shrink-0" />
                                        <p className="text-[12px] md:text-sm text-red-900/60 font-bold leading-relaxed italic uppercase tracking-wider">
                                            Important: Verification is the family's responsibility. We do not handle financial transactions.
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Optimized Sub-Components
function LoadingUI() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfafa]">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-16 h-16 border-t-4 border-b-4 border-[#c19206] rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#4a1111] uppercase">AR</div>
            </div>
            <p className="mt-6 tracking-[0.3em] uppercase text-[10px] font-black text-[#4a1111] opacity-40">Loading Premium Profile</p>
        </div>
    );
}

function QuickStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
            <p className="text-sm md:text-lg font-black text-[#4a1111] truncate uppercase tracking-tighter">{value || "---"}</p>
        </div>
    );
}

function SectionHeading({ title, icon }: { title: string; icon: any }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl text-[#c19206]">{icon}</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#4a1111] italic uppercase tracking-tighter">{title}</h2>
            <div className="h-[2px] flex-1 bg-gray-50" />
        </div>
    );
}