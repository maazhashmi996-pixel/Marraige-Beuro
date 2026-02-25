"use client";
import React, { useState, useEffect, Suspense, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser, FiCheckCircle, FiArrowRight, FiArrowLeft,
    FiCamera, FiCreditCard, FiPhone, FiMail, FiInfo, FiMapPin
} from "react-icons/fi";

// --- Types strictly matching backend requirements ---
interface FormData {
    name: string;
    fatherName: string;
    email: string;
    phone: string;
    password: string;
    package: "Basic" | "Gold" | "Diamond" | "Standard";
    price: string;
    caste: string;
    age: string;
    gender: "Male" | "Female";
    maritalStatus: string;
    monthlyIncome: string;
    houseType: string;
    houseSize: string;
    disability: string;
    nationality: string;
    occupation: string;
    education: string;
    about: string;
    requirements: string;
    religion: string;
    sect: string;
    height: string;
    weight: string;
    motherTongue: string;
    familyDetails: string;
    city: string;
}

function RegisterFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        fatherName: "",
        email: "",
        phone: "",
        password: "",
        package: "Standard",
        price: "1500",
        caste: "",
        age: "",
        gender: "Male",
        maritalStatus: "Single",
        monthlyIncome: "",
        houseType: "Own",
        houseSize: "",
        disability: "None / No",
        nationality: "Pakistani",
        occupation: "",
        education: "",
        about: "I am looking for a suitable life partner.",
        requirements: "Religious and educated family.",
        religion: "Islam",
        sect: "Sunni",
        height: "",
        weight: "",
        motherTongue: "Urdu",
        familyDetails: "",
        city: ""
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [ssPreview, setSsPreview] = useState<string | null>(null);

    // Sync search params with state
    useEffect(() => {
        const pkg = searchParams.get("package");
        const prc = searchParams.get("price");
        if (pkg && prc) {
            setFormData(prev => ({ ...prev, package: pkg as any, price: prc }));
        }
    }, [searchParams]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 4);
            setImageFiles(filesArray);

            // Clean up old previews to avoid memory leaks
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            const previews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    const handleScreenshotChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (ssPreview) URL.revokeObjectURL(ssPreview);
            setScreenshot(e.target.files[0]);
            setSsPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = new FormData();

            // Appending text fields
            (Object.entries(formData) as [keyof FormData, string][]).forEach(([key, value]) => {
                dataToSend.append(key, value);
            });

            // Appending profile images
            imageFiles.forEach((file) => dataToSend.append("images", file));

            // Appending payment screenshot
            if (screenshot) {
                dataToSend.append("paymentScreenshot", screenshot);
            }

            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                body: dataToSend,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStep(4);
            } else {
                alert(`Error: ${result.message || "Submission failed"}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("Network error! Make sure your backend server is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf8f8] flex items-center justify-center p-4 py-12 font-sans text-slate-800">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-[#4a1111] p-10 text-center text-white">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                        RISHTA <span className="text-[#c19206]">REGISTRATION</span>
                    </h2>
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-8 bg-[#c19206]" : "w-2 bg-white/20"}`} />
                        ))}
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Basic Info */}
                        {step === 1 && (
                            <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                        <label className="text-[10px] font-black text-[#c19206] block uppercase">Plan</label>
                                        <div className="text-[#4a1111] font-black text-sm uppercase truncate">{formData.package}</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                        <label className="text-[10px] font-black text-green-600 block uppercase">Fee</label>
                                        <div className="text-green-700 font-black text-sm">Rs. {formData.price}</div>
                                    </div>
                                </div>

                                <input type="text" placeholder="Full Name" className="input-field-iconless" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <input type="text" placeholder="Father Name" className="input-field-iconless" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} required />

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="email" placeholder="Email (Login ID)" className="input-field-iconless" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                    <input type="text" placeholder="Phone Number" className="input-field-iconless" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                                </div>

                                <input type="password" placeholder="Create Password" className="input-field-iconless" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

                                <button onClick={handleNext} className="btn-primary mt-4" disabled={!formData.name || !formData.email}>
                                    Next: Bio Details <FiArrowRight />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: Profile Details */}
                        {step === 2 && (
                            <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h3 className="text-xl font-black text-[#4a1111] border-b pb-2 flex items-center gap-2"><FiUser className="text-[#c19206]" /> Bio Data</h3>

                                <div className="grid grid-cols-3 gap-3">
                                    <input type="number" placeholder="Age" className="input-field-iconless" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                    <select className="input-field-iconless" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input type="text" placeholder="Caste" className="input-field-iconless" value={formData.caste} onChange={(e) => setFormData({ ...formData, caste: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Education (e.g. Masters)" className="input-field-iconless" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                                    <input type="text" placeholder="Occupation" className="input-field-iconless" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Height (e.g 5'7)" className="input-field-iconless" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                                    <input type="text" placeholder="Weight (kg)" className="input-field-iconless" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select className="input-field-iconless" value={formData.religion} onChange={(e) => setFormData({ ...formData, religion: e.target.value })}>
                                        <option value="Islam">Islam</option>
                                        <option value="Christian">Christian</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Sikh">Sikh</option>
                                    </select>
                                    <input type="text" placeholder="Sect (Maslak)" className="input-field-iconless" value={formData.sect} onChange={(e) => setFormData({ ...formData, sect: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="City" className="input-field-iconless" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                    <input type="text" placeholder="Mother Tongue" className="input-field-iconless" value={formData.motherTongue} onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select className="input-field-iconless" value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                        <option value="Single">Single</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <select className="input-field-iconless" value={formData.houseType} onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}>
                                        <option value="Own">Own House</option>
                                        <option value="Rental">Rental</option>
                                    </select>
                                </div>

                                <textarea placeholder="Family Details (Brothers/Sisters etc)" className="input-field-iconless min-h-[60px]" value={formData.familyDetails} onChange={(e) => setFormData({ ...formData, familyDetails: e.target.value })} />
                                <textarea placeholder="Partner Requirements" className="input-field-iconless min-h-[60px]" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} />

                                <div className="pt-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Upload Up to 4 Photos (Required at least 1)</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagePreviews.map((src, idx) => (
                                            <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-[#c19206]">
                                                <img src={src} className="w-full h-full object-cover" alt="preview" />
                                            </div>
                                        ))}
                                        {imagePreviews.length < 4 && (
                                            <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                                                <FiCamera className="text-gray-400 text-xl" />
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleBack} className="btn-secondary w-20"><FiArrowLeft /></button>
                                    <button onClick={handleNext} disabled={imageFiles.length === 0} className="btn-primary flex-1">
                                        Next: Payment
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Payment */}
                        {step === 3 && (
                            <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="bg-yellow-50 p-6 rounded-[2rem] border border-[#c19206]/20">
                                    <h4 className="font-black text-[#4a1111] mb-4 uppercase flex items-center gap-2">
                                        <FiCreditCard className="text-[#c19206]" /> Payment Transfer
                                    </h4>
                                    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">EasyPaisa / JazzCash</p>
                                            <p className="text-[#4a1111] font-black text-lg">0300-1234567</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Amount</p>
                                            <p className="text-green-600 font-black text-lg">Rs. {formData.price}</p>
                                        </div>
                                    </div>

                                    <label className="block text-center p-6 border-2 border-dashed border-gray-300 rounded-3xl bg-white cursor-pointer hover:border-[#c19206] transition-colors">
                                        {ssPreview ? (
                                            <img src={ssPreview} className="h-40 mx-auto rounded-xl shadow-md object-contain" alt="SS Preview" />
                                        ) : (
                                            <div className="py-4">
                                                <FiCamera className="mx-auto text-3xl text-gray-300 mb-2" />
                                                <span className="text-gray-400 font-bold text-sm">Upload Screenshot</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                                    </label>
                                </div>

                                <button onClick={handleSubmit} disabled={loading || !screenshot} className="btn-primary">
                                    {loading ? "Processing..." : "Finish Registration"}
                                </button>
                                <button onClick={handleBack} className="w-full text-center text-gray-400 font-bold text-sm">Go Back</button>
                            </motion.div>
                        )}

                        {/* STEP 4: Success Message */}
                        {step === 4 && (
                            <motion.div key="st4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiCheckCircle className="text-5xl text-green-600" />
                                </div>
                                <h3 className="text-3xl font-black text-[#4a1111] uppercase">Success!</h3>
                                <p className="text-gray-500 font-bold mt-2">Aapki profile verification ke liye bhej di gayi hai.</p>
                                <p className="text-xs text-gray-400 mt-1">Verification usually takes 12-24 hours.</p>
                                <button onClick={() => router.push('/')} className="mt-8 btn-primary">Return to Home</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <style jsx>{`
                .input-field-iconless {
                    width: 100%; padding: 0.75rem 1rem; background-color: #f9fafb;
                    border: 1px solid #f3f4f6; border-radius: 1rem;
                    font-weight: 700; font-size: 0.85rem; outline: none; transition: 0.3s ease;
                }
                .input-field-iconless:focus { border-color: #c19206; background-color: white; }
                .btn-primary {
                    width: 100%; background-color: #4a1111; color: white;
                    padding: 1rem; border-radius: 1.25rem; font-weight: 900;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    text-transform: uppercase; transition: 0.2s;
                }
                .btn-primary:hover:not(:disabled) { background-color: #5e1a1a; transform: translateY(-1px); }
                .btn-primary:active { transform: translateY(0); }
                .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-secondary {
                    background-color: #f3f4f6; color: #4b5563; padding: 1rem;
                    border-radius: 1.25rem; font-weight: 900; display: flex; align-items: center; justify-content: center;
                    transition: 0.2s;
                }
                .btn-secondary:hover { background-color: #e5e7eb; }
            `}</style>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-[#4a1111] text-2xl animate-pulse">Loading Registration...</div>}>
            <RegisterFormContent />
        </Suspense>
    );
}