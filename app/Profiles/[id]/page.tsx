"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function ProfileDetailPage() {
    const { id } = useParams();

    // Dummy Detail Data (Asal mein ye API ya LocalStorage se aye ga)
    const profileDetail = {
        id: id,
        fullName: "Sarmad Bin Munir",
        designation: "Software Engineer",
        age: 28,
        status: "Single",
        religion: "Islam",
        sect: "Sunni",
        education: "Bachelors in Computer Science",
        city: "Lahore",
        images: ["/m1.jpg", "/m2.jpg", "/f1.jpg", "/f2.jpg"], // 4 Photos ka array
        bio: "I am a career-oriented individual with a blend of modern and traditional values. I believe in mutual respect and transparency in relationships. Currently working in a multinational firm, I enjoy traveling and reading in my free time. Looking for a partner who is educated and values family bonds.",
        expectations: "Seeking a well-educated girl from a respectable family. Preference for someone who is either working or has a professional degree."
    };

    return (
        <main className="min-h-screen bg-[#fcf9f4] py-16 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Top Section: Photo Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[500px]">
                    <div className="md:col-span-2 h-full">
                        <img src={profileDetail.images[0]} className="w-full h-full object-cover rounded-3xl shadow-lg border-4 border-white" />
                    </div>
                    <div className="grid grid-rows-3 gap-4 h-full">
                        <img src={profileDetail.images[1]} className="w-full h-full object-cover rounded-2xl border-2 border-white" />
                        <img src={profileDetail.images[2]} className="w-full h-full object-cover rounded-2xl border-2 border-white" />
                        <img src={profileDetail.images[3]} className="w-full h-full object-cover rounded-2xl border-2 border-white" />
                    </div>
                    <div className="bg-[#4a1111] rounded-3xl p-8 flex flex-col justify-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Quick Info</h2>
                        <ul className="space-y-3 opacity-90">
                            <li>💍 <b>Status:</b> {profileDetail.status}</li>
                            <li>📍 <b>City:</b> {profileDetail.city}</li>
                            <li>🎓 <b>Edu:</b> {profileDetail.education}</li>
                            <li>☪️ <b>Sect:</b> {profileDetail.sect}</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Bio & Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-10 rounded-[40px] shadow-sm">
                            <h1 className="text-4xl font-black text-[#4a1111] mb-2">{profileDetail.fullName}</h1>
                            <p className="text-[#c19206] font-bold text-lg mb-6">{profileDetail.designation}</p>

                            <div className="w-20 h-1 bg-[#c19206] mb-8"></div>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 italic">Biography</h3>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {profileDetail.bio}
                            </p>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 italic">Partner Expectations</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {profileDetail.expectations}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar: Action Box */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border-t-8 border-[#4a1111] text-center">
                            <h4 className="text-gray-500 font-medium mb-2">Interested in this profile?</h4>
                            <p className="text-sm text-gray-400 mb-6">Send a request to see contact details</p>
                            <button className="w-full py-4 bg-[#4a1111] text-white rounded-xl font-bold hover:bg-[#c19206] transition-colors duration-300">
                                Send Interest
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}