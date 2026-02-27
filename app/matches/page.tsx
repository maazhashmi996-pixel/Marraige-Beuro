"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMatches, unlockProfile } from '@/services/api';
import { toast } from 'react-hot-toast';

interface UserProfile {
    _id: string;
    name: string;
    age: number;
    gender: string;
    city: string;
    caste: string;
    mainImage: string;
    gallery: string[];
    phone?: string;
    about?: string;
    education?: string;
    profession?: string;
    maritalStatus?: string;
    religion?: string;
    sect?: string;
    monthlyIncome?: string;
    familyDetails?: string;
    isLocked: boolean;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<UserProfile[]>([]);
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
    const [unlockedProfiles, setUnlockedProfiles] = useState<string[]>([]);

    const router = useRouter();

    /**
     * AUTO LOGOUT LOGIC (30 Minutes)
     */
    const handleLogout = useCallback((message?: string) => {
        localStorage.clear();
        if (message) toast.error(message);
        router.replace("/login");
    }, [router]);

    const checkSessionTimeout = useCallback(() => {
        const loginTime = localStorage.getItem("loginTimestamp");
        if (loginTime) {
            const currentTime = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;
            if (currentTime - parseInt(loginTime) > thirtyMinutes) {
                handleLogout("Session expired after 30 minutes!");
            }
        }
    }, [handleLogout]);

    /**
     * DATA LOADING & FILTERING LOGIC
     */
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("userToken");
            const userGender = localStorage.getItem("userGender")?.toLowerCase(); // 'male' or 'female'

            const res = await fetchMatches();

