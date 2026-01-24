"use client";
import { motion } from 'framer-motion';
import { Check, Star, Crown, Gem } from 'lucide-react';

const plans = [
    {
        name: "Basic Plan",
        price: "FREE",
        icon: <Star className="text-gray-400" />,
        features: ["3 Profile Matches", "Standard Support", "Profile Visibility", "1 Month Validity"],
        recommended: false
    },
    {
        name: "Gold Plan",
        price: "Rs. 5,000",
        icon: <Crown className="text-[#c19206]" />,
        features: ["10 Profile Matches", "Direct Contact Access", "Priority Support", "3 Months Validity", "Verified Badge"],
        recommended: true
    },
    {
        name: "Diamond Plan",
        price: "Rs. 15,000",
        icon: <Gem className="text-[#c19206]" />,
        features: ["Unlimited Matches", "Personal Matchmaker", "Background Verification", "Lifetime Access", "Featured Profile Listing"],
        recommended: false
    }
];

export default function Packages() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-[#4a1111]">Membership Packages</h2>
                    <div className="w-20 h-1.5 bg-[#c19206] mx-auto mt-4 rounded-full"></div>
                    <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
                        Choose the perfect plan to start your journey towards a beautiful forever.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15 }}
                            className={`relative p-8 rounded-[3rem] border-2 transition-all duration-300 ${plan.recommended
                                    ? 'border-[#c19206] shadow-2xl shadow-gold/20 bg-white scale-105 z-10'
                                    : 'border-gray-100 hover:border-[#4a1111] bg-gray-50'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#c19206] text-white px-6 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6 flex justify-between items-start">
                                <div className="p-4 bg-white rounded-2xl shadow-sm">{plan.icon}</div>
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                                    <p className="text-2xl font-black text-[#4a1111]">{plan.price}</p>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                        <Check size={18} className="text-[#c19206] shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.recommended
                                    ? 'bg-[#c19206] text-white hover:bg-black shadow-lg shadow-gold/30'
                                    : 'bg-[#4a1111] text-white hover:bg-[#c19206]'
                                }`}>
                                Choose {plan.name.split(' ')[0]}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}