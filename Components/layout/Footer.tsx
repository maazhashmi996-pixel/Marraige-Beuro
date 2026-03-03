"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#4a1111] text-white py-10"> {/* Height kam karne ke liye padding kam ki */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Gap kam kiya */}

                {/* Column 1: Brand Identity */}
                <div className="space-y-4"> {/* Spacing kam ki */}
                    <Link href="/" className="inline-block">
                        <Image
                            src="/Logo.png"
                            alt="Aasan Rishta Logo"
                            width={160} // Logo size thora compress kiya height ke liye
                            height={50}
                            className="object-contain"
                        />
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
                    <h4 className="text-lg font-bold mb-4 border-b border-[#c19206] w-fit pb-1">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-300"> {/* Spacing kam ki */}
                        <li><Link href="/profiles" className="hover:text-[#c19206] transition">Search Profiles</Link></li>
                        <li><Link href="/packages" className="hover:text-[#c19206] transition">Membership Plans</Link></li>
                        <li><Link href="/about" className="hover:text-[#c19206] transition">Our Story</Link></li>
                        <li><Link href="/success-stories" className="hover:text-[#c19206] transition">Success Stories</Link></li>
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div>
                    <h4 className="text-lg font-bold mb-4 border-b border-[#c19206] w-fit pb-1">Our Services</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>Personalized Matching</li>
                        <li>Verified Background Check</li>
                        <li>Consultation Service</li>
                        <li>Privacy Protection</li>
                    </ul>
                </div>

                {/* Column 4: Get In Touch */}
                <div>
                    <h4 className="text-lg font-bold mb-4 border-b border-[#c19206] w-fit pb-1">Contact Us</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#c19206] shrink-0" />
                            <span>Defence Mor Near Cavalary Ground Midland Plaza Lahore</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={16} className="text-[#c19206] shrink-0" />
                            <span>+923315290212</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-[#c19206] shrink-0" />
                            <span>info@sehrishmarriage.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-8 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>© {currentYear} Aasan Rishta Marriage Bureau. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}