"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Find Match', href: '/Profiles' },
        { name: 'Packages', href: '/Packages' },
        { name: 'Contact', href: '/Contact' },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* Logo Section */}
                <Link href="/" className="flex flex-col">
                    <span className="text-2xl font-black text-[#4a1111] leading-none">Aasan Rishta</span>
                    <span className="text-[10px] tracking-[0.3em] text-[#c19206] font-bold uppercase">Marriage Bureau</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-8 font-semibold text-gray-700">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:text-[#4a1111] transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Button & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="hidden md:block bg-[#4a1111] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-maroon/20"
                    >
                        Register Now
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-[#4a1111] p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4 font-semibold text-gray-700">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-[#4a1111] py-2 border-b border-gray-50"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button className="bg-[#4a1111] text-white px-6 py-3 rounded-xl text-center font-bold">
                                Register Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}