"use client";
import React, { useState } from 'react';
import { X, Smartphone, Banknote, ShieldCheck, CheckCircle2, MessageSquare, Copy, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function ProfileAccessModal({ isOpen, onClose, profileId }: { isOpen: boolean, onClose: () => void, profileId: string }) {
    const [step, setStep] = useState(1); // 1: Register, 2: Payment/Thanks
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    if (!isOpen) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Admin Dashboard ke liye request create karna
            await api.post('/requests/access-request', {
                ...formData,
                profileId,
                status: 'pending'
            });
            setStep(2);
        } catch (err) {
            alert("Request failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
                {/* Close Button */}
                <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
                    <X size={20} className="text-slate-400" />
                </button>

                {step === 1 ? (
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="text-blue-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Unlock Full Profile</h2>
                            <p className="text-slate-500 text-sm mt-2">Register to view contact details and full photos.</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <input required placeholder="Your Full Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800"
                                onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <input required placeholder="WhatsApp Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800"
                                onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95">
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Request Access"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
                            <h2 className="text-2xl font-[950] text-slate-900 uppercase tracking-tighter">Thanks for Registering!</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium italic underline decoration-blue-200">Final Step: Complete Subscription</p>
                        </div>

                        {/* Payment Box */}
                        <div className="space-y-3 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#e52d27]/10 rounded-xl flex items-center justify-center text-[#e52d27] font-black italic text-xs">EP</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EasyPaisa / JazzCash</p>
                                        <p className="font-bold text-slate-800">0300 1234567</p>
                                    </div>
                                </div>
                                <button onClick={() => copyToClipboard('03001234567')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-blue-600"><Copy size={16} /></button>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600"><Banknote size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HBL Bank Account</p>
                                        <p className="font-bold text-slate-800 italic">PK75 HABL 0001 2345 6789</p>
                                    </div>
                                </div>
                                <button onClick={() => copyToClipboard('PK75HABL000123456789')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-blue-600"><Copy size={16} /></button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center">
                            <p className="text-blue-800 text-xs font-bold leading-relaxed mb-4 italic">
                                "Please send a screenshot of the payment on WhatsApp. Our admin will approve your access within 15 minutes."
                            </p>
                            <a href="https://wa.me/923001234567" target="_blank" className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:shadow-lg transition-all active:scale-95">
                                <MessageSquare size={18} />
                                Send Screenshot
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}