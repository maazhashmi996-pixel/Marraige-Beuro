"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

// Interface for Form Data
interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });

    const handleWhatsAppSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // WhatsApp configuration
        const phoneNumber = "+923315290212";

        // Message formatting for WhatsApp
        const text = `*New Inquiry from Website*%0A%0A` +
            `*Name:* ${encodeURIComponent(formData.name)}%0A` +
            `*Email:* ${encodeURIComponent(formData.email)}%0A` +
            `*Message:* ${encodeURIComponent(formData.message)}`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-[#4a1111] py-20 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black italic"
                >
                    Contact Us
                </motion.h1>
                <p className="text-[#c19206] mt-4 font-bold tracking-widest uppercase text-sm">
                    Assan Rishta Marriage Bureau - Get in Touch
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Side: Contact Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { icon: <Phone size={24} />, label: "Phone", val: "+923315290212" },
                            { icon: <Mail size={24} />, label: "Email", val: "Info@sehrishmarriage.com" },
                            { icon: <MapPin size={24} />, label: "Address", val: "Defence Mor Near Cavalary Ground Midland Plaza Lahore" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
                            >
                                <div className="bg-[#c19206]/10 p-4 rounded-2xl text-[#c19206]">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-gray-800 font-bold">{item.val}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Timings Card */}
                        <div className="bg-[#4a1111] p-8 rounded-[2.5rem] text-white shadow-xl">
                            <h4 className="font-bold text-xl mb-4 text-[#c19206]">Office Hours</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex justify-between"><span>Mon - Sat:</span> <span>10:00 AM - 08:00 PM</span></li>
                                <li className="flex justify-between"><span>Sunday:</span> <span className="text-[#c19206]">Closed</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Simplified WhatsApp Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 italic">Send us a Message</h3>

                            <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#c19206] focus:ring-1 focus:ring-[#c19206] transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#c19206] focus:ring-1 focus:ring-[#c19206] transition-all"
                                        placeholder="example@mail.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#c19206] focus:ring-1 focus:ring-[#c19206] transition-all resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-[#c19206] text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-[#a67d05] transition-all flex items-center justify-center gap-3"
                                >
                                    <Send size={20} />
                                    Send to WhatsApp
                                </motion.button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}