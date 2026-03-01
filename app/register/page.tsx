"use client";
import React, { useState, useEffect, Suspense, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser, FiCheckCircle, FiArrowRight, FiArrowLeft,
    FiCamera, FiCreditCard, FiSmartphone, FiMail, FiLock, FiInfo
} from "react-icons/fi";

// --- Types strictly matching backend requirements ---
interface FormData {
    name: string;
    fatherName: string;
    email: string;
    phone: string;
    password: string;
    package: string;
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

    // Initial state matching your backend exactly
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

    useEffect(() => {
        const pkg = searchParams.get("package");
        const prc = searchParams.get("price");
        if (pkg && prc) {
            setFormData(prev => ({ ...prev, package: pkg, price: prc }));
        }
    }, [searchParams]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 4);
            setImageFiles(filesArray);

            // Clear existing previews
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

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = new FormData();

            // Mapping form data to backend keys
            (Object.entries(formData) as [keyof FormData, string][]).forEach(([key, value]) => {
                if (key === 'monthlyIncome') {
                    dataToSend.append("income", value); // Backend expects 'income'
                } else {
                    dataToSend.append(key, value);
                }
            });

            // Images matching upload.array('images', 4)
            imageFiles.forEach((file) => dataToSend.append("images", file));

            // Screenshot matching upload.single('paymentScreenshot')
            if (screenshot) {
                dataToSend.append("paymentScreenshot", screenshot);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users/register`, {
                method: "POST",
                body: dataToSend,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStep(4);
            } else {
                alert(`Error: ${result.message || "Registration failed"}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("Network error! Server se connect nahi ho raha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf8f8] flex items-center justify-center p-4 py-12 font-sans text-slate-800">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-[#4a1111] p-10 text-center text-white relative">
                    <div className="absolute top-4 left-4 opacity-20"><FiInfo size={40} /></div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                        RISHTA <span className="text-[#c19206]">REGISTRATION</span>
                    </h2>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-white/60 mt-2">Personal & Secure Matchmaking</p>

                    <div className="flex justify-center gap-2 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-10 bg-[#c19206]" : "w-3 bg-white/20"}`} />
                        ))}
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Basic Account Info */}
                        {step === 1 && (
                            <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 shadow-sm">
                                        <label className="text-[10px] font-black text-[#c19206] block uppercase tracking-wider">Selected Plan</label>
                                        <div className="text-[#4a1111] font-black text-sm uppercase truncate">{formData.package}</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm">
                                        <label className="text-[10px] font-black text-green-600 block uppercase tracking-wider">Registration Fee</label>
                                        <div className="text-green-700 font-black text-sm">Rs. {formData.price}</div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c19206] transition-colors" />
                                    <input type="text" placeholder="Full Name" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>

                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c19206] transition-colors" />
                                    <input type="text" placeholder="Father Name" className="input-field" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c19206] transition-colors" />
                                        <input type="email" placeholder="Email Address" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                    </div>
                                    <div className="relative group">
                                        <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c19206] transition-colors" />
                                        <input type="text" placeholder="Phone Number" className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c19206] transition-colors" />
                                    <input type="password" placeholder="Create Secret Password" className="input-field" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                </div>

                                <button onClick={handleNext} className="btn-primary mt-6 group" disabled={!formData.name || !formData.email || !formData.phone || !formData.password}>
                                    Next: Personal Details <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Step 1 of 3: Account Security</p>
                            </motion.div>
                        )}

                        {/* STEP 2: Extensive Profile Details */}
                        {step === 2 && (
                            <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h3 className="text-xl font-black text-[#4a1111] border-b-2 border-[#c19206]/10 pb-2 flex items-center gap-2">
                                    <FiUser className="text-[#c19206]" /> Personal Bio Data
                                </h3>

                                <div className="grid grid-cols-3 gap-3">
                                    <input type="number" placeholder="Age" className="input-field-simple" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                    <select className="input-field-simple" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input type="text" placeholder="Caste" className="input-field-simple" value={formData.caste} onChange={(e) => setFormData({ ...formData, caste: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Education (e.g. Masters)" className="input-field-simple" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                                    <input type="text" placeholder="Job / Occupation" className="input-field-simple" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Income (Monthly)" className="input-field-simple" value={formData.monthlyIncome} onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })} />
                                    <input type="text" placeholder="City" className="input-field-simple" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select className="input-field-simple" value={formData.religion} onChange={(e) => setFormData({ ...formData, religion: e.target.value })}>
                                        <option value="Islam">Islam</option>
                                        <option value="Christian">Christian</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Sikh">Sikh</option>
                                    </select>
                                    <input type="text" placeholder="Sect / Maslak" className="input-field-simple" value={formData.sect} onChange={(e) => setFormData({ ...formData, sect: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select className="input-field-simple" value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                        <option value="Single">Single</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <input type="text" placeholder="Height (e.g. 5'6'')" className="input-field-simple" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                                </div>

                                <textarea placeholder="Family Background (Brothers, Sisters details...)" className="input-field-simple min-h-[80px] py-3" value={formData.familyDetails} onChange={(e) => setFormData({ ...formData, familyDetails: e.target.value })} />
                                <textarea placeholder="Partner Requirements (Life partner kaisa ho?)" className="input-field-simple min-h-[80px] py-3" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} />

                                <div className="pt-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Upload Profile Photos (Min 1, Max 4)</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {imagePreviews.map((src, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-[#c19206] shadow-md relative">
                                                <img src={src} className="w-full h-full object-cover" alt="preview" />
                                                <div className="absolute top-1 right-1 bg-[#c19206] text-white text-[8px] px-1 rounded-full font-bold">#{idx + 1}</div>
                                            </div>
                                        ))}
                                        {imagePreviews.length < 4 && (
                                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all hover:border-[#c19206]">
                                                <FiCamera className="text-gray-400 text-xl mb-1" />
                                                <span className="text-[8px] font-black text-gray-400 uppercase">Add Photo</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button onClick={handleBack} className="btn-secondary px-8"><FiArrowLeft /></button>
                                    <button onClick={handleNext} disabled={imageFiles.length === 0} className="btn-primary flex-1">
                                        Continue to Payment <FiArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Payment & Proof */}
                        {step === 3 && (
                            <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="bg-[#fdf8f8] p-8 rounded-[2.5rem] border-2 border-dashed border-[#c19206]/30 relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#c19206]/10 rounded-full blur-2xl" />

                                    <h4 className="font-black text-[#4a1111] mb-6 uppercase flex items-center gap-2 text-lg">
                                        <FiCreditCard className="text-[#c19206]" /> Payment Transfer
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Account Holder</p>
                                            <p className="text-[#4a1111] font-black">Dawood Gee Dawood</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">EasyPaisa / JazzCash</p>
                                            <p className="text-[#4a1111] font-black text-xl tracking-tighter">UnderProcess</p>
                                        </div>
                                    </div>

                                    <label className="block text-center p-8 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white cursor-pointer hover:border-[#c19206] transition-all group">
                                        {ssPreview ? (
                                            <div className="relative">
                                                <img src={ssPreview} className="h-48 mx-auto rounded-2xl shadow-lg object-contain" alt="SS Preview" />
                                                <div className="mt-2 text-[10px] text-[#c19206] font-black uppercase">Change Screenshot</div>
                                            </div>
                                        ) : (
                                            <div className="py-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <FiCamera className="text-3xl text-gray-300" />
                                                </div>
                                                <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Upload Payment Screenshot</span>
                                                <p className="text-[9px] text-gray-300 mt-2 italic font-medium text-center px-4">Transfer karne k baad raseed ki photo yahan lagayein.</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                                    </label>
                                </div>

                                <div className="space-y-3">
                                    <button onClick={handleSubmit} disabled={loading || !screenshot} className="btn-primary py-5">
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </div>
                                        ) : "Complete Registration"}
                                    </button>
                                    <button onClick={handleBack} className="w-full text-center text-gray-400 font-black text-xs uppercase tracking-widest py-2 hover:text-[#4a1111] transition-colors">Go back to details</button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Ultimate Success Message */}
                        {step === 4 && (
                            <motion.div key="st4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                                <div className="relative inline-block mb-8">
                                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                                    <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto relative border-4 border-white shadow-xl">
                                        <FiCheckCircle className="text-6xl text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-[#4a1111] uppercase tracking-tighter">Congratulations!</h3>
                                <div className="max-w-sm mx-auto">
                                    <p className="text-gray-500 font-bold mt-4 leading-relaxed">
                                        Aapka data aur payment proof receive ho chuka hai.
                                        <span className="text-green-600"> 1-2 ghanton </span> mein verification k baad aapko confirmation message mil jayega.
                                    </p>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-3">
                                    <button onClick={() => router.push('/')} className="btn-primary">Return to Home Screen</button>
                                    <a
                                        href={`https://wa.me/923001234567?text=Assalam-o-Alaikum, I have registered on Rishta App. My Name is ${formData.name}. Please verify my account.`}
                                        target="_blank"
                                        className="text-[10px] font-black uppercase text-[#c19206] hover:underline"
                                    >
                                        Urgent Approval? Contact WhatsApp
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Production CSS Tools */}
            <style jsx>{`
                .input-field {
                    width: 100%; padding: 1.1rem 1rem 1.1rem 3.5rem; background-color: #f9fafb;
                    border: 2px solid #f3f4f6; border-radius: 1.5rem;
                    font-weight: 800; font-size: 0.9rem; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-field:focus { border-color: #c19206; background-color: white; box-shadow: 0 10px 15px -3px rgba(193, 146, 6, 0.1); }
                
                .input-field-simple {
                    width: 100%; padding: 0.9rem 1.2rem; background-color: #f9fafb;
                    border: 2px solid #f3f4f6; border-radius: 1.25rem;
                    font-weight: 700; font-size: 0.85rem; outline: none; transition: 0.3s;
                }
                .input-field-simple:focus { border-color: #c19206; background-color: white; }

                .btn-primary {
                    width: 100%; background: linear-gradient(135deg, #4a1111 0%, #310b0b 100%); color: white;
                    padding: 1.25rem; border-radius: 1.5rem; font-weight: 900;
                    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
                    text-transform: uppercase; transition: all 0.3s; letter-spacing: 0.05em;
                    box-shadow: 0 10px 20px -5px rgba(74, 17, 17, 0.4);
                }
                .btn-primary:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 25px -5px rgba(74, 17, 17, 0.5); }
                .btn-primary:active { transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

                .btn-secondary {
                    background-color: #f9fafb; color: #4b5563; padding: 1.25rem;
                    border: 2px solid #f3f4f6; border-radius: 1.5rem; font-weight: 900; 
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .btn-secondary:hover { background-color: #f3f4f6; border-color: #e5e7eb; }
            `}</style>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-[#c19206]/20 border-t-[#4a1111] rounded-full animate-spin mb-4" />
                <p className="font-black text-[#4a1111] text-xl uppercase tracking-tighter animate-pulse">Initializing Portal...</p>
            </div>
        }>
            <RegisterFormContent />
        </Suspense>
    );
}