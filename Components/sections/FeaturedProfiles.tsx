"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '../ui/ProfileCard';

// Ye dummy data tab kaam ayega jab Admin ne koi profile add na ki ho
const defaultProfiles = [
    { id: 'SMB-917', title: 'Private Employee', age: 28, status: 'Single', gender: 'Male', city: 'Lahore', image: '/m1.jpg' },
    { id: 'SMB-825', title: 'Lawyer', age: 28, status: 'Single', gender: 'Female', city: 'Lahore', image: '/f1.jpg' },
    { id: 'SMB-877', title: 'Nurse', age: 32, status: 'Single', gender: 'Female', city: 'Sialkot', image: '/f2.jpg' },
    { id: 'SMB-59', title: 'Govt Employee', age: 28, status: 'Single', gender: 'Male', city: 'Faisalabad', image: '/m2.jpg' },
];

export default function FeaturedProfiles() {
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        // 1. Admin Dashboard se save kiya hua data uthao
        const savedData = localStorage.getItem("profiles");

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Agar Admin ne profiles banayi hain toh wo dikhao, warna dummy dikhao
            setProfiles(parsedData.length > 0 ? parsedData : defaultProfiles);
        } else {
            setProfiles(defaultProfiles);
        }
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
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