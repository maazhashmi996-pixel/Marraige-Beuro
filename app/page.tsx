"use client"; // <--- Ye line ab poore page ko client-side bana degi

import dynamic from 'next/dynamic';

// Simple imports use karein, dynamic ki zaroorat nahi padegi agar "use client" upar hai
// Lekin agar abhi bhi masla kare toh aise hi rehne dein:
const HeroSlider = dynamic(() => import("@/Components/sections/HeroSlider"), { ssr: false });
const About = dynamic(() => import("@/Components/sections/About"), { ssr: false });
const WhyAsaanRishta = dynamic(() => import("@/Components/sections/WhyAsaanRishta"), { ssr: false });
const VIPPersonalizedMatching = dynamic(() => import("@/Components/sections/VIPPersonalizedMatching"), { ssr: false });
const Contact = dynamic(() => import("@/Components/sections/Contact"), { ssr: false });

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <About />
      <WhyAsaanRishta />
      <VIPPersonalizedMatching />
      <Contact />
    </main>
  );
}