"use client";
import React, { useState, useEffect } from "react";
import ProfileCard from '../ui/ProfileCard';
import { Sparkles, Users, ArrowUpRight } from 'lucide-react';

// Centralized Dummy Data
const defaultProfiles = [
    { id: 'SMB-917', title: 'Software Engineer', age: 28, status: 'Single', gender: 'Male', city: 'Lahore', image: '/m1.jpg' },
    { id: 'SMB-825', title: 'Lawyer', age: 28, status: 'Single', gender: 'Female', city: 'Lahore', image: '/f1.jpg' },
    { id: 'SMB-877', title: 'Nurse', age: 32, status: 'Single', gender: 'Female', city: 'Sialkot', image: '/f2.jpg' },
    { id: 'SMB-59', title: 'Govt Employee', age: 28, status: 'Single', gender: 'Male', city: 'Faisalabad', image: '/m2.jpg' },
];

export default function FeaturedProfiles() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // 1. Admin Dashboard se save kiya hua data uthao
        const savedData = localStorage.getItem("profiles");

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setProfiles(parsedData.length > 0 ? parsedData : defaultProfiles);
            } catch (error) {
                console.error("Error parsing profiles:", error);
                setProfiles(defaultProfiles);
            }
        } else {
            setProfiles(defaultProfiles);
        }
        setIsLoaded(true);
    }, []);

    return (
        <section className="py-24 bg-[#fcfdfe] relative overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[100px] opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-[100px] opacity-50 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-blue-600/10 text-blue-600 p-1.5 rounded-lg">
                                <Sparkles size={16} className="fill-blue-600" />
                            </span>
                            <span className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase">
                                Exclusive Members
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                            Featured <span className="text-blue-600">Profiles</span>
                        </h2>
                        <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
                            Discover hand-picked profiles verified by our team. Connect with your perfect match across the country.
                        </p>
                    </div>

                    <button className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-95">
                        View All Profiles
                        <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>

                {/* Grid Layout */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {profiles.map((p, index) => (
                        <div
                            key={p.id}
                            className="group hover:-translate-y-2 transition-all duration-300"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <ProfileCard profile={p} />
                        </div>
                    ))}
                </div>

                {/* Empty State UI */}
                {profiles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                            <Users size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No profiles found</h3>
                        <p className="text-slate-400 mt-2">New featured members will appear here soon.</p>
                    </div>
                )}
            </div>

            {/* Custom Decoration Bottom */}
            <div className="mt-20 flex justify-center items-center gap-4 opacity-20">
                <div className="h-[1px] w-20 bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="h-[1px] w-20 bg-slate-300"></div>
            </div>
        </section>
    );
}