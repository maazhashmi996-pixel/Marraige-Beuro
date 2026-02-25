"use client";

import { useEffect, useState } from 'react';
import { fetchMatches, unlockProfile } from '@/services/api';
import { toast } from 'react-hot-toast';

interface UserProfile {
    _id: string;
    name: string;
    age: number;
    city: string;
    caste: string;
    mainImage: string; // Backend sends this
    gallery: string[]; // Backend sends this
    phone?: string;
    about?: string;
    education?: string;
    profession?: string;
    isLocked: boolean;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<UserProfile[]>([]);
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchMatches();

            if (res.data?.success) {
                setMatches(res.data.profiles || []);
                setCredits(res.data.credits ?? 0);
            } else {
                const profileData = Array.isArray(res.data) ? res.data : (res.data?.profiles || []);
                setMatches(profileData);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError("Database se data nahi mil raha. Check karein ke backend chal raha hai.");
            toast.error("Failed to load matches");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (id: string) => {
        if (credits <= 0) {
            alert("⚠️ Aapki limit khatam ho chuki hai! Mazeed profiles ke liye package upgrade karein.");
            return;
        }

        if (!confirm(`Kya aap 1 credit use karke contact details dekhna chahte hain? (Baqi: ${credits})`)) return;

        try {
            const res = await unlockProfile(id);
            if (res.data?.success) {
                toast.success("Profile Unlocked!");
                if (res.data?.credits !== undefined) {
                    setCredits(res.data.credits);
                }
                await loadData();
                setSelectedProfile(null);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Unlock failed.";
            toast.error(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4a1111] border-t-transparent"></div>
                <p className="mt-4 font-bold text-[#4a1111]">Behtareen Rishtay Talash Kar Rahe Hain...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#4a1111]">Recommended Matches</h1>
                    <p className="text-gray-500 font-medium italic">Find your perfect soulmate</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#4a1111] to-[#7a1a1a] text-white px-6 py-2 rounded-2xl shadow-lg text-center">
                        <p className="text-[10px] uppercase opacity-80 font-bold tracking-widest">Available Credits</p>
                        <p className="text-2xl font-black">{credits}</p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center mb-6 font-bold border border-red-100 italic">
                    {error}
                </div>
            )}

            {/* Profiles Grid */}
            {matches.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg font-medium">Abhi koi matches available nahi hain.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match) => (
                        <div key={match._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
                            {/* Image Container - FIXED VARIABLE NAME */}
                            <div className="relative h-80 w-full overflow-hidden">
                                <img
                                    src={match.mainImage || (match.gallery && match.gallery[0]) || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt={match.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {match.isLocked && (
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-start justify-end p-4">
                                        <span className="bg-white/90 text-[#4a1111] px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                                            Locked 🔒
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">{match.name}, {match.age}</h2>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-pink-50 text-pink-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">{match.city}</span>
                                        <span className="bg-gray-100 text-gray-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">{match.caste}</span>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-3">
                                    <button
                                        onClick={() => setSelectedProfile(match)}
                                        className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        View Full Details
                                    </button>

                                    {match.isLocked ? (
                                        <button
                                            onClick={() => handleUnlock(match._id)}
                                            className="w-full py-4 bg-[#4a1111] text-white rounded-xl font-black shadow-lg hover:shadow-[#4a1111]/30 transition-all active:scale-95"
                                        >
                                            Unlock Number 🔑
                                        </button>
                                    ) : (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                                            <p className="text-xs text-green-600 font-black uppercase mb-1">Verified Contact</p>
                                            <p className="text-xl font-black text-green-800">{match.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full Details Modal */}
            {selectedProfile && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute top-5 right-5 z-10 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl hover:bg-white transition-colors"
                        >
                            ✕
                        </button>

                        {/* Modal Header Image */}
                        <div className="h-64 w-full relative">
                            <img
                                src={selectedProfile.mainImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                alt={selectedProfile.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <h2 className="text-3xl font-black text-white">{selectedProfile.name}, {selectedProfile.age}</h2>
                                <p className="text-white/80 font-medium">{selectedProfile.city} • {selectedProfile.caste}</p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-sm uppercase font-black text-[#4a1111] mb-2 tracking-widest">About Me</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {selectedProfile.about || "A private person who values family and traditions."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Education</p>
                                    <p className="font-bold text-gray-800">{selectedProfile.education || 'Master\'s Degree'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Profession</p>
                                    <p className="font-bold text-gray-800">{selectedProfile.profession || 'Business/Service'}</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                {selectedProfile.isLocked ? (
                                    <button
                                        onClick={() => handleUnlock(selectedProfile._id)}
                                        className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-black shadow-lg"
                                    >
                                        Unlock Contact to Connect
                                    </button>
                                ) : (
                                    <div className="bg-green-600 text-white p-4 rounded-2xl text-center shadow-lg">
                                        <p className="text-xs font-bold uppercase opacity-80">Phone Number</p>
                                        <p className="text-2xl font-black">{selectedProfile.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}