            if (res.data?.success) {
                let allProfiles = res.data.profiles || [];

                // Gender Filtering Logic
                if (token && userGender) {
                    // Agar logged in hai: filter out same gender
                    const filtered = allProfiles.filter((p: UserProfile) =>
                        p.gender?.toLowerCase() !== userGender
                    );
                    setMatches(filtered);
                } else {
                    // Agar logged out hai: Show everything (Public View)
                    setMatches(allProfiles);
                }

                setCredits(res.data.credits ?? 0);
                setUnlockedProfiles(res.data.unlockedProfiles || []);
            }
        } catch (err: any) {
            console.error("Data load error:", err);
            if (err.response?.status === 401 && localStorage.getItem("userToken")) {
                handleLogout();
            }
            // Agar logout hai to error toast nahi dikhayenge taake public view chalta rahe
        } finally {
            setLoading(false);
        }
    }, [handleLogout]);

    useEffect(() => {
        loadData();
        checkSessionTimeout();

        // Session check every minute
        const interval = setInterval(checkSessionTimeout, 60000);
        return () => clearInterval(interval);
    }, [loadData, checkSessionTimeout]);

    const handleUnlock = async (id: string) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.error("Contact dekhne ke liye login karein!");
            router.push("/login");
            return;
        }

        if (credits <= 0) {
            toast.error("Credits khatam! Package upgrade karein.");
            return;
        }

        if (!confirm("1 Credit istimal hoga. Kya aap razi hain?")) return;

        try {
            const res = await unlockProfile(id);
            if (res.data?.success) {
                toast.success("Profile Unlocked!");
                // Refresh local data
                loadData();
                // Update selected profile if modal is open
                const updatedMatch = matches.find(m => m._id === id);
                if (updatedMatch) setSelectedProfile(updatedMatch);
            }
        } catch (err: any) {
            toast.error("Unlock fail ho gaya.");
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4a1111]"></div>
            <p className="mt-4 font-bold text-[#4a1111]">Loading Matches...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">

            {/* Header / Navigation Section */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-8 flex justify-between items-center border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-[#4a1111]">
                        {localStorage.getItem("userToken") ? "Perfect Matches" : "Public Profiles"}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">Find your soulmate today</p>
                </div>

                <div className="flex items-center gap-4">
                    {localStorage.getItem("userToken") ? (
                        <div className="flex items-center gap-4 bg-gray-50 p-2 px-4 rounded-3xl border border-gray-100">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Credits</p>
                                <p className="text-xl font-black text-[#4a1111]">{credits}</p>
                            </div>
                            <button onClick={() => router.push('/packages')} className="bg-[#4a1111] text-white w-10 h-10 rounded-2xl hover:scale-105 transition-all font-bold">+</button>
                        </div>
                    ) : (
                        <button onClick={() => router.push('/login')} className="bg-[#4a1111] text-white px-6 py-2 rounded-full font-bold shadow-lg">Login</button>
                    )}
                </div>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map((match) => {
                    const isAlreadyUnlocked = unlockedProfiles.includes(match._id);
                    return (
                        <div key={match._id} className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="relative h-80 overflow-hidden">
                                <img src={match.mainImage} alt={match.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h2 className="text-2xl font-bold">{match.name}, {match.age}</h2>
                                    <p className="text-sm opacity-80 uppercase tracking-wider">{match.city} • {match.caste}</p>
                                </div>
                                {!isAlreadyUnlocked && (
                                    <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] text-white font-bold tracking-widest uppercase">
                                        Locked 🔒
                                    </div>
                                )}
                            </div>

                            <div className="p-6 mt-auto">
                                <button
                                    onClick={() => setSelectedProfile(match)}
                                    className={`w-full py-4 rounded-2xl font-black transition-all ${isAlreadyUnlocked
                                        ? 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
                                        : 'bg-[#4a1111] text-white shadow-lg shadow-[#4a1111]/20 hover:bg-black'
                                        }`}
                                >
                                    {isAlreadyUnlocked ? 'View Saved Profile' : 'View Full Profile'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FULLY DETAILED MODAL */}
            {selectedProfile && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">

                        <div className="relative h-80 bg-gray-200">
                            <img src={selectedProfile.mainImage} className="w-full h-full object-cover" alt="Main Profile" />
                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="absolute top-6 right-6 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-lg hover:bg-black transition-colors"
                            > × </button>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-[#4a1111]">{selectedProfile.name}, {selectedProfile.age}</h2>
                                    <p className="text-[#c19206] font-bold tracking-wide uppercase text-sm mt-1">{selectedProfile.city} • {selectedProfile.caste}</p>
                                </div>
                                <div className="bg-gray-50 px-5 py-2 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                                    <p className="font-bold text-[#4a1111]">{selectedProfile.maritalStatus || 'Single'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                <DetailBox label="Profession" value={selectedProfile.profession} />
                                <DetailBox label="Education" value={selectedProfile.education} />
                                <DetailBox label="Income" value={selectedProfile.monthlyIncome} />
                                <DetailBox label="Religion" value={selectedProfile.religion} />
                                <DetailBox label="Sect" value={selectedProfile.sect} />
                                <DetailBox label="Caste" value={selectedProfile.caste} />
                            </div>

                            {/* Gallery, About, and Family sections remain same as your UI... */}
                            <div className="space-y-6 mb-8">
                                {selectedProfile.about && (
                                    <div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">About Myself</p>
                                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">"{selectedProfile.about}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Button Section */}
                            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100">
                                {unlockedProfiles.includes(selectedProfile._id) ? (
                                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-[2.5rem] text-center">
                                        <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Contact Number</p>
                                        <a href={`tel:${selectedProfile.phone}`} className="text-3xl font-black text-green-700 block">
                                            {selectedProfile.phone}
                                        </a>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUnlock(selectedProfile._id)}
                                        className="w-full py-5 bg-[#4a1111] text-white rounded-[2.5rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                                    >
                                        <span>Unlock Phone Number</span>
                                        <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold">1 Credit</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailBox({ label, value }: { label: string, value?: string }) {
    return (
        <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex flex-col justify-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-1 tracking-tighter">{label}</p>
            <p className="font-bold text-[#4a1111] text-[13px] leading-tight break-words">
                {value && value !== "" ? value : 'Not Disclosed'}
            </p>
        </div>
    );
}