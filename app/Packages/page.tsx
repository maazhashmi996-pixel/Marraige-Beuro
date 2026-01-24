import Packages from '@/Components/sections/Packages';

export default function PackagesPage() {
    return (
        <div className="pt-10">
            <div className="bg-[#4a1111] py-20 text-center text-white">
                <h1 className="text-5xl font-black italic">Choose Your Plan</h1>
                <p className="text-[#c19206] mt-4 font-bold tracking-widest uppercase text-sm">Invest in your future</p>
            </div>
            <Packages />
        </div>
    );
}