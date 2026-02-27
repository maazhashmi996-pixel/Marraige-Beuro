"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '@/Components/ui/ProfileCard';

export default function FindMatch() {
    // State for profiles and loading
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Backend Base URL
    const BASE_URL = "http://localhost:5000";

    // Database se data lane ka function
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Token lena taake backend ko pata chale login kaun hai
                const token = localStorage.getItem("userToken");

                // Hum authenticated route use karenge taake opposite gender mile
                const res = await fetch(`${BASE_URL}/api/users/matches`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch matches");

                const data = await res.json();

                // Data mapping handle karna (Object vs Array)
                const rawProfiles = Array.isArray(data) ? data : (data.profiles || []);

                // Backend data ko ProfileCard ke props ke mutabiq format karna
                const formattedData = rawProfiles.map((p: any) => ({
                    id: p._id,
                    title: p.name || p.title || "No Name",
                    age: p.age || "N/A",
                    status: p.maritalStatus || p.status || 'Single',
                    gender: p.gender || "Not specified",
                    city: p.city || "Pakistan",
                    // Image URL construction logic
                    image: p.mainImage
                        ? (p.mainImage.startsWith('http') ? p.mainImage : `${BASE_URL}${p.mainImage}`)
                        : (p.gallery && p.gallery.length > 0
                            ? (p.gallery[0].startsWith('http') ? p.gallery[0] : `${BASE_URL}${p.gallery[0]}`)
                            : '/placeholder.jpg')
                }));

                setProfiles(formattedData);
            } catch (err) {
                console.error("Error fetching database profiles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[#4a1111]">Find Your Perfect Match</h1>
                    <p className="text-gray-500 mt-2 font-medium">Browse through our verified profiles to find your soulmate.</p>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a1111]"></div>
                        <p className="ml-4 mt-4 font-bold text-[#4a1111]">Loading Profiles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {profiles && profiles.length > 0 ? (
                            profiles.map((p) => (
                                <div key={p.id} className="transition-transform hover:scale-[1.02] duration-300">
                                    <ProfileCard profile={p} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <div className="text-5xl mb-4">📂</div>
                                <p className="text-xl font-bold text-gray-400">No matches found at the moment.</p>
                                <p className="text-sm text-gray-400 mt-1">Please check back later for new profiles.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}