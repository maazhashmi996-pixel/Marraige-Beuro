"use client";
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, Lock } from 'lucide-react';

export default function About() {
    return (
        <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Aesthetic Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative"
            >
                <div className="rounded-tl-[120px] rounded-br-[120px] overflow-hidden shadow-2xl border-[12px] border-white">
                    <img src="/bride-4.jpg" alt="Wedding Couple" className="w-full h-[500px] object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#c19206] p-8 rounded-2xl hidden md:block">
                    <p className="text-white font-bold text-2xl tracking-tighter">10+ Years <br /> Experience</p>
                </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-black text-[#4a1111]">We Bring Dream Rishtay To Reality</h2>
                    <div className="w-20 h-1.5 bg-[#c19206] mt-4 rounded-full"></div>
                    <p className="text-gray-600 mt-6 leading-relaxed italic">
                        "With hearts full of love and hands joined in promise, Sehar and Beru begin their forever."
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: <UserCheck className="text-[#c19206]" />, title: "Personalized Matchmaking", desc: "Expert matchmakers take the time to understand your preferences." },
                        { icon: <ShieldCheck className="text-[#c19206]" />, title: "Verified Profiles", desc: "All profiles go through a strict verification process." },
                        { icon: <Lock className="text-[#c19206]" />, title: "Privacy & Confidentiality", desc: "Your information is handled with utmost care." }
                    ].map((item, i) => (
                        <motion.div key={i} whileHover={{ x: 10 }} className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50">
                            <div className="bg-gray-50 p-3 rounded-xl">{item.icon}</div>
                            <div>
                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}