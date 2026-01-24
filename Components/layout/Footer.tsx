"use client";
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#4a1111] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Brand Identity */}
                <div className="space-y-6">
                    <Link href="/" className="flex flex-col">
                        <span className="text-2xl font-black tracking-tight">SEHRISH KANWAL</span>
                        <span className="text-[10px] tracking-[0.3em] text-[#c19206] font-bold uppercase">Marriage Bureau</span>
                    </Link>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Connecting hearts with dignity and tradition. We are Pakistan's most trusted personalized matchmaking service.
                    </p>
                    <div className="flex space-x-4">
                        {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                            <motion.a
                                key={i} href="#" whileHover={{ y: -5, color: '#c19206' }}
                                className="bg-white/10 p-2 rounded-full transition-colors"
                            >
                                <Icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-6 border-b border-[#c19206] w-fit pb-1">Quick Links</h4>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li><Link href="/profiles" className="hover:text-[#c19206] transition">Search Profiles</Link></li>
                        <li><Link href="/packages" className="hover:text-[#c19206] transition">Membership Plans</Link></li>
                        <li><Link href="/about" className="hover:text-[#c19206] transition">Our Story</Link></li>
                        <li><Link href="/success-stories" className="hover:text-[#c19206] transition">Success Stories</Link></li>
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div>
                    <h4 className="text-lg font-bold mb-6 border-b border-[#c19206] w-fit pb-1">Our Services</h4>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li>Personalized Matching</li>
                        <li>Verified Background Check</li>
                        <li>Consultation Service</li>
                        <li>Privacy Protection</li>
                    </ul>
                </div>

                {/* Column 4: Get In Touch */}
                <div>
                    <h4 className="text-lg font-bold mb-6 border-b border-[#c19206] w-fit pb-1">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                            <MapPin size={20} className="text-[#c19206] shrink-0" />
                            <span>2, H Block Sector 2 DHA Rahbar Lahore</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-[#c19206] shrink-0" />
                            <span>+92 327 7770361</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-[#c19206] shrink-0" />
                            <span>info@sehrishmarriage.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>© {currentYear} Sehrish Kanwal Marriage Bureau. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}