"use client";
import ProfileCard from '@/Components/ui/ProfileCard';

const allProfiles = [
    { id: 'SKB-101', title: 'Software Engineer', age: 28, status: 'Single', gender: 'Male', city: 'Lahore', image: '/m1.jpg' },
    { id: 'SKB-102', title: 'Doctor', age: 26, status: 'Single', gender: 'Female', city: 'Karachi', image: '/f1.jpg' },
    { id: 'SKB-103', title: 'Business Man', age: 30, status: 'Single', gender: 'Male', city: 'Islamabad', image: '/m2.jpg' },
    { id: 'SKB-104', title: 'Teacher', age: 25, status: 'Single', gender: 'Female', city: 'Lahore', image: '/f2.jpg' },
    // ... aap jitni chahein add karein
];

export default function FindMatch() {
    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[#4a1111]">Find Your Perfect Match</h1>
                    <p className="text-gray-500 mt-2">Browse through our verified profiles to find your soulmate.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {allProfiles.map((p) => (
                        <ProfileCard key={p.id} profile={p} />
                    ))}
                </div>
            </div>
        </div>
    );
}