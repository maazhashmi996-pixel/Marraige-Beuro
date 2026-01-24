"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';

// Profile ki dummy data type
interface ProfileData {
    id: string;
    title: string;
    age: number;
    status: string;
    gender: string;
    city: string;
    image: string;
}

export default function ProfileCard({ profile }: { profile: ProfileData }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] shadow-lg overflow-hidden border border-gray-100 group"
            >
                {/* Profile Image */}
                <div className="relative h-72 overflow-hidden">
                    <img
                        src={profile.image}
                        alt={profile.id}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Profile Info */}
                <div className="p-6 text-center space-y-2">
                    <h3 className="text-[#4a1111] font-bold text-xl tracking-wider">{profile.id}</h3>
                    <p className="font-semibold text-gray-700">{profile.title}</p>
                    <p className="text-sm text-gray-500">
                        {profile.age} | {profile.status} | {profile.gender}
                    </p>
                    <p className="text-sm text-gray-500">{profile.city} | Pakistan</p>

                    <div className="pt-4 flex items-center justify-between border-t mt-4">
                        <button className="text-pink-500 flex items-center gap-1 text-sm font-bold">
                            <Heart size={18} /> 42
                        </button>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-[#c19206] flex items-center gap-1 text-sm font-bold hover:underline"
                        >
                            <Eye size={18} /> View Profile
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Popup Form (Inquiry Modal) */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10"
                        >
                            <h2 className="text-2xl font-black text-[#4a1111] text-center mb-2">Unlock Profile</h2>
                            <p className="text-center text-gray-500 text-sm mb-8">Enter details to see full info of {profile.id}</p>

                            <form className="space-y-4">
                                <input type="text" placeholder="Your Name" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#c19206]" />
                                <input type="text" placeholder="Phone / WhatsApp" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#c19206]" />
                                <input type="text" placeholder="Your City" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#c19206]" />

                                <button
                                    type="button"
                                    className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-bold shadow-lg hover:bg-[#c19206] transition-all"
                                >
                                    Request Full Access
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}