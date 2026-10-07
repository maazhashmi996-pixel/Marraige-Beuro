"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface Package {
    name: "Basic Plan" | "Gold Plan" | "Diamond Plan";
    price: string;
    limit: number | string;
    color: string;
}

const PACKAGES: Package[] = [
    { name: "Basic Plan", price: "Rs. 2,000", limit: 3, color: "#4a1111" },
    { name: "Gold Plan", price: "Rs. 5,000", limit: 10, color: "#c19206" },
    { name: "Diamond Plan", price: "Rs. 10,000", limit: "Unlimited", color: "#1a1a1a" },
];

export default function RegistrationFlow() {
    const [step, setStep] = useState(1);
    const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    // Backend URL from Environment Variable
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const [formData, setFormData] = useState({
        name: "", email: "", password: "", fatherName: "", age: "", gender: "Female",
        maritalStatus: "Single", caste: "", religion: "Islam", sect: "Sunni",
        profession: "", education: "", city: "", about: ""
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length > 10) {
                alert("Maximum 10 photos allowed");
                return;
            }
            setFiles(selectedFiles);
        }
    };

    const handleSubmitData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.email || !formData.password) {
            alert("Email and Password are required!");
            return;
        }

        setLoading(true);

        const data = new FormData();
        // Append all text fields
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));

        // Append Package and Files
        data.append("package", selectedPkg?.name || "Basic Plan");
        files.forEach(file => data.append("images", file));

        try {
            const res = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setStep(3); // Move to Payment
            } else {
                alert(result.message || "Registration failed. Please check your details.");
            }
        } catch (err) {
            console.error("Reg Error:", err);
            alert("Server connection error! Please try again later.");
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? "bg-[#4a1111] text-white border-[#4a1111]" : "bg-white text-gray-400 border-gray-200"}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-10 md:w-20 h-1 mx-2 transition-all ${step > s ? "bg-[#4a1111]" : "bg-gray-200"}`} />}
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
                                        className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 hover:border-[#c19206] cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden"
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
                                            Select Plan
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
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <h2 className="text-3xl font-black text-[#4a1111]">Create Your Profile</h2>
                                <span className="px-4 py-1 bg-yellow-100 text-[#c19206] rounded-full text-sm font-bold border border-yellow-200">
                                    {selectedPkg?.name} Selected
                                </span>
                            </div>

                            <form onSubmit={handleSubmitData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {/* Account Info */}
                                    <input type="email" placeholder="Email Address" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <input type="password" placeholder="Create Password" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                    <hr className="my-2" />
                                    <input type="text" placeholder="Full Name" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input type="text" placeholder="Father Name" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Age" required className="p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        <select className="p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                        </select>
                                    </div>
                                    <select className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                        <option>Single</option>
                                        <option>Divorced</option>
                                        <option>Widow</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <input type="text" placeholder="Caste (e.g. Rajput, Jatt)" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, caste: e.target.value })} />
                                    <input type="text" placeholder="Profession / Job" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                                    <input type="text" placeholder="Education" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, education: e.target.value })} />
                                    <input type="text" placeholder="City" required className="w-full p-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    <textarea placeholder="About your family and requirements..." required className="w-full p-4 rounded-2xl bg-gray-50 border h-24 outline-none focus:ring-2 focus:ring-[#c19206]" onChange={e => setFormData({ ...formData, about: e.target.value })} />

                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">Upload Profile Photos (Max 10)</label>
                                        <input type="file" multiple accept="image/*" required onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a1111] file:text-white hover:file:bg-black cursor-pointer" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-[#4a1111] text-white rounded-2xl font-black text-xl hover:bg-[#c19206] transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Registering..." : "Next: Payment Method"}
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
                            <p className="text-gray-500 mt-2 font-bold italic">Apne {selectedPkg?.price} ki payment niche diye gaye numbers par karein.</p>

                            <div className="grid md:grid-cols-2 gap-6 my-10">
                                <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-orange-500 transition-all">
                                    <img src="/jazzcash-logo.png" alt="JazzCash" className="h-12 mx-auto mb-4 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    <p className="text-sm font-bold text-orange-600 uppercase">JazzCash</p>
                                    <p className="text-2xl font-black text-gray-800 tracking-wider">0300-1234567</p>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Title: Muhammad Usman</p>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-green-500 transition-all">
                                    <img src="/easypaisa-logo.png" alt="EasyPaisa" className="h-12 mx-auto mb-4 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    <p className="text-sm font-bold text-green-600 uppercase">EasyPaisa</p>
                                    <p className="text-2xl font-black text-gray-800 tracking-wider">0345-1234567</p>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Title: Muhammad Usman</p>
                                </div>
                            </div>

                            <div className="bg-green-50 p-8 rounded-[2rem] border-2 border-dashed border-green-200">
                                <p className="font-bold text-green-800 text-lg mb-4">Payment ka screenshot WhatsApp karein:</p>
                                <a
                                    href={`https://wa.me/923001234567?text=Hi, I have paid for the ${selectedPkg?.name}. My email is ${formData.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-3xl font-black text-green-600 block hover:scale-105 transition-transform"
                                >
                                    0300-1234567
                                </a>
                            </div>

                            <p className="mt-10 text-gray-500 font-bold flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Account verification ke baad apka profile live ho jayega.
                            </p>

                            <button
                                onClick={() => window.location.href = '/login'}
                                className="mt-6 text-[#4a1111] font-bold underline"
                            >
                                Go to Login
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}