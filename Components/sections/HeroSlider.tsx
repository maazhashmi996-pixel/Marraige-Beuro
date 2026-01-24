"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const slides = [
    {
        image: "/bride-1.jpg", // Apni images yahan rakhein
        title: "Find Your Soulmate",
        subtitle: "Trusted by thousands of families across Pakistan."
    },
    {
        image: "/bride-2.jpg",
        title: "Premium Matchmaking",
        subtitle: "Personalized service for your unique preferences."
    },
    {
        image: "/bride-3.jpg",
        title: "Begin Your Forever",
        subtitle: "Connecting hearts with dignity and respect."
    }
];

export default function HeroSlider() {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation]}
                effect="fade"
                autoplay={{ delay: 5000 }}
                navigation
                loop
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="relative h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/40" />

                            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-5xl md:text-7xl font-black text-white mb-4"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-xl md:text-2xl text-[#c19206] font-medium"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="mt-8 flex gap-4"
                                >
                                    <button className="bg-[#4a1111] text-white px-8 py-4 rounded-full font-bold hover:bg-[#c19206] transition-all shadow-xl">
                                        Get Started
                                    </button>
                                    <button className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-all">
                                        Learn More
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Slider Navigation Style */}
            <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #c19206 !important;
          transform: scale(0.7);
        }
      `}</style>
        </div>
    );
}