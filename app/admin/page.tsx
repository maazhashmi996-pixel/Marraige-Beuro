"use client";
import { FiShield } from "react-icons/fi";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FiUsers, FiPlusCircle, FiCheckCircle, FiClock,
    FiSettings, FiLogOut, FiFilter, FiDollarSign, FiTrash2, FiEye, FiLoader,
    FiCamera, FiUploadCloud, FiX, FiCheck, FiSmartphone, FiImage, FiCreditCard, FiEdit3, FiMapPin
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

/* ================= TYPES ================= */
interface UserProfile {
    _id: string;
    name: string;
    fatherName: string;
    title: string;
    age: number | string;
    gender: string;
    caste: string;
    city: string;
    profession?: string;
    occupation?: string;
    sect: string;
    requirements: string;
    mainImage: string;
    gallery: string[];
    religion?: string;
    height?: string;
    weight?: string;
    maritalStatus?: string;
    education?: string;
    monthlyIncome?: string;
    motherTongue?: string;
    houseType?: string;
    houseSize?: string;
    disability?: string;
    about?: string;
    familyDetails?: string;
}

interface RegistrationRequest {
    _id: string;
    name: string;
    fatherName: string;
    email: string;
    phone: string;
    package: string;
    isApproved: boolean;
    age: string | number;
    gender?: string;
    caste?: string;
    sect?: string;
    city?: string;
    occupation?: string;
    monthlyIncome?: string;
    houseType?: string;
    houseSize?: string;
    motherTongue?: string;
    height?: string;
    weight?: string;
    disability?: string;
    requirements?: string;
    about?: string;
    familyDetails?: string;
    maritalStatus?: string;
    images?: string[];
    paymentScreenshot?: string;
    createdAt?: string;

}

