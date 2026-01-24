"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex flex-col">
                    <span className="text-2xl font-black text-[#4a1111] leading-none">SEHRISH KANWAL</span>
                    <span className="text-[10px] tracking-[0.3em] text-[#c19206] font-bold uppercase">Marriage Bureau</span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex space-x-8 font-semibold text-gray-700">
                    <Link href="/" className="hover:text-[#4a1111] transition">Home</Link>
                    <Link href="/Profiles" className="hover:text-[#4a1111] transition">Find Match</Link>
                    <Link href="/Packages" className="hover:text-[#4a1111] transition">Packages</Link>
                    <Link href="/Contact" className="hover:text-[#4a1111] transition">Contact</Link>
                </div>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#4a1111] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-maroon/20"
                >
                    Register Now
                </motion.button>
            </div>
        </nav>
    );
}