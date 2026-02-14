"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Redirection ke liye import
import ProfileCard from '../ui/ProfileCard';

// Ye dummy data tab kaam ayega jab Admin ne koi profile add na ki ho
const defaultProfiles = [
    { id: 'SMB-917', title: 'Software Engineer', age: 28, status: 'Single', gender: 'Male', city: 'Lahore', image: '/m1.jpg' },
    { id: 'SMB-825', title: 'Lawyer', age: 28, status: 'Single', gender: 'Female', city: 'Lahore', image: '/f1.jpg' },
    { id: 'SMB-877', title: 'Nurse', age: 32, status: 'Single', gender: 'Female', city: 'Sialkot', image: '/f2.jpg' },
    { id: 'SMB-59', title: 'Govt Employee', age: 28, status: 'Single', gender: 'Male', city: 'Faisalabad', image: '/m2.jpg' },
];

export default function FeaturedProfiles() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isAuthorized, setIsAuthorized] = useState(false); // Auth state
    const router = useRouter();

    useEffect(() => {
        // 1. Pehle check karo ke user logged in hai ya nahi
        const authStatus = localStorage.getItem("isAdminLoggedIn");

        if (authStatus !== "true") {
            // Agar login nahi hai toh login page pe bhej do
            router.push("/login");
        } else {
            // Agar login hai toh authorization true karo aur data load karo
            setIsAuthorized(true);

            // 2. Admin Dashboard se save kiya hua data uthao (Aapka original logic)
            const savedData = localStorage.getItem("profiles");

            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setProfiles(parsedData.length > 0 ? parsedData : defaultProfiles);
            } else {
                setProfiles(defaultProfiles);
            }
        }
    }, [router]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        router.push("/login");
    };

    // Jab tak authentication check ho raha hai, tab tak screen khali rakho
    if (!isAuthorized) {
        return null;
    }

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">

                {/* Logout Button (Optional) */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-[#4a1111]">Featured Profiles</h2>
                    <div className="w-20 h-1.5 bg-[#c19206] mx-auto mt-4"></div>
                    <p className="text-gray-500 mt-6">
                        Explore top-rated profiles carefully selected to match your interests.
                    </p>
                </div>

                {/* Grid layout for profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {profiles.map((p) => (
                        <ProfileCard key={p.id} profile={p} />
                    ))}
                </div>

                {/* Empty State message (Optional) */}
                {profiles.length === 0 && (
                    <div className="text-center py-10 text-gray-400 italic">
                        No profiles available at the moment.
                    </div>
                )}
            </div>
        </section>
    );
}