/* ================= MAIN DASHBOARD ================= */
export default function AdminDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("stats");
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
    const [filterRange, setFilterRange] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<RegistrationRequest | null>(null);
    const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    // ✅ AUTH PROTECTION
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");

        if (!token || !userData) {
            router.replace("/login");
            return;
        }

        try {
            const user = JSON.parse(userData);
            if (user.role !== "admin") {
                toast.error("Unauthorized Access!");
                router.replace("/");
            } else {
                setIsAuthorized(true);
            }
        } catch (e) {
            router.replace("/login");
        }
    }, [router]);

    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        setLoading(true);
        try {
            const [profRes, regRes] = await Promise.all([
                fetch(`${API_URL}/admin/profiles`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/admin/registrations?range=${filterRange}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (profRes.ok && regRes.ok) {
                const profilesData = await profRes.json();
                const regsData = await regRes.json();
                setProfiles(profilesData || []);
                setRegistrations(regsData || []);
            }
        } catch (err) {
            toast.error("Failed to sync data");
        } finally {
            setLoading(false);
        }
    }, [filterRange, API_URL]);

    useEffect(() => {
        if (isAuthorized) fetchDashboardData();
    }, [fetchDashboardData, isAuthorized]);

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete-profile') => {
        const token = localStorage.getItem("userToken");
        const confirmMsg = action === 'reject' ? "Reject and Delete this request?" : "Are Your Sure Accept this profile forever?";
        if (!confirm(confirmMsg)) return;

        try {
            let endpoint = "";
            let method = "DELETE";

            if (action === 'approve') {
                endpoint = `approve/${id}`;
                method = "PUT";
            } else if (action === 'reject') {
                endpoint = `registration/${id}`;
            } else {
                endpoint = `profile/${id}`;
            }

            const res = await fetch(`${API_URL}/admin/${endpoint}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success(action === 'approve' ? "Profile Published!" : "Record Deleted");
                setSelectedUser(null);
                fetchDashboardData();
            }
        } catch (err) { toast.error("Action failed"); }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.replace("/login");
    };

    if (!isAuthorized) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-[#4a1111]">VERIFYING SYSTEM...</div>;

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] selection:bg-[#c19206] selection:text-white">
            <Toaster position="top-right" />

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#4a1111] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-30 transition-all">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#c19206] rounded-xl shadow-lg shadow-black/20 flex items-center justify-center">
                            <FiShield className="text-xl" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">MATCH<span className="text-[#c19206]">HQ</span></h1>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-[0.3em] font-bold">Systems Administration</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { id: "stats", label: "Dashboard", icon: <FiFilter /> },
                        { id: "create", label: "Create Profile", icon: <FiPlusCircle /> },
                        { id: "pending", label: "Requests", icon: <FiClock />, count: registrations.filter(r => !r.isApproved).length },
                        { id: "manage", label: "Directory", icon: <FiSettings /> },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold group ${activeTab === item.id ? "bg-[#c19206] text-white shadow-xl shadow-[#c19206]/20" : "hover:bg-white/5 text-gray-400"}`}>
                            <div className="flex items-center gap-4">
                                {item.icon} {item.label}
                            </div>
                            {item.count ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.count}</span> : null}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <button onClick={handleLogout} className="w-full p-4 bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 overflow-x-hidden">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <p className="text-[#c19206] font-black uppercase tracking-widest text-xs mb-1">System Node / {activeTab}</p>
                        <h2 className="text-5xl font-black text-[#4a1111] tracking-tighter capitalize">{activeTab}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Server Status</p>
                            <p className="text-xs font-black text-green-500 flex items-center gap-1 justify-end"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Operational</p>
                        </div>
                        <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)} className="p-4 bg-white rounded-2xl border-2 border-gray-100 font-black shadow-sm outline-none text-sm text-[#4a1111] hover:border-[#c19206] transition-colors">
                            <option value="all">Lifetime Records</option>
                            <option value="day">Today's Data</option>
                            <option value="week">Weekly View</option>
                        </select>
                    </div>
                </header>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <FiLoader className="animate-spin text-6xl text-[#c19206]" />
                        <p className="font-bold text-gray-400 animate-pulse">Synchronizing Database...</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                        {activeTab === "stats" && <StatsGrid registrations={registrations} profiles={profiles} />}
                        {activeTab === "create" && <CreateProfileForm API_URL={API_URL} refresh={fetchDashboardData} setActiveTab={setActiveTab} />}
                        {activeTab === "pending" && <PendingList users={registrations} onOpenView={setSelectedUser} onReject={(id: string) => handleAction(id, 'reject')} />}
                        {activeTab === "manage" && <ManageProfilesList profiles={profiles} onDelete={(id: string) => handleAction(id, 'delete-profile')} onEdit={setEditingProfile} />}
                    </motion.div>
                )}

                {/* MODALS REMAIN THE SAME BUT WITH UPDATED STYLING */}
                <AnimatePresence>
                    {selectedUser && (
                        <ViewRequestModal user={selectedUser} onClose={() => setSelectedUser(null)} onApprove={() => handleAction(selectedUser._id, 'approve')} onReject={() => handleAction(selectedUser._id, 'reject')} />
                    )}
                    {editingProfile && (
                        <EditProfileModal profile={editingProfile} onClose={() => setEditingProfile(null)} API_URL={API_URL} refresh={fetchDashboardData} />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

/* ================= COMPONENT: STATS GRID ================= */
function StatsGrid({ registrations, profiles }: { registrations: RegistrationRequest[], profiles: UserProfile[] }) {
    const totalRegs = registrations.length;
    const pending = registrations.filter(r => !r.isApproved).length;
    const live = profiles.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard label="Total Inquiries" value={totalRegs} icon={<FiSmartphone className="text-blue-500" />} color="bg-blue-50" />
            <StatCard label="Pending Approval" value={pending} icon={<FiClock className="text-orange-500" />} color="bg-orange-50" />
            <StatCard label="Published Profiles" value={live} icon={<FiCheckCircle className="text-green-500" />} color="bg-green-50" />
        </div>
    );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className={`${color} p-10 rounded-[3rem] border border-white shadow-xl shadow-gray-200/50 flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                <h3 className="text-5xl font-black text-[#4a1111]">{value}</h3>
            </div>
            <div className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
        </div>
    );
}

/* ================= COMPONENT: PENDING LIST ================= */
function PendingList({ users, onOpenView, onReject }: any) {
    const pendingOnes = users.filter((u: any) => !u.isApproved);

    if (pendingOnes.length === 0) return (
        <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed flex flex-col items-center">
            <FiCheckCircle className="text-6xl text-gray-200 mb-4" />
            <p className="font-bold text-gray-400 uppercase">Queue is empty. Great job!</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[3rem] shadow-sm border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <th className="p-6">Applicant</th>
                        <th className="p-6">Package</th>
                        <th className="p-6">Contact</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {pendingOnes.map((u: any) => (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-6">
                                <div className="font-black text-[#4a1111] text-lg">{u.name}</div>
                                <div className="text-xs text-gray-400 font-bold uppercase">{u.city} • {u.caste}</div>
                            </td>
                            <td className="p-6">
                                <span className="bg-[#4a1111] text-white text-[10px] font-black px-3 py-1 rounded-full">{u.package}</span>
                            </td>
                            <td className="p-6 font-bold text-sm text-gray-600">{u.phone}</td>
                            <td className="p-6 text-right space-x-2">
                                <button onClick={() => onOpenView(u)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><FiEye /></button>
                                <button onClick={() => onReject(u._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><FiTrash2 /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ================= COMPONENT: MANAGE PROFILES ================= */
function ManageProfilesList({ profiles, onDelete, onEdit }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p: any) => (
                <div key={p._id} className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex items-center gap-4 hover:shadow-xl transition-all group">
                    <img src={p.mainImage} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#4a1111] truncate">{p.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{p.city} • {p.caste}</p>
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => onEdit(p)} className="flex-1 py-2 bg-gray-100 text-[#4a1111] rounded-xl font-bold text-[10px] uppercase hover:bg-[#c19206] hover:text-white transition-all flex items-center justify-center gap-1"><FiEdit3 /> Edit</button>
                            <button onClick={() => onDelete(p._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FiTrash2 size={14} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================= COMPONENT: CREATE PROFILE FORM ================= */
function CreateProfileForm({ API_URL, refresh, initialData, isEdit = false, onClose, setActiveTab }: any) {
    const [formData, setFormData] = useState<any>(() => ({
        name: "", fatherName: "", email: "", age: "", gender: "Male", city: "", caste: "", sect: "",
        occupation: "", monthlyIncome: "", education: "", maritalStatus: "Never Married", familyDetails: "",
        motherTongue: "", houseType: "Own", houseSize: "", requirements: "", about: "",
        mainImage: "", password: "", phone: "", disability: "", height: "", weight: "", package: "Basic Plan",
        gallery: []
    }));

    // Previews dikhane ke liye extra state
    const [previews, setPreviews] = useState<{ main: string, gallery: string[] }>({
        main: initialData?.mainImage || "",
        gallery: initialData?.gallery || []
    });

    const [uploading, setUploading] = useState(false);

    // Jab Edit mode ho toh data load karne ke liye
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({ ...initialData });
            setPreviews({
                main: initialData.mainImage || "",
                gallery: initialData.gallery || []
            });
        }
    }, [isEdit, initialData]);

    const handleFileChange = (e: any, type: 'main' | 'gallery') => {
        const files = Array.from(e.target.files) as File[];
        if (!files.length) return;

        if (type === 'main') {
            const file = files[0];
            setFormData({ ...formData, mainFile: file }); // Original File for upload
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => ({ ...prev, main: reader.result as string }));
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, galleryFiles: [...(formData.galleryFiles || []), ...files] });
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => setPreviews(prev => ({ ...prev, gallery: [...prev.gallery, reader.result as string] }));
                reader.readAsDataURL(file);
            });
        }
        toast.success("Images Selected Locally");
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");
        const loadingToast = toast.loading(isEdit ? "Updating Profile..." : "Publishing Profile...");

        try {
            const data = new FormData();

            // 1. Saara Text Data Append karein
            Object.keys(formData).forEach(key => {
                // Files aur purani images skip karein (wo niche handle honge)
                if (!['mainImage', 'gallery', 'mainFile', 'galleryFiles', '_id', '__v', 'userId'].includes(key)) {
                    data.append(key, formData[key] || "");
                }
            });

            // 2. Main Image append karein (Agar nayi select ki hai)
            if (formData.mainFile) {
                data.append('images', formData.mainFile);
            }

            // 3. Gallery Images append karein
            if (formData.galleryFiles && formData.galleryFiles.length > 0) {
                formData.galleryFiles.forEach((file: File) => {
                    data.append('images', file);
                });
            }

            const method = isEdit ? "PUT" : "POST";
            const url = isEdit ? `${API_URL}/admin/profile/${initialData._id}` : `${API_URL}/admin/profile/manual`;

            const res = await fetch(url, {
                method,
                headers: {
                    // YAHAN CONTENT-TYPE NAHI LAGANA (V.IMP)
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success(isEdit ? "Profile Updated!" : "Profile Created!", { id: loadingToast });
                refresh();
                if (!isEdit) setActiveTab("manage");
                if (onClose) onClose();
            } else {
                throw new Error(result.error || result.message || "Submission Failed");
            }
        } catch (err: any) {
            console.error("Submit Error:", err);
            toast.error(err.message, { id: loadingToast });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Image Uploaders */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div className="relative group h-48 bg-gray-50 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden">
                        {formData.mainImage ? (
                            <>
                                <img src={formData.mainImage} className="w-full h-full object-cover" alt="" />
                                <button type="button" onClick={() => setFormData({ ...formData, mainImage: "" })} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiX /></button>
                            </>
                        ) : (
                            <>
                                <FiCamera className="text-3xl text-gray-300 mb-2" />
                                <p className="text-[10px] font-black text-gray-400 uppercase">Main Display Image</p>
                                <input type="file" onChange={(e) => handleFileChange(e, 'main')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                        )}
                    </div>
                    <div className="md:col-span-3 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                        <div className="text-center">
                            <FiUploadCloud className="text-3xl text-gray-300 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gallery Upload ({formData.gallery.length})</p>
                            <input type="file" multiple onChange={(e) => handleFileChange(e, 'gallery')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>
                <InputField label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
                <InputField label="Father Name" value={formData.fatherName} onChange={(v: string) => setFormData({ ...formData, fatherName: v })} />
                <InputField label="Email (Required)" type="email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                <InputField label="Password (Required)" type="password" value={formData.password} onChange={(v: string) => setFormData({ ...formData, password: v })} />
                <InputField label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />

                <SelectField label="Gender" options={["Male", "Female"]} value={formData.gender} onChange={(v: string) => setFormData({ ...formData, gender: v })} />
                <InputField label="Age" type="number" value={formData.age} onChange={(v: string) => setFormData({ ...formData, age: v })} />
                <SelectField label="Marital Status" options={["Never Married", "Divorced", "Widowed", "Separated"]} value={formData.maritalStatus} onChange={(v: string) => setFormData({ ...formData, maritalStatus: v })} />
                <InputField label="City" value={formData.city} onChange={(v: string) => setFormData({ ...formData, city: v })} />
                <InputField
                    label="Family Detail (e.g. 2 Brothers, 1 Sister)"
                    value={formData.familyDetails
                    }
                    onChange={(v: string) => setFormData({ ...formData, familyDetails: v })}
                />
                {/* Background Details */}
                <h3 className="col-span-full font-bold text-lg border-b pb-2 mt-4">Background & Job</h3>
                <InputField label="Caste" value={formData.caste} onChange={(v: string) => setFormData({ ...formData, caste: v })} />
                <InputField label="Sect" value={formData.sect} onChange={(v: string) => setFormData({ ...formData, sect: v })} />
                <InputField label="Mother Tongue" value={formData.motherTongue} onChange={(v: string) => setFormData({ ...formData, motherTongue: v })} />
                <InputField label="Education" value={formData.education} onChange={(v: string) => setFormData({ ...formData, education: v })} />
                <InputField label="Occupation" value={formData.occupation} onChange={(v: string) => setFormData({ ...formData, occupation: v })} />
                <InputField label="Monthly Income" value={formData.monthlyIncome} onChange={(v: string) => setFormData({ ...formData, monthlyIncome: v })} />

                {/* Physical & House Details */}
                <h3 className="col-span-full font-bold text-lg border-b pb-2 mt-4">Physical & House Details</h3>
                <InputField label="Height" value={formData.height} onChange={(v: string) => setFormData({ ...formData, height: v })} />
                <InputField label="Weight" value={formData.weight} onChange={(v: string) => setFormData({ ...formData, weight: v })} />
                <InputField label="House Type (e.g. Own/Rent)" value={formData.houseType} onChange={(v: string) => setFormData({ ...formData, houseType: v })} />
                <InputField label="House Size (e.g. 5 Marla)" value={formData.houseSize} onChange={(v: string) => setFormData({ ...formData, houseSize: v })} />
                <InputField label="Disability (If any)" value={formData.disability} onChange={(v: string) => setFormData({ ...formData, disability: v })} />
                <div className="md:col-span-3">
                    <SelectField
                        label="Package Plan"
                        options={["Basic Plan", "Gold Plan", "Diamond Plan"]}
                        value={formData.package}
                        onChange={(v: string) => setFormData({ ...formData, package: v })}
                    />
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 block">Candidate Requirements</label>
                    <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-[#c19206] focus:bg-white transition-all outline-none font-bold text-[#4a1111]" rows={4} />
                </div>
            </div>

            <button type="submit" disabled={uploading} className="w-full py-6 bg-[#4a1111] text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                {uploading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />} {isEdit ? "COMMIT CHANGES" : "PUBLISH PROFILE NOW"}
            </button>
        </form>
    );
}

/* ================= UI HELPERS ================= */
function InputField({ label, value, onChange, type = "text" }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 block">{label}</label>
            <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#c19206] focus:bg-white transition-all outline-none font-bold text-[#4a1111] text-sm" />
        </div>
    );
}

function SelectField({ label, options, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 block">{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#c19206] focus:bg-white transition-all outline-none font-black text-[#4a1111] text-sm appearance-none cursor-pointer">
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}

function DataField({ label, value }: { label: string, value: any }) {
    return (
        <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-[#4a1111]">{value || "---"}</p>
        </div>
    );
}

function ViewRequestModal({ user, onClose, onApprove, onReject }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-10 bg-[#4a1111] text-white flex justify-between items-center border-b-[8px] border-[#c19206]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#c19206] rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-white shadow-lg">{user.name?.[0]}</div>
                        <div>
                            <h3 className="text-4xl font-black tracking-tighter italic">{user.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg text-yellow-500">{user.package} Package</span>
                                <span className="text-xs font-black uppercase tracking-widest text-white/40 italic">Member since {new Date(user.createdAt || "").toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-16 h-16 hover:bg-red-500 rounded-full flex items-center justify-center transition-all group">
                        <FiX size={32} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 bg-[#fcfcfc] custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-12">
                            <section>
                                <h4 className="text-xs font-black text-[#c19206] uppercase tracking-[0.3em] mb-6 flex items-center gap-2"> <FiUsers /> Biographical Intelligence</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <DataField label="Father Name" value={user.fatherName} />
                                    <DataField label="Direct Phone" value={user.phone} />
                                    <DataField label="Email Address" value={user.email} />
                                    <DataField label="Age / Gender" value={`${user.age} / ${user.gender}`} />
                                    <DataField label="City Origin" value={user.city} />
                                    <DataField label="Caste / Tribe" value={user.caste} />
                                    <DataField label="Sect / Maslak" value={user.sect} />
                                    <DataField label="Marital Status" value={user.maritalStatus} />
                                    <DataField label="Occupation" value={user.occupation} />
                                    <DataField label="Education" value={user.education} />
                                    <DataField label="Mother Tongue" value={user.motherTongue} />
                                    <DataField label="Height" value={user.height} />
                                    <DataField label="Weight" value={user.weight} />
                                    <DataField label="Monthly Income" value={user.monthlyIncome} />
                                    <DataField label="House Size" value={user.houseSize} />
                                    <DataField label="House Type" value={user.houseType} />
                                    <DataField label="Family Detail" value={user.familyDetails} />
                                    <DataField label="About" value={user.about} />
                                    <DataField label="Diability" value={user.disability} />
                                </div>
                            </section>

                            <section className="bg-[#4a1111] p-8 rounded-[2.5rem] text-white shadow-2xl">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-4">Partner Prerequisites</h4>
                                <p className="text-xl font-bold italic leading-relaxed text-white/90">"{user.requirements || 'No specific requirements logged.'}"</p>
                            </section>
                        </div>
                        {/* RIGHT: Images (THE FIX IS HERE) */}
                        {/* RIGHT: Images & Payment (Clean Version) */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* User Gallery */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-black text-[#c19206] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FiImage /> Profile Gallery
                                </h4>
                                {user.images && user.images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {user.images.map((img: string, idx: number) => (
                                            <a key={idx} href={img} target="_blank" rel="noreferrer" className="block group overflow-hidden rounded-3xl shadow-md border-2 border-white">
                                                <img
                                                    src={img}
                                                    alt="User"
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-40 bg-gray-50 rounded-[2rem] border-2 border-dashed flex items-center justify-center text-gray-400 font-bold italic">
                                        No Gallery Images
                                    </div>
                                )}
                            </div>

                            {/* Transaction Section */}
                            <div className="bg-blue-50/30 p-6 rounded-[2.5rem] border border-blue-100">
                                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FiCreditCard /> Payment Evidence
                                </h4>
                                {user.paymentScreenshot ? (
                                    <a href={user.paymentScreenshot} target="_blank" rel="noreferrer" className="block group">
                                        <div className="relative h-72 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                                            <img
                                                src={user.paymentScreenshot}
                                                className="w-full h-full object-contain bg-white"
                                                alt="payment"
                                            />
                                            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white text-blue-600 px-4 py-2 rounded-full font-black text-xs">VIEW FULL RECEIPT</span>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="h-32 bg-red-50 rounded-[2rem] border-2 border-dashed border-red-100 flex items-center justify-center text-red-400 font-black text-xs uppercase">
                                        Receipt Missing
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-white border-t-2 border-gray-50 flex gap-6">
                    <button onClick={onApprove} className="flex-1 py-6 bg-green-500 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <FiCheckCircle size={24} /> EXECUTE APPROVAL
                    </button>
                    <button onClick={onReject} className="px-10 py-6 bg-red-50 text-red-500 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <FiTrash2 /> REJECT
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function EditProfileModal({ profile, onClose, API_URL, refresh }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3.5rem] overflow-y-auto shadow-2xl p-12 custom-scrollbar relative">
                <button onClick={onClose} className="absolute top-8 right-8 p-4 hover:bg-gray-100 rounded-full transition-colors"><FiX size={32} /></button>
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-[#4a1111] tracking-tighter italic">Edit: {profile.name}</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Direct Record Modification</p>
                </div>
                <CreateProfileForm
                    API_URL={API_URL}
                    refresh={refresh}
                    initialData={profile}
                    isEdit={true}
                    onClose={onClose}
                />
            </motion.div>
        </motion.div>
    );
}