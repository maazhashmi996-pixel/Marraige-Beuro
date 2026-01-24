"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileInquiryForm({ profileId, onClose }: { profileId: string, onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Yahan hum baad mein backend API call add karenge
        setTimeout(() => {
            alert("Application Submitted Successfully!");
            setLoading(false);
            onClose();
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c19206]/20"
        >
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-black text-[#4a1111]">Advance Inquiry Form</h2>
                    <p className="text-sm text-[#c19206] font-bold">Applying for Profile: {profileId}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">File Number</label>
                    <input type="text" defaultValue={profileId} readOnly className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Marital Status</label>
                    <select required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]">
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Divorced</option>
                        <option>Widow</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Gender</label>
                    <select required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]">
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Caste</label>
                    <input type="text" placeholder="e.g. Rajput" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Age From</label>
                    <input type="number" placeholder="e.g. 20" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Age To</label>
                    <input type="number" placeholder="e.g. 40" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Religion</label>
                    <select className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]">
                        <option>Islam</option>
                        <option>Christianity</option>
                        <option>Hinduism</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Sect</label>
                    <select className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]">
                        <option>Sunni</option>
                        <option>Shia</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Row 3 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Profession</label>
                    <input type="text" placeholder="Your Job" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Qualification</label>
                    <input type="text" placeholder="e.g. Masters" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">Country</label>
                    <input type="text" defaultValue="Pakistan" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">City</label>
                    <input type="text" placeholder="Your City" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-[#c19206]" />
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-4 mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-black shadow-xl hover:bg-[#c19206] transition-all transform active:scale-95"
                    >
                        {loading ? "Saving Information..." : "Submit Inquiry to Database"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}