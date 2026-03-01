"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Image component add kiya hai
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

                {/* Logo Section - Ab yahan PNG Image use hogi */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/Logo.png" // Apni logo file ka path yahan likhein (e.g., /public/logo.png)
                        alt="Aasan Rishta Logo"
                        width={120} // Logo ki width adjust karein
                        height={50}  // Logo ki height adjust karein
                        className="object-contain"
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-8 font-semibold text-gray-700">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:text-[#4a1111] transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Login Button & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    <Link href="/Login"> {/* Path /Login kar diya hai */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="hidden md:block bg-[#4a1111] text-white px-8 py-2 rounded-full text-sm font-bold shadow-lg shadow-maroon/20"
                        >
                            Login
                        </motion.button>
                    </Link>

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
                            <Link href="/Login" onClick={() => setIsOpen(false)}>
                                <button className="w-full bg-[#4a1111] text-white px-10 py-20 rounded-xl text-center font-bold">
                                    Login
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}