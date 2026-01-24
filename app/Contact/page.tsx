"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import ProfileInquiryForm from '@/Components/forms/ProfileInquiryForm';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-[#4a1111] py-20 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black italic"
                >
                    Contact Us
                </motion.h1>
                <p className="text-[#c19206] mt-4 font-bold tracking-widest uppercase text-sm">
                    Sehar Marriage Bureau - Get in Touch
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Side: Contact Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { icon: <Phone size={24} />, label: "Phone", val: "+92 327 7770361" },
                            { icon: <Mail size={24} />, label: "Email", val: "Info@sehrishmarriage.com" },
                            { icon: <MapPin size={24} />, label: "Address", val: "2, H Block Sector 2, DHA Rahbar, Lahore" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
                            >
                                <div className="bg-[#c19206]/10 p-4 rounded-2xl text-[#c19206]">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-gray-800 font-bold">{item.val}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Timings Card */}
                        <div className="bg-[#4a1111] p-8 rounded-[2.5rem] text-white shadow-xl">
                            <h4 className="font-bold text-xl mb-4 text-[#c19206]">Office Hours</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex justify-between"><span>Mon - Sat:</span> <span>10:00 AM - 08:00 PM</span></li>
                                <li className="flex justify-between"><span>Sunday:</span> <span className="text-[#c19206]">Closed</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: The Advance Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] shadow-2xl p-2 sm:p-4 overflow-hidden">
                            {/* Form Component Call */}
                            <ProfileInquiryForm
                                profileId="SMB-GENERAL"
                                onClose={() => console.log("Form closed from contact page")}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}