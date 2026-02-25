"use client";

import { useEffect, useState } from 'react';
import { fetchMatches, unlockProfile } from '@/services/api';

// 1. Updated Interface
interface UserProfile {
    _id: string;
    name: string;
    age: number;
    city: string;
    caste: string;
    images: string[];
    phone?: string;
    about?: string;
    education?: string;
    profession?: string;
    familyDetails?: string;
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

            // Backend structure check: data.profiles ya direct data array
            const profileData = res.data?.profiles || (Array.isArray(res.data) ? res.data : []);
            const userCredits = res.data?.credits ?? 0;

            setMatches(profileData);
            setCredits(userCredits);
        } catch (err: any) {
            console.error("Fetch Error details:", err);
            setError("Server se rabta nahi ho pa raha. Check karein ke backend running hai.");
            setMatches([]);
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
            if (res.data?.success || res.data?.message === "Already unlocked") {
                alert("Profile Unlocked Successfully!");

                // State update immediately from response
                if (res.data?.credits !== undefined) {
                    setCredits(res.data.credits);
                }

                // Refresh list for phone numbers
                await loadData();
                setSelectedProfile(null);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Unlock failed. Please try again.";
            alert(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a1111]"></div>
                <p className="ml-3 font-semibold text-gray-600">Loading Matches...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <header className="flex justify-between items-center mb-10 border-b pb-6 bg-white p-6 rounded-3xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#4a1111]">Recommended Matches</h1>
                    <p className="text-gray-500 font-medium">Aapke liye behtareen rishtay</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#4a1111] text-white px-6 py-2 rounded-2xl shadow-md text-center">
                        <p className="text-[10px] uppercase opacity-80 font-bold">Visits Left</p>
                        <p className="text-xl font-black">{credits}</p>
                    </div>
                    <button onClick={loadData} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-90">
                        🔄
                    </button>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center mb-6 font-bold border border-red-100">
                    {error}
                </div>
            )}

            {/* Grid Section */}
            {matches.length === 0 && !loading ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">Filhal koi matches available nahi hain.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match) => (
                        <div key={match._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">

                            <div className="relative h-72 w-full overflow-hidden">
                                <img
                                    src={(match.images && match.images[0]) || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt={match.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {match.isLocked && (
                                    <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                                        🔒 Locked
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">{match.name}, {match.age}</h2>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-red-50 text-red-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">{match.city}</span>
                                        <span className="bg-gray-100 text-gray-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">{match.caste}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={() => setSelectedProfile(match)}
                                        className="w-full py-3 bg-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-gray-200 transition-colors active:scale-95"
                                    >
                                        View Full Profile
                                    </button>

                                    {match.isLocked ? (
                                        <button
                                            onClick={() => handleUnlock(match._id)}
                                            disabled={credits <= 0}
                                            className={`w-full py-4 rounded-2xl text-sm font-black shadow-lg transition-all active:scale-95 ${credits > 0
                                                    ? 'bg-[#4a1111] hover:bg-[#631818] text-white shadow-red-900/20'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            Unlock Contact Details 🔒
                                        </button>
                                    ) : (
                                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                            <p className="text-center text-green-800 font-black text-lg">{match.phone}</p>
                                            <a href={`tel:${match.phone}`} className="block text-center text-xs text-green-600 font-bold mt-1 underline">Call Now</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- FULL PROFILE MODAL --- */}
            {selectedProfile && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute top-6 right-6 bg-gray-100 hover:bg-red-100 hover:text-red-600 p-4 rounded-full z-10 font-bold transition-all"
                        >
                            ✕
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
                            {/* Left: Gallery */}
                            <div className="space-y-4">
                                <div className="h-[400px] rounded-[2.5rem] overflow-hidden shadow-inner bg-gray-100">
                                    <img
                                        src={selectedProfile.images[0] || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedProfile.images.slice(1, 4).map((img, i) => (
                                        <div key={i} className="h-28 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                            <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Info */}
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h2 className="text-4xl font-black text-[#4a1111] leading-tight">{selectedProfile.name}</h2>
                                    <p className="text-xl text-gray-500 font-medium">{selectedProfile.city} • {selectedProfile.age} Years</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-[2rem] flex-grow space-y-6">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-2">Biography</h3>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {selectedProfile.about || "Is user ne abhi biography likhi nahi hai."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        <div className="bg-white p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Education</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedProfile.education || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Profession</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedProfile.profession || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Caste</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedProfile.caste}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedProfile.isLocked ? 'Contact Locked' : 'Verified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {selectedProfile.isLocked ? (
                                        <button
                                            onClick={() => handleUnlock(selectedProfile._id)}
                                            className="w-full py-5 bg-[#4a1111] text-white rounded-3xl text-lg font-black shadow-xl hover:shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95"
                                        >
                                            Unlock Number for 1 Credit
                                        </button>
                                    ) : (
                                        <div className="bg-green-600 text-white p-6 rounded-[2.5rem] text-center shadow-lg">
                                            <p className="text-xs opacity-80 uppercase font-black tracking-widest">Verified Phone</p>
                                            <p className="text-3xl font-black">{selectedProfile.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}