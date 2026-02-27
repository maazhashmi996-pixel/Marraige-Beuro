"use client";
import React, { useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", fatherName: "", age: "", status: "Single",
        caste: "", religion: "Islam", sect: "Sunni",
        profession: "", qualification: "", city: "", description: ""
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
        }
    };

    const handleSubmitData = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // FormData for image upload
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append("packageType", selectedPkg?.name || "");
        files.forEach(file => data.append("photos", file));

        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                body: data,
            });
            if (res.ok) {
                setStep(3); // Move to Payment
            } else {
                alert("Registration fail ho gayi! Data sahi enter karein.");
            }
        } catch (err) {
            alert("Server connection error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* PROGRESS BAR */}
                <div className="flex justify-center items-center mb-12 space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= s ? "bg-[#4a1111] text-white border-[#4a1111]" : "bg-white text-gray-400 border-gray-200"}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-10 md:w-20 h-1 mx-2 ${step > s ? "bg-[#4a1111]" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: PACKAGE SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-[#4a1111] mb-4">Select Membership</h2>
                            <p className="text-gray-500 mb-10 font-medium text-lg">Choose the plan that fits your needs</p>

                            <div className="grid md:grid-cols-3 gap-8">
                                {PACKAGES.map((pkg) => (
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        key={pkg.name}
                                        className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 hover:border-[#c19206] cursor-pointer transition-all flex flex-col justify-between"
                                        onClick={() => { setSelectedPkg(pkg); setStep(2); }}
                                    >
                                        <div>
                                            <h3 className="text-2xl font-black mb-2" style={{ color: pkg.color }}>{pkg.name}</h3>
                                            <p className="text-4xl font-black text-gray-800 my-4">{pkg.price}</p>
                                            <div className="space-y-3 mb-6 text-gray-500 font-semibold">
                                                <p>✓ View {pkg.limit} Profiles</p>
                                                <p>✓ Premium Support</p>
                                                <p>✓ Verified Badges</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 rounded-2xl bg-gray-100 font-bold text-gray-800 hover:bg-[#c19206] hover:text-white transition-colors">
                                            Select {pkg.name}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILED FORM */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black text-[#4a1111]">Create Your Profile</h2>
                                <span className="px-4 py-1 bg-yellow-100 text-[#c19206] rounded-full text-sm font-bold">{selectedPkg?.name} Plan Selected</span>
                            </div>

                            <form onSubmit={handleSubmitData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input type="text" placeholder="Your Name" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input type="text" placeholder="Father Name" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Age" required className="p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        <select className="p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            <option>Single</option>
                                            <option>Divorced</option>
                                            <option>Widow</option>
                                        </select>
                                    </div>
                                    <input type="text" placeholder="Caste (e.g. Rajput, Arain)" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, caste: e.target.value })} />
                                    <select className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, sect: e.target.value })}>
                                        <option>Sunni</option>
                                        <option>Shia</option>
                                        <option>Wahabi</option>
                                        <option>Deobandi</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <input type="text" placeholder="Profession / Job" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                                    <input type="text" placeholder="Qualification" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, qualification: e.target.value })} />
                                    <input type="text" placeholder="City" required className="w-full p-4 rounded-2xl bg-gray-50 border focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    <textarea placeholder="Tell us about yourself..." required className="w-full p-4 rounded-2xl bg-gray-50 border h-24 focus:ring-2 focus:ring-[#c19206] outline-none" onChange={e => setFormData({ ...formData, description: e.target.value })} />

                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Upload 4-5 Photos</label>
                                        <input type="file" multiple accept="image/*" required onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a1111] file:text-white hover:file:bg-black cursor-pointer" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-[#4a1111] text-white rounded-2xl font-black text-xl hover:bg-[#c19206] transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                                    >
                                        {loading ? "Processing..." : "Next: Payment Method"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 3: PAYMENT METHODS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl text-center border-t-8 border-[#c19206]"
                        >
                            <h2 className="text-3xl md:text-4xl font-black text-[#4a1111]">Final Step: Payment</h2>
                            <p className="text-gray-500 mt-2 font-bold italic">Apne selected package ki payment niche diye gaye numbers par karein.</p>

                            <div className="grid md:grid-cols-2 gap-6 my-10">
                                <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-[#c19206] transition-all">
                                    <div className="h-12 flex justify-center mb-4">
                                        <img src="/jazzcash-logo.png" alt="JazzCash" className="object-contain" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-800 tracking-wider">0300-1234567</p>
                                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Title: Muhammad Usman</p>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-[#c19206] transition-all">
                                    <div className="h-12 flex justify-center mb-4">
                                        <img src="/easypaisa-logo.png" alt="EasyPaisa" className="object-contain" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-800 tracking-wider">0345-1234567</p>
                                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Title: Muhammad Usman</p>
                                </div>
                            </div>

                            <div className="bg-green-50 p-8 rounded-[2rem] border-2 border-dashed border-green-200">
                                <p className="font-bold text-green-800 text-lg mb-4 underline">Payment karne ke baad screenshot is WhatsApp par bhejein:</p>
                                <a
                                    href="https://wa.me/923001234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-3xl font-black text-green-600 block hover:scale-105 transition-transform"
                                >
                                    0300-1234567
                                </a>
                            </div>

                            <p className="mt-10 text-gray-500 font-bold flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Admin verification ke baad apka account 1-2 ghante mein approve ho jayega.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}