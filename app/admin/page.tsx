"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    FiUsers, FiPlusCircle, FiCheckCircle, FiClock,
    FiSettings, FiLogOut, FiFilter, FiDollarSign, FiTrash2, FiEye, FiLoader,
    FiCamera, FiUploadCloud, FiX, FiCheck, FiSmartphone, FiImage, FiCreditCard, FiEdit3
} from "react-icons/fi";

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
    familyDetails?: string;
    maritalStatus?: string;
    images?: string[];
    paymentScreenshot?: string;
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

    const API_URL = "http://localhost:5000/api";

    // ✅ AUTH CHECK LOGIC
    useEffect(() => {
        const token = localStorage.getItem("token"); // Backend se aya hua token
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        try {
            const user = JSON.parse(userData);
            if (user.role !== "admin") {
                alert("Access Denied: You are not an Admin!");
                router.push("/"); // Non-admin ko home page pe bhej dein
            } else {
                setIsAuthorized(true);
            }
        } catch (e) {
            router.push("/login");
        }
    }, [router]);

    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            const profRes = await fetch(`${API_URL}/admin/profiles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const regRes = await fetch(`${API_URL}/admin/registrations?range=${filterRange}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profRes.ok && regRes.ok) {
                setProfiles(await profRes.json() || []);
                setRegistrations(await regRes.json() || []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [filterRange, API_URL]);

    useEffect(() => {
        if (isAuthorized) {
            fetchDashboardData();
        }
    }, [fetchDashboardData, isAuthorized]);

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete-reg') => {
        const token = localStorage.getItem("token");
        const confirmMsg = action === 'reject' ? "Reject and Delete this request?" : "Are you sure?";
        if (!confirm(confirmMsg)) return;

        try {
            const endpoint = action === 'approve' ? `approve/${id}` : `registration/${id}`;
            const res = await fetch(`${API_URL}/admin/${endpoint}`, {
                method: action === 'approve' ? "PUT" : "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSelectedUser(null);
                fetchDashboardData();
            }
        } catch (err) { alert("Action failed"); }
    };

    if (!isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-black text-[#4a1111]">
                VERIFYING AUTHORITY...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* SIDEBAR */}
            <aside className="w-80 bg-[#4a1111] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20">
                <div className="p-8">
                    <h1 className="text-3xl font-black tracking-tighter">MATCH<span className="text-[#c19206]">CRM</span></h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.3em] font-bold">Admin Authority</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: "stats", label: "Overview", icon: <FiFilter /> },
                        { id: "create", label: "Manual Profile", icon: <FiPlusCircle /> },
                        { id: "pending", label: "New Requests", icon: <FiClock /> },
                        { id: "manage", label: "Live Profiles", icon: <FiSettings /> },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === item.id ? "bg-[#c19206] text-white shadow-lg" : "hover:bg-white/10 text-gray-300"}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <button onClick={() => { localStorage.clear(); router.push("/login"); }}
                        className="w-full p-4 bg-red-500/20 text-red-400 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all">
                        <FiLogOut className="inline mr-2" /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-black text-[#4a1111] uppercase tracking-tighter">{activeTab}</h2>
                    <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)} className="p-4 rounded-2xl border font-bold shadow-sm outline-none">
                        <option value="all">All Records</option>
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                    </select>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20"><FiLoader className="animate-spin text-5xl text-[#c19206]" /></div>
                ) : (
                    <div className="max-w-7xl">
                        {activeTab === "stats" && <StatsGrid registrations={registrations} profiles={profiles} />}
                        {activeTab === "create" && <CreateProfileForm API_URL={API_URL} refresh={fetchDashboardData} />}
                        {activeTab === "pending" && <PendingList users={registrations} onOpenView={setSelectedUser} onReject={(id) => handleAction(id, 'reject')} />}
                        {activeTab === "manage" && <ManageProfilesList profiles={profiles} API_URL={API_URL} refresh={fetchDashboardData} onEdit={setEditingProfile} />}
                    </div>
                )}

                {/* VIEW PENDING REQUEST MODAL */}
                <AnimatePresence>
                    {selectedUser && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                                <div className="p-8 bg-[#4a1111] text-white flex justify-between items-center border-b-4 border-[#c19206]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#c19206] rounded-xl flex items-center justify-center text-2xl font-black">{selectedUser.name ? selectedUser.name[0] : "?"}</div>
                                        <div>
                                            <h3 className="text-2xl font-black">{selectedUser.name}</h3>
                                            <p className="text-xs font-bold text-[#c19206] uppercase tracking-widest">{selectedUser.package} Package Request</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-red-500 rounded-full transition-all"><FiX size={24} /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                            <h4 className="col-span-2 font-black text-[#4a1111] border-b pb-2 flex items-center gap-2"><FiUsers /> Member Details</h4>

                                            <DataField label="Father Name" value={selectedUser.fatherName} />
                                            <DataField label="Contact" value={selectedUser.phone} />
                                            <DataField label="Age / Gender" value={`${selectedUser.age || '---'} / ${selectedUser.gender || '---'}`} />
                                            <DataField label="City" value={selectedUser.city} />
                                            <DataField label="Caste / Sect" value={`${selectedUser.caste || '---'} (${selectedUser.sect || '---'})`} />
                                            <DataField label="Profession" value={selectedUser.occupation} />
                                            <DataField label="Income" value={selectedUser.monthlyIncome} />
                                            <DataField label="Marital Status" value={selectedUser.maritalStatus} />

                                            <div className="col-span-2 p-4 bg-white rounded-2xl border">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Requirements</p>
                                                <p className="text-sm font-medium italic">
                                                    {selectedUser.requirements ? `"${selectedUser.requirements}"` : "No requirements specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-black text-blue-600 mb-3 flex items-center gap-2"><FiCreditCard /> Payment Proof</h4>
                                                {selectedUser.paymentScreenshot ? (
                                                    <a href={selectedUser.paymentScreenshot} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-2xl border-4 border-white shadow-md">
                                                        <img src={selectedUser.paymentScreenshot} alt="payment" className="w-full h-48 object-cover group-hover:scale-110 transition-transform" />
                                                    </a>
                                                ) : <div className="p-10 bg-gray-200 rounded-2xl text-center text-gray-400 italic">No Screenshot</div>}
                                            </div>

                                            <div>
                                                <h4 className="font-black text-[#c19206] mb-3 flex items-center gap-2"><FiImage /> Personal Photos</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {selectedUser.images && selectedUser.images.length > 0 ? (
                                                        selectedUser.images.map((img, i) => (
                                                            <img key={i} src={img} alt="user" className="w-full h-24 object-cover rounded-xl border-2 border-white shadow-sm" />
                                                        ))
                                                    ) : <p className="text-xs text-gray-400 col-span-2">No photos uploaded</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white border-t flex gap-4">
                                    <button onClick={() => handleAction(selectedUser._id, 'approve')} className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-600 shadow-lg transition-all">
                                        <FiCheck size={20} /> APPROVE & PUBLISH
                                    </button>
                                    <button onClick={() => handleAction(selectedUser._id, 'reject')} className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                                        <FiTrash2 size={20} /> REJECT REQUEST
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* EDIT LIVE PROFILE MODAL */}
                <AnimatePresence>
                    {editingProfile && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl p-8 custom-scrollbar">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-[#4a1111]">Update Profile: {editingProfile.name}</h3>
                                    <button onClick={() => setEditingProfile(null)} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={24} /></button>
                                </div>
                                <CreateProfileForm
                                    API_URL={API_URL}
                                    refresh={() => { fetchDashboardData(); setEditingProfile(null); }}
                                    initialData={editingProfile}
                                    isEdit={true}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

/* ================= COMPONENT PARTS ================= */

function DataField({ label, value }: { label: string, value?: string | number }) {
    return (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
            <p className="text-[#4a1111] font-bold text-sm">
                {value && String(value).trim() !== "" && !String(value).includes("undefined") ? value : "---"}
            </p>
        </div>
    );
}

function PendingList({ users, onOpenView, onReject }: { users: RegistrationRequest[], onOpenView: (u: RegistrationRequest) => void, onReject: (id: string) => void }) {
    const pending = users.filter(u => !u.isApproved);
    return (
        <div className="space-y-4">
            {pending.length === 0 && <div className="p-20 text-center bg-white rounded-3xl text-gray-400 italic font-bold">All caught up! No new requests.</div>}
            {pending.map(user => (
                <div key={user._id} className="bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-[#c19206] transition-all flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-[#4a1111] border">{user.name ? user.name[0] : "?"}</div>
                        <div>
                            <h4 className="font-black text-lg text-[#4a1111]">{user.name} <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-2">{user.package}</span></h4>
                            <p className="text-xs font-bold text-gray-400">{user.city || "No City"} • {user.age || "?? "} Yrs • {user.occupation || "No Profession"}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onOpenView(user)} className="p-3 bg-gray-100 rounded-xl hover:bg-[#4a1111] hover:text-white transition-all font-bold text-sm flex items-center gap-2">
                            <FiEye /> Preview
                        </button>
                        <button onClick={() => onReject(user._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ManageProfilesList({ profiles, API_URL, refresh, onEdit }: { profiles: UserProfile[], API_URL: string, refresh: () => void, onEdit: (p: UserProfile) => void }) {
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this profile forever?")) return;
        const res = await fetch(`${API_URL}/admin/profile/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) refresh();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(p => (
                <div key={p._id} className="bg-white p-4 rounded-3xl border flex items-center justify-between group shadow-sm">
                    <div className="flex items-center gap-4">
                        <img src={p.mainImage} alt="main" className="w-16 h-16 rounded-2xl object-cover border" />
                        <div>
                            <h4 className="font-black text-[#4a1111]">{p.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.city} | {p.caste}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><FiEdit3 /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatsGrid({ registrations, profiles }: { registrations: RegistrationRequest[], profiles: UserProfile[] }) {
    const pending = registrations.filter(u => !u.isApproved).length;
    const revenue = registrations.filter(u => u.isApproved).length * 1500;
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard label="Pending" value={pending} color="border-yellow-500" />
            <StatCard label="Live Profiles" value={profiles.length} color="border-green-500" />
            <StatCard label="Total Revenue" value={`Rs. ${revenue}`} color="border-[#c19206]" />
            <StatCard label="Site Visitors" value="1.2k" color="border-blue-500" />
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: any, color: string }) {
    return (
        <div className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-8 ${color}`}>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-[#4a1111] mt-2">{value}</p>
        </div>
    );
}

/* ================= CREATE / EDIT FORM COMPONENT ================= */
function CreateProfileForm({ API_URL, refresh, initialData, isEdit }: { API_URL: string, refresh: () => void, initialData?: UserProfile, isEdit?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialData?.gallery || []);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        fatherName: initialData?.fatherName || "",
        title: initialData?.title || "",
        age: initialData?.age || "",
        gender: initialData?.gender || "Male",
        caste: initialData?.caste || "",
        religion: initialData?.religion || "Islam",
        sect: initialData?.sect || "Sunni",
        city: initialData?.city || "",
        height: initialData?.height || "",
        weight: initialData?.weight || "",
        maritalStatus: initialData?.maritalStatus || "Single",
        education: initialData?.education || "",
        occupation: initialData?.occupation || initialData?.profession || "",
        monthlyIncome: initialData?.monthlyIncome || "",
        motherTongue: initialData?.motherTongue || "",
        houseType: initialData?.houseType || "Own",
        houseSize: initialData?.houseSize || "",
        disability: initialData?.disability || "None",
        requirements: initialData?.requirements || "",
        about: initialData?.about || "",
        familyDetails: initialData?.familyDetails || ""
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            setPreviews(files.map(f => URL.createObjectURL(f)));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));
        selectedFiles.forEach(f => data.append("images", f));

        try {
            const endpoint = isEdit ? `/admin/profile/${initialData?._id}` : `/admin/create-profile`;
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: method,
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: data
            });

            if (res.ok) {
                alert(isEdit ? "Profile Updated Successfully!" : "Profile Published Successfully!");
                if (!isEdit) {
                    setFormData({
                        name: "", fatherName: "", title: "", age: "", gender: "Male",
                        caste: "", religion: "Islam", sect: "Sunni", city: "",
                        height: "", weight: "", maritalStatus: "Single",
                        education: "", occupation: "", monthlyIncome: "",
                        motherTongue: "", houseType: "Own", houseSize: "",
                        disability: "None", requirements: "", about: "", familyDetails: ""
                    });
                    setSelectedFiles([]);
                    setPreviews([]);
                }
                refresh();
            }
        } catch (err) { alert("Error saving profile"); } finally { setLoading(false); }
    };

    return (
        <div className={`${isEdit ? '' : 'bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100'}`}>
            {!isEdit && (
                <h3 className="text-2xl font-black text-[#4a1111] mb-8 flex items-center gap-3">
                    <FiPlusCircle className="text-[#c19206]" /> Create Manual Public Profile
                </h3>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Display Title & Name</label>
                        <input type="text" placeholder="Profile Title (e.g. Educated Sunni Girl - Doctor)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="text" placeholder="Father Name" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 relative">
                        <FiUploadCloud className="text-3xl text-[#c19206] mb-1" />
                        <p className="text-xs font-bold text-gray-500">Public Photos</p>
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        <div className="flex gap-1 mt-2 flex-wrap justify-center">
                            {previews.slice(0, 4).map((src, i) => <img key={i} src={src} alt="preview" className="w-8 h-8 rounded-lg object-cover border shadow-sm" />)}
                        </div>
                    </div>
                </div>

                <hr />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Age</label>
                        <input type="number" placeholder="Age" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Gender</label>
                        <select className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                            <option>Male</option><option>Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">City</label>
                        <input type="text" placeholder="City" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Marital Status</label>
                        <select className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                            <option>Single</option><option>Divorced</option><option>Widowed</option><option>Separated</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Education" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} />
                    <input type="text" placeholder="Occupation" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} />
                    <input type="text" placeholder="Monthly Income" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.monthlyIncome} onChange={e => setFormData({ ...formData, monthlyIncome: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Caste" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.caste} onChange={e => setFormData({ ...formData, caste: e.target.value })} />
                    <input type="text" placeholder="Sect" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.sect} onChange={e => setFormData({ ...formData, sect: e.target.value })} />
                    <input type="text" placeholder="Height" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                    <input type="text" placeholder="Mother Tongue" className="p-4 rounded-2xl bg-gray-50 border outline-none" value={formData.motherTongue} onChange={e => setFormData({ ...formData, motherTongue: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea placeholder="Partner Requirements" className="p-4 rounded-2xl bg-gray-50 border outline-none min-h-[100px]" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} />
                    <textarea placeholder="Brief About Family" className="p-4 rounded-2xl bg-gray-50 border outline-none min-h-[100px]" value={formData.familyDetails} onChange={e => setFormData({ ...formData, familyDetails: e.target.value })} />
                </div>

                <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${loading ? 'bg-gray-200' : 'bg-[#c19206] text-white hover:bg-[#4a1111] shadow-xl hover:shadow-2xl'}`}>
                    {loading ? "SYNCING DATA..." : isEdit ? "UPDATE PROFILE" : "PUBLISH LIVE PROFILE"}
                </button>
            </form>
        </div>
    );
}