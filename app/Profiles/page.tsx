"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '@/Components/ui/ProfileCard';

export default function FindMatch() {
    // 1. State for profiles and loading
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Backend Base URL (Ensure this matches your Node.js port)
    const BASE_URL = "http://localhost:5000";

    // 2. Database se data lane ka function
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Sahi Backend Route jo aapke server.js mein hai
                const res = await fetch(`${BASE_URL}/api/public/profiles`);

                if (!res.ok) throw new Error("Failed to fetch from server");

                const data = await res.json();

                // Backend data ko ProfileCard ke format mein map karna
                const formattedData = data.map((p: any) => ({
                    id: p._id,
                    // Schema mein 'name' required hai, wahi hamara title banega
                    title: p.name || p.title || "No Name",
                    age: p.age,
                    status: p.status || 'Single',
                    gender: p.gender,
                    city: p.city,
                    // Image logic: Agar full URL hai to wahi dikhaye, warna BASE_URL jorein
                    image: p.mainImage
                        ? (p.mainImage.startsWith('http') ? p.mainImage : `${BASE_URL}${p.mainImage}`)
                        : '/placeholder.jpg'
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
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[#4a1111]">Find Your Perfect Match</h1>
                    <p className="text-gray-500 mt-2">Browse through our verified profiles to find your soulmate.</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a1111]"></div>
                        <p className="ml-4 font-bold text-[#4a1111]">Loading Database Profiles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {profiles.length > 0 ? (
                            profiles.map((p) => (
                                <ProfileCard key={p.id} profile={p} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border">
                                <p className="text-xl font-bold text-gray-400">No profiles found in database.</p>
                                <p className="text-sm text-gray-400">Please add profiles from Admin Panel.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}