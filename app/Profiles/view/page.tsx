"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    FiLock, FiCheckCircle, FiPhone, FiInfo,
    FiArrowLeft, FiAlertTriangle, FiImage, FiArrowRight, FiExternalLink, FiMapPin, FiBookOpen, FiBriefcase
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PRODUCTION READY: 
 * Static export friendly using Query Params (?id=)
 * Suspense boundary added for useSearchParams compatibility
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
    const id = searchParams.get("id");
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.asaanrishta.com";

    useEffect(() => {
        if (!id) {
            setError("Invalid Profile Request. ID missing.");
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
                // Backend endpoint check karein: /api/profiles/view/${id} ya /api/profiles/${id}
                const res = await fetch(`${BASE_URL}/api/profiles/${id}`, {
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
        <div className="min-h-screen bg-[#fcfafa] py-8 md:py-16 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Glassmorphism Navigation */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#4a1111] transition-all group"
                >
                    <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" /> Return to Gallery
                </button>

                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-10 md:p-24 rounded-[4rem] shadow-2xl border border-red-50 text-center"
                        >
                            <div className="w-24 h-24 bg-[#4a1111] text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl rotate-6">
                                <FiLock />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#4a1111] mb-6 italic tracking-tighter">Premium Access</h2>
                            <p className="text-gray-500 font-bold mb-12 max-w-sm mx-auto leading-relaxed uppercase text-xs tracking-widest">{error}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => router.push('/Packages')} className="px-12 py-6 bg-[#4a1111] text-white rounded-3xl font-black hover:bg-[#c19206] transition-all flex items-center justify-center gap-3 shadow-xl">
                                    MEMBERSHIP PLANS <FiArrowRight />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        profile && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100"
                            >
                                {/* Hero Section with Parallax-like Image */}
                                <div className="relative h-[500px] md:h-[750px] group">
                                    <img
                                        src={getFullImageUrl(profile.mainImage || profile.image)}
                                        alt={profile.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a1111] via-black/20 to-transparent" />

                                    {/* Verification Badge */}
                                    <div className="absolute top-10 right-10">
                                        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-4 rounded-3xl flex items-center gap-3 shadow-2xl">
                                            <FiCheckCircle className="text-yellow-500 text-xl" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Identity Verified</span>
                                        </div>
                                    </div>

                                    {/* Name & Quick Info */}
                                    <div className="absolute bottom-16 left-10 md:left-20 text-white">
                                        <motion.div initial={{ x: -30 }} animate={{ x: 0 }} className="flex items-center gap-3 mb-4">
                                            <span className="bg-[#c19206] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                                ID: {id?.toString().slice(-6).toUpperCase()}
                                            </span>
                                        </motion.div>
                                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter drop-shadow-2xl mb-4 uppercase">
                                            {profile.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-6 text-lg md:text-2xl font-bold opacity-90 italic">
                                            <span className="flex items-center gap-2"><FiMapPin className="text-[#c19206]" /> {profile.city}</span>
                                            <span className="w-2 h-2 bg-white/30 rounded-full" />
                                            <span className="flex items-center gap-2"><FiBookOpen className="text-[#c19206]" /> {profile.education || "Graduate"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Stats Ribbon */}
                                <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-50/50">
                                    <QuickStat label="Caste / Tribe" value={profile.caste} />
                                    <QuickStat label="Age & Gender" value={`${profile.age} / ${profile.gender}`} />
                                    <QuickStat label="Sect / Maslak" value={profile.sect} />
                                    <QuickStat label="Occupation" value={profile.occupation || profile.profession} />
                                </div>

                                {/* Content Body */}
                                <div className="p-10 md:p-24 space-y-24">

                                    {/* Bio */}
                                    <section>
                                        <SectionHeading title="Candidate Bio" icon={<FiInfo />} />
                                        <div className="relative">
                                            <span className="absolute -top-10 -left-6 text-[12rem] text-gray-50 font-black italic -z-10 select-none">"</span>
                                            <p className="text-2xl md:text-4xl text-gray-700 leading-[1.4] font-medium italic tracking-tight">
                                                {profile.description || "The candidate has not provided a detailed bio yet."}
                                            </p>
                                        </div>
                                    </section>

                                    {/* Partner Requirements */}
                                    <section className="bg-[#4a1111] p-12 md:p-20 rounded-[4rem] text-white shadow-2xl rotate-[0.5deg]">
                                        <SectionHeading title="Partner Requirements" icon={<FiCheckCircle className="text-yellow-500" />} light />
                                        <p className="text-2xl md:text-3xl font-black italic leading-snug text-yellow-500/90 tracking-tight">
                                            {profile.requirements || "Seeking a compatible and family-oriented partner."}
                                        </p>
                                    </section>

                                    {/* WhatsApp CTA */}
                                    <div className="bg-[#fcfafa] border-4 border-dashed border-gray-200 rounded-[4rem] p-12 text-center space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-black text-[#4a1111] italic tracking-tighter">Connect with Family</h3>
                                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Official Representative Verified Access</p>
                                        </div>

                                        <button
                                            onClick={() => window.open(`https://wa.me/${profile.phone?.toString().replace(/\D/g, '')}`, '_blank')}
                                            className="inline-flex items-center gap-4 bg-[#25D366] text-white px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-transform shadow-2xl shadow-green-500/20"
                                        >
                                            WHATSAPP CHAT <FiExternalLink />
                                        </button>

                                        <p className="text-[#4a1111] font-black text-xl flex items-center justify-center gap-3">
                                            <FiPhone className="animate-bounce" /> {profile.phone || "Restricted"}
                                        </p>
                                    </div>

                                    {/* Warning */}
                                    <div className="flex gap-6 p-10 bg-red-50 rounded-[2.5rem] border border-red-100 items-start">
                                        <FiAlertTriangle className="text-red-600 text-4xl shrink-0" />
                                        <div>
                                            <h4 className="text-red-900 font-black uppercase text-xs tracking-widest mb-2">Safety Protocol</h4>
                                            <p className="text-sm text-red-800/60 font-medium leading-relaxed italic">
                                                Asaan Rishta is a matchmaking platform. We strongly advise families to perform complete background checks before finalizing any commitments. We are not responsible for personal or financial disputes.
                                            </p>
                                        </div>
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

// Sub-Components
function LoadingUI() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl font-black italic text-[#4a1111] tracking-tighter"
            >
                AR
            </motion.div>
            <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-full h-full bg-[#c19206]"
                />
            </div>
        </div>
    );
}

function QuickStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-10 border-r border-gray-100 last:border-0 hover:bg-white transition-colors">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">{label}</p>
            <p className="text-xl font-black text-[#4a1111] uppercase tracking-tighter">{value || "---"}</p>
        </div>
    );
}

function SectionHeading({ title, icon, light = false }: { title: string; icon: any; light?: boolean }) {
    return (
        <div className="flex items-center gap-5 mb-12">
            <span className={`text-3xl ${light ? 'text-yellow-500' : 'text-[#c19206]'}`}>{icon}</span>
            <h2 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter ${light ? 'text-white' : 'text-[#4a1111]'}`}>
                {title}
            </h2>
            <div className={`h-[1px] flex-1 ${light ? 'bg-white/10' : 'bg-gray-100'}`} />
        </div>
    );
}