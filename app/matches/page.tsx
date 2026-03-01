"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMatches, unlockProfile } from '@/services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiLock, FiUnlock, FiMapPin, FiPhone,
    FiShield, FiUser, FiInfo, FiPlus,
    FiLogOut, FiExternalLink, FiX
} from 'react-icons/fi';

interface UserProfile {
    _id: string;
    name: string;
    fatherName?: string;
    age: number;
    gender: string;
    city: string;
    caste: string;
    sect?: string;
    mainImage: string;
    gallery: string[];
    phone?: string;
    about?: string;
    education?: string;
    occupation?: string;
    maritalStatus?: string;
    monthlyIncome?: string;
    motherTongue?: string;
    houseType?: string;
    houseSize?: string;
    requirements?: string;
    isLocked: boolean;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<UserProfile[]>([]);
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();
    const hasFetched = useRef(false);

    const handleLogout = useCallback((message?: string) => {
        localStorage.clear();
        if (message) toast.error(message);
        else toast.success("Logged out successfully!");
        router.replace("/login");
    }, [router]);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetchMatches();
            if (res && res.data?.success) {
                const profiles = res.data.profiles || [];
                setMatches(profiles);
                setCredits(res.data.credits ?? 0);

                // Update selected profile if modal is open
                if (selectedProfile) {
                    const updated = profiles.find((p: UserProfile) => p._id === selectedProfile._id);
                    if (updated) setSelectedProfile(updated);
                }
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 401) handleLogout("Session expired. Please login again.");
            else toast.error("Failed to load matches.");
        } finally {
            setLoading(false);
        }
    }, [handleLogout, selectedProfile]);

    useEffect(() => {
        setIsMounted(true);
        if (!hasFetched.current) {
            loadData();
            hasFetched.current = true;
        }
    }, [loadData]);

    const handleUnlock = async (id: string) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.error("Please login to unlock profiles!");
            router.push("/login");
            return;
        }

        if (credits <= 0) {
            toast.error("Low Credits! Please upgrade your package.");
            router.push('/Packages');
            return;
        }

        if (!confirm("This will use 1 Credit. Do you want to continue?")) return;

        try {
            const res = await unlockProfile(id);
            if (res.data?.success) {
                toast.success("Contact Unlocked Successfully!");
                await loadData();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Unlock failed.");
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#fcfafa] pb-20 selection:bg-[#4a1111] selection:text-white">
            {/* Header / Stats Bar */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-[#4a1111] italic tracking-tight uppercase">Aasan<span className="text-[#c19206]">Rishta</span></h1>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Premium Matchmaking</p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-1.5 pl-4 flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Available Credits</p>
                                <p className="text-lg font-black text-[#4a1111] leading-none">{credits}</p>
                            </div>
                            <button
                                onClick={() => router.push('/Packages')}
                                className="bg-[#c19206] text-white p-2.5 rounded-xl shadow-lg shadow-yellow-600/20 hover:scale-105 transition-transform"
                            >
                                <FiPlus strokeWidth={3} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleLogout()}
                            className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors"
                            title="Logout"
                        >
                            <FiLogOut />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-10">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-[#4a1111] tracking-tighter italic">Found Your Matches</h2>
                        <p className="text-gray-400 font-medium mt-1">Showing verified profiles based on your preference</p>
                    </div>
                </div>

                {loading && matches.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[500px] bg-white rounded-[3rem] animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {matches.map((match) => (
                            <motion.div
                                key={match._id}
                                whileHover={{ y: -10 }}
                                className="group bg-white rounded-[3.5rem] overflow-hidden border border-gray-50 shadow-xl shadow-gray-200/40 transition-all flex flex-col"
                            >
                                <div className="relative h-96 overflow-hidden">
                                    <img
                                        src={match.mainImage || '/placeholder.jpg'}
                                        alt={match.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a1111]/90 via-transparent to-transparent opacity-80" />

                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                                            <FiShield className="text-green-600 text-xs" />
                                            <span className="text-[10px] font-black text-[#4a1111] uppercase tracking-widest">Verified</span>
                                        </div>
                                    </div>

                                    {match.isLocked && (
                                        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md p-2.5 rounded-2xl text-white shadow-2xl">
                                            <FiLock size={18} />
                                        </div>
                                    )}

                                    <div className="absolute bottom-8 left-8 text-white">
                                        <h3 className="text-3xl font-black italic tracking-tighter mb-1">{match.name}, {match.age}</h3>
                                        <div className="flex items-center gap-2 text-xs font-bold opacity-90 uppercase tracking-widest">
                                            <FiMapPin className="text-[#c19206]" /> {match.city} • {match.caste}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Education</p>
                                            <p className="font-black text-[#4a1111] truncate max-w-[100px]">{match.education || 'N/A'}</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100" />
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Profession</p>
                                            <p className="font-black text-[#4a1111] truncate max-w-[100px]">{match.occupation || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProfile(match)}
                                        className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${!match.isLocked
                                            ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700'
                                            : 'bg-[#4a1111] text-white shadow-red-900/20 hover:bg-black'
                                            }`}
                                    >
                                        {!match.isLocked ? <><FiUnlock /> View Unlocked Profile</> : 'View Details'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto relative no-scrollbar"
                        >
                            {/* Modal Header */}
                            <div className="relative h-80 md:h-[400px]">
                                <img src={selectedProfile.mainImage} className="w-full h-full object-cover" alt="Profile" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                                <button
                                    onClick={() => setSelectedProfile(null)}
                                    className="absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl font-light hover:bg-[#4a1111] transition-all"
                                >
                                    <FiX />
                                </button>
                                <div className="absolute bottom-10 left-10">
                                    <h2 className="text-5xl md:text-7xl font-black text-[#4a1111] italic tracking-tighter">{selectedProfile.name}</h2>
                                    <p className="text-[#c19206] font-black uppercase tracking-widest text-lg">{selectedProfile.city} • {selectedProfile.age} Years</p>
                                </div>
                            </div>

                            <div className="p-10 md:p-16">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    {/* Info Left */}
                                    <div className="lg:col-span-2 space-y-12">
                                        <div>
                                            <h4 className="flex items-center gap-3 text-2xl font-black text-[#4a1111] mb-6 italic">
                                                <FiUser className="text-[#c19206]" /> Personal Background
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <DetailBox label="Father Name" value={selectedProfile.fatherName} />
                                                <DetailBox label="Caste" value={selectedProfile.caste} />
                                                <DetailBox label="Sect/Maslak" value={selectedProfile.sect} />
                                                <DetailBox label="Marital Status" value={selectedProfile.maritalStatus} />
                                                <DetailBox label="Mother Tongue" value={selectedProfile.motherTongue} />
                                                <DetailBox label="Education" value={selectedProfile.education} />
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="flex items-center gap-3 text-2xl font-black text-[#4a1111] mb-6 italic">
                                                <FiInfo className="text-[#c19206]" /> About Candidate
                                            </h4>
                                            <div className="bg-gray-50 p-8 rounded-[2.5rem] text-gray-600 font-medium leading-relaxed italic border border-gray-100">
                                                "{selectedProfile.about || 'Personal details are kept private by candidate.'}"
                                            </div>
                                        </div>

                                        {!selectedProfile.isLocked && selectedProfile.gallery && selectedProfile.gallery.length > 0 && (
                                            <div>
                                                <h4 className="text-2xl font-black text-[#4a1111] mb-6 italic flex items-center gap-3">
                                                    <FiExternalLink className="text-[#c19206]" /> Photo Gallery
                                                </h4>
                                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                                    {selectedProfile.gallery.map((img, idx) => (
                                                        <img key={idx} src={img} className="w-full h-32 object-cover rounded-[1.5rem] border-2 border-white shadow-md hover:scale-105 transition-transform" alt="Gallery" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Right (Stats & Requirements) */}
                                    <div className="space-y-8">
                                        <div className="bg-[#4a1111] p-10 rounded-[3rem] text-white shadow-2xl">
                                            <h5 className="font-black uppercase tracking-widest text-[10px] text-yellow-500 mb-6">Financial & Living</h5>
                                            <div className="space-y-6">
                                                <DetailBoxDark label="Monthly Income" value={selectedProfile.monthlyIncome} />
                                                <DetailBoxDark label="Occupation" value={selectedProfile.occupation} />
                                                <DetailBoxDark label="House Type" value={selectedProfile.houseType} />
                                                <DetailBoxDark label="House Size" value={selectedProfile.houseSize} />
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-10 rounded-[3rem] border border-yellow-100">
                                            <h5 className="font-black uppercase tracking-widest text-[10px] text-[#4a1111] mb-4">Partner Requirements</h5>
                                            <p className="text-[#4a1111] font-bold text-sm leading-relaxed italic">
                                                {selectedProfile.requirements || 'Contact the representative to discuss requirements.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Footer Button */}
                                <div className="mt-16 sticky bottom-0 pt-6 pb-2 bg-white/80 backdrop-blur-md">
                                    {!selectedProfile.isLocked ? (
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div className="flex-1 bg-green-50 border-2 border-green-100 p-6 rounded-[2.5rem] flex items-center justify-between px-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Direct Contact Unlocked</p>
                                                    <p className="text-3xl font-black text-[#4a1111] tabular-nums">{selectedProfile.phone}</p>
                                                </div>
                                                <FiPhone className="text-green-600 text-3xl animate-bounce" />
                                            </div>
                                            <a
                                                href={`https://wa.me/${selectedProfile.phone?.replace(/\+/g, '')}`}
                                                target="_blank"
                                                className="w-full md:w-auto bg-[#25D366] text-white px-12 py-6 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                            >
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleUnlock(selectedProfile._id)}
                                            className="group w-full py-8 bg-[#4a1111] text-white rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-6 overflow-hidden relative"
                                        >
                                            <span className="relative z-10 flex items-center gap-4">
                                                <FiUnlock /> Unlock Contact & Full Gallery
                                            </span>
                                            <span className="relative z-10 bg-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-yellow-600 transition-colors">
                                                1 Credit
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Light Box Component
function DetailBox({ label, value }: { label: string, value?: string }) {
    return (
        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] hover:shadow-md transition-shadow group">
            <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest group-hover:text-[#c19206] transition-colors">{label}</p>
            <p className="font-black text-[#4a1111] text-[15px] leading-tight break-words">
                {value && value !== "" && value !== "undefined" ? value : 'N/A'}
            </p>
        </div>
    );
}

// Dark Box Component for Financials
function DetailBoxDark({ label, value }: { label: string, value?: string }) {
    return (
        <div className="border-b border-white/10 pb-4">
            <p className="text-[9px] text-white/40 font-black uppercase mb-1 tracking-widest">{label}</p>
            <p className="font-black text-white text-lg italic">
                {value && value !== "" && value !== "undefined" ? value : 'Hidden'}
            </p>
        </div>
    );
} 