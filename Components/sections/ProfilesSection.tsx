"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiUser, FiLock, FiExternalLink } from "react-icons/fi";

/* ================= TYPES ================= */
interface PublicProfile {
    _id: string;
    title: string;
    age: number;
    gender: string;
    city: string;
    profession: string;
    caste: string;
    sect: string;
}

export default function PublicProfiles() {
    const [profiles, setProfiles] = useState<PublicProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/public/live-profiles");
                const data = await res.json();
                setProfiles(data);
            } catch (err) {
                console.error("Error fetching profiles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[#4a1111] mb-4">
                        Featured <span className="text-[#c19206]">Profiles</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Explore our latest verified profiles. Register to view full details and contact information.
                    </p>
                </div>

                {/* PROFILES GRID */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading amazing matches...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profiles.map((profile) => (
                            <motion.div
                                key={profile._id}
                                whileHover={{ y: -10 }}
                                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                            >
                                {/* Gender Badge */}
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-bold text-xs uppercase tracking-widest text-white ${profile.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                    {profile.gender}
                                </div>

                                {/* Profile Details */}
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#c19206]/10 transition-colors">
                                        {profile.gender === 'Male' ? '🤵' : '👰'}
                                    </div>

                                    <h3 className="text-2xl font-black text-[#4a1111] leading-tight">
                                        {profile.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <span className="flex items-center gap-1 text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                                            <FiUser className="text-[#c19206]" /> {profile.age} Yrs
                                        </span>
                                        <span className="flex items-center gap-1 text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                                            <FiMapPin className="text-[#c19206]" /> {profile.city}
                                        </span>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-dashed border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FiBriefcase className="text-[#c19206]" />
                                            <span className="font-medium">{profile.profession || "Private Job"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <span className="text-[#c19206] font-black text-xs">SECT:</span>
                                            <span className="font-medium">{profile.sect}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => window.location.href = `/profile/${profile._id}`}
                                        className="w-full mt-6 py-4 bg-gray-50 text-[#4a1111] rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-[#4a1111] group-hover:text-white transition-all"
                                    >
                                        <FiLock className="group-hover:hidden" />
                                        <FiExternalLink className="hidden group-hover:block" />
                                        VIEW FULL PROFILE
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* FOOTER CTA */}
                <div className="mt-20 text-center bg-[#4a1111] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c19206] rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
                    <h3 className="text-3xl font-black text-white mb-4 relative z-10">Can't find what you're looking for?</h3>
                    <p className="text-white/70 mb-8 relative z-10 font-medium">Join 5,000+ members and find your perfect match today.</p>
                    <button
                        onClick={() => window.location.href = "/register"}
                        className="bg-[#c19206] text-white px-10 py-4 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-all relative z-10"
                    >
                        REGISTER MY PROFILE
                    </button>
                </div>
            </div>
        </section>
    );
}