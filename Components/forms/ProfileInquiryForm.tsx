"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FormProps {
    profileId: string;
    onClose: () => void;
}

export default function ProfileInquiryForm({ profileId, onClose }: FormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // 1. Sara form data akatha karein
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        const newInquiry = {
            profileId: profileId,
            maritalStatus: formData.get('maritalStatus'),
            gender: formData.get('gender'),
            caste: formData.get('caste') || 'N/A',
            ageFrom: formData.get('ageFrom'),
            ageTo: formData.get('ageTo'),
            religion: formData.get('religion'),
            sect: formData.get('sect'),
            profession: formData.get('profession') || 'N/A',
            qualification: formData.get('qualification') || 'N/A',
            country: formData.get('country'),
            city: formData.get('city') || 'N/A',
            date: new Date().toLocaleString(), // Time record ke liye
        };

        // 2. LocalStorage se purani inquiries nikaal kar nayi add karein
        const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const updatedInquiries = [newInquiry, ...existingInquiries];
        localStorage.setItem('inquiries', JSON.stringify(updatedInquiries));

        // 3. Success message aur close
        setTimeout(() => {
            alert("Success! Your inquiry has been sent to the Admin.");
            setLoading(false);
            onClose();
            // Optional: Agar aap chahte hain dashboard foran update ho toh page refresh kr dein
            // window.location.reload(); 
        }, 1000);
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
                <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl transition-colors">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">File Number</label>
                    <input type="text" name="profileId" value={profileId} readOnly className="w-full p-3 bg-gray-100 rounded-xl border-none ring-1 ring-gray-200 text-gray-500 font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Marital Status</label>
                    <select name="maritalStatus" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none">
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Divorced</option>
                        <option>Widow</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Gender</label>
                    <select name="gender" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none">
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Caste</label>
                    <input type="text" name="caste" placeholder="e.g. Rajput" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Age From</label>
                    <input type="number" name="ageFrom" placeholder="20" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Age To</label>
                    <input type="number" name="ageTo" placeholder="40" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Religion</label>
                    <select name="religion" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 outline-none">
                        <option>Islam</option>
                        <option>Christianity</option>
                        <option>Hinduism</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sect</label>
                    <select name="sect" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 outline-none">
                        <option>Sunni</option>
                        <option>Shia</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Row 3 */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Profession</label>
                    <input type="text" name="profession" placeholder="Your Job" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Qualification</label>
                    <input type="text" name="qualification" placeholder="e.g. Masters" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Country</label>
                    <input type="text" name="country" defaultValue="Pakistan" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">City</label>
                    <input type="text" name="city" placeholder="Your City" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c19206] outline-none" />
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-4 mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4a1111] text-white rounded-2xl font-black shadow-xl hover:bg-[#c19206] transition-all transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : "Submit Inquiry to Database"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}