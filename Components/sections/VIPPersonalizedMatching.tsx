import { FiUserCheck, FiEdit3, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function VIPPersonalizedMatching() {
    const steps = [
        {
            id: "01",
            title: "Registration & Verification",
            icon: <FiUserCheck />,
            desc: "Click the 'Register' button and enter basic details to get yourself verified. Upon verification, you'll fill a form about yourself and your ideal partner.",
            color: "from-yellow-400 to-yellow-600"
        },
        {
            id: "02",
            title: "Creating your profile",
            icon: <FiEdit3 />,
            desc: "Complete your profile by uploading your best photos and specific details to make your profile impressive and attract better responses.",
            color: "from-[#4a1111] to-[#7a1d1d]"
        },
        {
            id: "03",
            title: "Communicating with Match Maker",
            icon: <FiMessageCircle />,
            desc: "Once on the network, feel free to contact our representatives and let them identify your needs and preferences personally.",
            color: "from-yellow-500 to-yellow-700"
        }
    ];

    return (
        <section className="py-24 bg-[#fcfcfc] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* VIP Header */}
                <div className="text-center mb-20 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c19206]"
                    >
                        How It Works
                    </motion.span>
                    <h2 className="text-5xl md:text-7xl font-black text-[#4a1111] italic tracking-tighter">
                        Personalized Matching
                    </h2>
                    <div className="w-24 h-1.5 bg-[#c19206] mx-auto rounded-full" />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -15 }}
                            className="group relative bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 transition-all duration-500"
                        >
                            {/* Background Number Label */}
                            <span className="absolute top-6 right-10 text-8xl font-black text-gray-50 group-hover:text-yellow-50 transition-colors">
                                {step.id}
                            </span>

                            {/* Icon Box */}
                            <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl mb-10 group-hover:rotate-6 transition-transform`}>
                                {step.icon}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl font-black text-[#4a1111] uppercase tracking-tighter italic">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:via-[#c19206] transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA or Note */}
                <div className="mt-20 text-center">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                        Trusted by thousands of families worldwide
                    </p>
                </div>
            </div>
        </section>
    );
}