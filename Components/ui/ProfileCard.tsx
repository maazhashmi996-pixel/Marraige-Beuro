"use client";
import React from 'react';
import { MapPin, Briefcase, User, Calendar } from 'lucide-react';
import Link from 'next/link'; // Navigation ke liye zaroori hai

interface ProfileCardProps {
    profile: {
        id: string; // ID lazmi hai click ke liye
        mainImage?: string;
        image?: string;
        title: string;
        city: string;
        age: number | string;
        gender: string;
        status?: string;
    };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
    // Image path handle karne ke liye
    const imageUrl = profile.image || profile.mainImage || '/placeholder.jpg';

    return (
        /* Link tag pure card ko clickable bana deta hai */
        <Link href={`/Profiles/${profile.id}`} className="block">
            <div className="overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">
                {/* Image Container */}
                <div className="relative h-72 w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={profile.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop';
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Gender Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                        {profile.gender}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                            {profile.title}
                        </h3>
                        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs font-bold">
                            <Calendar size={12} /> {profile.age} yrs
                        </span>
                    </div>

                    <div className="space-y-2">
                        {/* City */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <MapPin size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.city}</span>
                        </div>

                        {/* Status/Career */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <Briefcase size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.status || "Verified Member"}</span>
                        </div>
                    </div>

                    {/* View Details Hint */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between group/btn">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Click to Unlock
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover/btn:bg-blue-600 transition-colors">
                            <User size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;