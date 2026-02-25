"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface Package {
    name: "Basic" | "Gold" | "Diamond";
    price: string;
    limit: number;
    color: string;
}

const PACKAGES: Package[] = [
    { name: "Basic", price: "Rs. 2,000", limit: 10, color: "#4a1111" },
    { name: "Gold", price: "Rs. 5,000", limit: 20, color: "#c19206" },
    { name: "Diamond", price: "Rs. 10,000", limit: 30, color: "#1a1a1a" },
];

export default function RegistrationFlow() {
    const [step, setStep] = useState(1); // 1: Package, 2: Form, 3: Payment
    const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        name: "", fatherName: "", age: "", status: "Single",
        caste: "", religion: "Islam", sect: "Sunni",
        profession: "", qualification: "", city: "", description: ""
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleSubmitData = async (e: React.FormEvent) => {
        e.preventDefault();

        // FormData use karenge kyunke images upload karni hain
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append("packageType", selectedPkg?.name || "");
        files.forEach(file => data.append("photos", file));

        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                body: data,
            });
            if (res.ok) setStep(3); // Go to Payment Step
        } catch (err) {
            alert("Registration fail ho gayi!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto">

                {/* STEP 1: PACKAGE SELECTION */}
                {step === 1 && (
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-[#4a1111] mb-10">Select Your Membership</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {PACKAGES.map((pkg) => (
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    key={pkg.name}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 hover:border-[#c19206] cursor-pointer"
                                    onClick={() => { setSelectedPkg(pkg); setStep(2); }}
                                >
                                    <h3 className="text-2xl font-black" style={{ color: pkg.color }}>{pkg.name}</h3>
                                    <p className="text-4xl font-black my-4">{pkg.price}</p>
                                    <p className="text-gray-500 font-bold">View {pkg.limit} Profiles</p>
                                    <button className="mt-6 w-full py-3 rounded-xl bg-gray-100 font-bold">Select Plan</button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: DETAILED FORM */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl">
                        <h2 className="text-3xl font-black text-[#4a1111] mb-6">Create Your Profile</h2>
                        <form onSubmit={handleSubmitData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <input type="text" placeholder="Your Name" required className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <input type="text" placeholder="Father Name" required className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Age" className="p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                    <select className="p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option>Single</option>
                                        <option>Divorced</option>
                                        <option>Widow</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Caste (e.g. Rajput, Arain)" className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, caste: e.target.value })} />
                                <select className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, sect: e.target.value })}>
                                    <option>Sunni</option>
                                    <option>Shia</option>
                                    <option>Wahabi</option>
                                    <option>Deobandi</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <input type="text" placeholder="Profession / Job" className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                                <input type="text" placeholder="Qualification" className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, qualification: e.target.value })} />
                                <input type="text" placeholder="City" className="w-full p-4 rounded-2xl bg-gray-50 border" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                <textarea placeholder="Tell us about yourself..." className="w-full p-4 rounded-2xl bg-gray-50 border h-24" onChange={e => setFormData({ ...formData, description: e.target.value })} />

                                <label className="block text-sm font-bold text-gray-500">Upload 4-5 Photos</label>
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full text-sm" />

                                <button type="submit" className="w-full py-5 bg-[#4a1111] text-white rounded-2xl font-black text-xl hover:bg-[#c19206] transition-all">
                                    Next: Payment Method
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* STEP 3: PAYMENT METHODS */}
                {step === 3 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border-t-8 border-[#c19206]">
                        <h2 className="text-3xl font-black text-[#4a1111]">Final Step: Payment</h2>
                        <p className="text-gray-500 mt-2">Apne select kiye gaye package ki payment niche diye gaye numbers par karein.</p>

                        <div className="grid md:grid-cols-2 gap-6 my-10">
                            <div className="p-6 bg-gray-50 rounded-3xl border">
                                <img src="/jazzcash-logo.png" className="h-10 mx-auto mb-4" alt="JazzCash" />
                                <p className="text-xl font-black">0300-1234567</p>
                                <p className="text-sm font-bold text-gray-400">Title: Muhammad Usman</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border">
                                <img src="/easypaisa-logo.png" className="h-10 mx-auto mb-4" alt="EasyPaisa" />
                                <p className="text-xl font-black">0345-1234567</p>
                                <p className="text-sm font-bold text-gray-400">Title: Muhammad Usman</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-2xl border-2 border-dashed border-green-200">
                            <p className="font-bold text-green-700">Payment karne ke baad screenshot is WhatsApp par bhejein:</p>
                            <a href="https://wa.me/923001234567" className="text-2xl font-black text-green-600 underline">0300-1234567</a>
                        </div>

                        <p className="mt-8 text-sm text-gray-400 italic">Admin verify karne ke baad apka account 1-2 ghante mein approve kar dega.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}