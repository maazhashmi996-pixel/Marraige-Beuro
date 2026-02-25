"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FiLock, FiCheckCircle, FiPhone, FiInfo,
    FiArrowLeft, FiAlertTriangle, FiImage, FiArrowRight
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function SingleProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const BASE_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchFullProfile = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Full details dekhne ke liye membership plan select karein ya login karein.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/profiles/view/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                // Safety Check: Agar response 404 hai ya HTML (unexpected token '<') hai
                const contentType = res.headers.get("content-type");
                if (!res.ok || !contentType || !contentType.includes("application/json")) {
                    // Agar backend 404 bhej raha hai toh yahan handle hoga
                    setError("Profile details is waqt dastiyab nahi hain ya aapka access khatam ho chuka hai.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();

                if (res.ok) {
                    // Logic fix: supporting both direct data or data.profile wrapper
                    setProfile(data.profile || data);
                } else {
                    setError(data.message || "Access Restricted");
                }
            } catch (err) {
                setError("Server se rabta nahi ho pa raha. Internet check karein.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFullProfile();
    }, [id]);

    const getFullImageUrl = (path: string) => {
        if (!path) return "https://via.placeholder.com/800";
        return path.startsWith('http') ? path : `${BASE_URL}${path}`;
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center font-bold text-[#4a1111] bg-[#fcfafa]">
            <div className="w-12 h-12 border-4 border-[#c19206] border-t-transparent rounded-full animate-spin mb-4"></div>
            Verifying Access...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfafa] py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Navigation Header */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-[#4a1111] transition-all group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Profiles
                </button>

                {error ? (
                    /* ================= ERROR/RESTRICTED STATE ================= */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl border border-red-50 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full -mr-20 -mt-20 opacity-40"></div>

                        <div className="w-24 h-24 bg-red-50 text-[#4a1111] rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                            <FiLock />
                        </div>

                        <h2 className="text-4xl font-black text-[#4a1111] mb-4 italic tracking-tight">Access Restricted</h2>
                        <p className="text-gray-500 font-bold mb-12 max-w-md mx-auto leading-relaxed">
                            {error}
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => router.push('/Packages')}
                                className="w-full md:w-auto px-12 py-5 bg-[#4a1111] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-red-900/20 active:scale-95"
                            >
                                View Packages <FiArrowRight />
                            </button>

                            <button
                                onClick={() => router.push('/login')}
                                className="w-full md:w-auto px-12 py-5 bg-gray-100 text-[#4a1111] rounded-2xl font-black text-lg hover:bg-gray-200 transition-all border border-gray-200 active:scale-95"
                            >
                                Member Login
                            </button>
                        </div>

                        <p className="mt-10 text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Aasan Rishta • Premium Matchmaking Service
                        </p>
                    </motion.div>
                ) : (
                    /* ================= SUCCESS STATE: Profile Details ================= */
                    profile && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-50"
                        >

                            {/* Header Image Section */}
                            <div className="relative h-[450px] md:h-[550px] w-full bg-gray-200">
                                <img
                                    src={getFullImageUrl(profile.mainImage)}
                                    alt="Main Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4a1111] via-transparent to-black/20"></div>

                                <div className="absolute top-6 right-8 bg-green-500 text-[10px] font-black px-4 py-1.5 rounded-full text-white flex items-center gap-2 uppercase tracking-widest shadow-lg">
                                    <FiCheckCircle /> Verified Profile
                                </div>

                                <div className="absolute bottom-10 left-8 md:left-12 text-white">
                                    <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tighter italic">
                                        {profile.name || profile.title}
                                    </h1>
                                    <p className="opacity-95 text-xl md:text-2xl font-bold flex items-center gap-3">
                                        {profile.gender} <span className="text-[#c19206]">|</span> {profile.age} Years <span className="text-[#c19206]">|</span> {profile.city}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Content */}
                            <div className="p-8 md:p-14 space-y-14">

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#fcfafa] p-10 rounded-[2.5rem] border border-gray-100 shadow-inner">
                                    <DetailBox label="Caste" value={profile.caste} />
                                    <DetailBox label="Profession" value={profile.profession} />
                                    <DetailBox label="Sect" value={profile.sect} />
                                    <DetailBox label="Father Name" value={profile.fatherName} />
                                </div>

                                {/* About Candidate */}
                                <div>
                                    <h3 className="text-2xl font-black text-[#4a1111] mb-6 flex items-center gap-3">
                                        <FiInfo className="text-[#c19206]" /> About Candidate
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm italic text-gray-600 text-lg leading-relaxed font-medium">
                                        "{profile.description || "Personal biography details are shared with verified members only."}"
                                    </div>
                                </div>

                                {/* Photo Gallery */}
                                {profile.gallery && profile.gallery.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl font-black text-[#4a1111] mb-8 flex items-center gap-3">
                                            <FiImage className="text-[#c19206]" /> Photo Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                            {profile.gallery.map((img: string, idx: number) => (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ scale: 1.03 }}
                                                    className="h-56 rounded-[1.5rem] overflow-hidden border shadow-md bg-gray-100 cursor-pointer"
                                                >
                                                    <img
                                                        src={getFullImageUrl(img)}
                                                        alt={`Gallery ${idx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Partner Requirements */}
                                <div className="bg-blue-50/40 p-10 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <FiCheckCircle size={80} className="text-blue-900" />
                                    </div>
                                    <h3 className="text-xl font-black text-blue-900 mb-4 underline decoration-blue-200 underline-offset-8">
                                        Expected Partner Requirements:
                                    </h3>
                                    <p className="text-blue-800 text-lg font-bold leading-relaxed relative z-10">
                                        {profile.requirements || "Standard family-oriented requirements as per cultural values."}
                                    </p>
                                </div>

                                {/* Contact Section Unlocked */}
                                <div className="p-10 bg-gradient-to-br from-yellow-50 to-white rounded-[3rem] border-2 border-dashed border-[#c19206]/30 shadow-xl shadow-yellow-600/5">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-[#4a1111] flex items-center gap-3">
                                                <FiPhone className="text-[#c19206] animate-bounce" /> Representative Unlocked
                                            </h3>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact for Further Information</p>
                                            <p className="text-4xl md:text-5xl font-black text-[#4a1111] tracking-tighter italic">
                                                {profile.phone || "+92 312 3456789"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.open(`https://wa.me/${profile.phone?.replace(/\s/g, '') || '923123456789'}`, '_blank')}
                                            className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-[#1eb954] transition-all hover:scale-105"
                                        >
                                            WhatsApp Now
                                        </button>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-yellow-200/60">
                                        <p className="text-[12px] text-red-600 font-black flex items-center gap-2 italic">
                                            <FiAlertTriangle className="flex-shrink-0" />
                                            SAFETY NOTICE: Please conduct independent verification. Do not transfer any money directly to candidates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
}

// Reusable Detail Component
function DetailBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col group">
            <p className="text-[11px] font-black uppercase text-[#c19206] tracking-[0.15em] mb-2 group-hover:translate-x-1 transition-transform">
                {label}
            </p>
            <p className="text-lg font-black text-[#4a1111] truncate border-l-2 border-[#4a1111]/10 pl-3">
                {value || "Private"}
            </p>
        </div>
    );
}