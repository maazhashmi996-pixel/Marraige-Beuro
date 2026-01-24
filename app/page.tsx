import About from "@/Components/sections/About";
import Contact from "@/Components/sections/Contact";
import FeaturedProfiles from "@/Components/sections/FeaturedProfiles";
import HeroSlider from "@/Components/sections/HeroSlider";
import { div } from "framer-motion/client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <About />
      <FeaturedProfiles />
      <Contact />
    </div>
  );
}
