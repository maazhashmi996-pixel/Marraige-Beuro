"use client";

import { useEffect, useState } from 'react';
import { fetchMatches, unlockProfile } from '@/services/api';

// 1. TypeScript Interface
interface UserProfile {
    _id: string;
    name: string;
    age: number;
    city: string;
    caste: string;
    images: string[];
    phone?: string;
    familyDetails?: string;
    isLocked: boolean;
}

export default function MatchesPage() {
    // Logic: Initialize as empty array [] to prevent .length error
    const [matches, setMatches] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await fetchMatches();

            // Logic Check: Handling different response structures safely
            // Agar backend res.data.profiles bhej raha hai ya sirf res.data
            const profileData = res.data?.profiles || res.data || [];

            setMatches(Array.isArray(profileData) ? profileData : []);
            setError(null);
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError("Rishtay load karne mein masla pesh aa raha hai.");
            // Prevent undefined state on error
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (id: string) => {
        if (!confirm("Kya aap 1 credit use karke contact details dekhna chahte hain?")) return;

        try {
            const res = await unlockProfile(id);
            if (res.data?.success || res.data?.message === "Already unlocked") {
                alert("Profile Unlocked Successfully!");
                loadData();
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Limit khatam ho chuki hai ya server error hai.";
            alert(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a1111]"></div>
                <p className="ml-3 font-semibold text-gray-600">Loading Matches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center mt-20">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button onClick={loadData} className="bg-[#4a1111] text-white px-6 py-2 rounded-full">Try Again</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-10 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#4a1111]">Recommended Matches</h1>
                    <p className="text-gray-500">Aapke liye behtareen rishtay</p>
                </div>
                <button onClick={loadData} className="text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200">
                    🔄 Refresh
                </button>
            </header>

            {/* Safe Check using optional chaining and default empty array logic */}
            {(matches || []).length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <p className="text-gray-400">Filhal koi matches available nahi hain.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match) => (
                        <div key={match._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                            {/* Image Container */}
                            <div className="relative h-64 w-full">
                                <img
                                    src={(match.images && match.images[0]) || '/placeholder-avatar.png'}
                                    alt={match.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {match.isLocked && (
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full">
                                        🔒
                                    </div>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="p-6 flex-grow">
                                <h2 className="text-2xl font-bold text-gray-800">{match.name}, {match.age}</h2>
                                <div className="flex gap-2 mt-2">
                                    <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-md font-medium">{match.city}</span>
                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">{match.caste}</span>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {match.isLocked ? (
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300">
                                            <p className="text-sm text-gray-400 font-mono text-center mb-3">Phone: +92-XXX-XXXXXXX</p>
                                            <button
                                                onClick={() => handleUnlock(match._id)}
                                                className="w-full bg-[#4a1111] hover:bg-[#631818] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                                            >
                                                Unlock Contact Details
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Verified Contact</span>
                                                <span className="text-lg">✅</span>
                                            </div>
                                            <p className="text-xl font-bold text-green-800 mb-3">{match.phone}</p>
                                            <a
                                                href={`tel:${match.phone}`}
                                                className="w-full block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-900/20 transition-all"
                                            >
                                                📞 Call Now
                                            </a>
                                            {match.familyDetails && (
                                                <p className="mt-3 text-xs text-gray-600 italic">" {match.familyDetails} "</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}