"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiTarget, FiShield, FiUsers, FiArrowRight } from "react-icons/fi";

export default function WhyAsaanRishta() {
    const features = [
        {
            icon: <FiTarget className="text-yellow-600" />,
            title: "Precision Matching",
            desc: "Hum sirf profiles nahi dikhate, balkay aapki values aur lifestyle ke mutabiq perfect compatibility find karte hain."
        },
        {
            icon: <FiShield className="text-yellow-600" />,
            title: "Verified Privacy",
            desc: "Aapka data aur identity hamari top priority hai. 100% verified profiles aur secure communication ka waada."
        },
        {
            icon: <FiUsers className="text-yellow-600" />,
            title: "Human Touch",
            desc: "Algorithms ke bajaye hamare expert match-makers personally har case ko handle karte hain."
        }
    ];

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#4a1111]/[0.02] -skew-x-12 transform translate-x-20" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Content */}
                    <div className="space-y-8">
                        <div>
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-[#c19206] font-black text-[10px] uppercase tracking-[0.5em] block mb-4"
                            >
                                Beyond Traditional Matchmaking
                            </motion.span>
                            <h2 className="text-5xl md:text-7xl font-black text-[#4a1111] italic tracking-tighter leading-none">
                                Why <span className="text-[#c19206]">AsaanRishta.com</span>
                            </h2>
                        </div>

                        <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                            "Unlike traditional rishta theory, we rely on a cooperative, interactive bond between our expert representatives and clients. Initially, you are assisted by an intelligent facilitator to ensure your journey is seamless and dignified."
                        </p>

                        <div className="space-y-6">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#4a1111] group-hover:text-white transition-all duration-500 shadow-sm">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-[#4a1111] uppercase tracking-tighter">{f.title}</h4>
                                        <p className="text-gray-400 text-sm font-medium">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <Link href="/Profiles" className="inline-block">
                            <button className="group flex items-center gap-3 bg-[#4a1111] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#c19206] transition-all shadow-xl shadow-red-900/10">
                                LEARN MORE ABOUT US <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Right Side: VIP Visual */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative z-20 rounded-[4rem] overflow-hidden shadow-2xl rotate-2"
                        >
                            <img
                                src="/Bride-5 (1).png"
                                alt="Premium Matchmaking"
                                className="w-full h-[600px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4a1111]/80 via-transparent to-transparent" />

                            {/* Overlay Glass Card */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] text-white">
                                <p className="text-sm font-bold italic opacity-80 mb-2">"Trusted by 10,000+ Families"</p>
                                <h3 className="text-2xl font-black tracking-tighter uppercase">Pakistan's Most Trusted Network</h3>
                            </div>
                        </motion.div>

                        {/* Decorative Gold Frame */}
                        <div className="absolute inset-0 border-[12px] border-[#c19206]/10 rounded-[4rem] -translate-x-6 translate-y-6 z-10" />
                    </div>

                </div>
            </div>
        </section>
    );
}