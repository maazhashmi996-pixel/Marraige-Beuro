"use client";
import React from 'react';
import { MapPin, Briefcase, User, Calendar, GraduationCap, Lock } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
    profile: any;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
    // Backend schema ke mutabiq values handle karna
    // In fields ko hum hamesha dikhayenge (Publicly visible)
    const displayTitle = profile.name || "User Profile";
    const imageUrl = profile.mainImage || profile.image || '/placeholder.jpg';

    return (
        <Link href={`/Profiles/view?id=${profile._id}`} className="block">
            <div className="overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">

                {/* 1. Image Section */}
                <div className="relative h-72 w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={displayTitle}
                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${profile.isLocked ? 'blur-[1px]' : ''}`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Gender Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                        {profile.gender || "Profile"}
                    </div>
                </div>

                {/* 2. Content Section (Ye Data Publically nazar ayega) */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight truncate mr-2">
                            {displayTitle}
                        </h3>
                        <span className="flex-shrink-0 flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs font-bold">
                            <Calendar size={12} /> {profile.age || "??"} yrs
                        </span>
                    </div>

                    <div className="space-y-2">
                        {/* City */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <MapPin size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.city || "Not Specified"}</span>
                        </div>

                        {/* Occupation */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <Briefcase size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.occupation || profile.profession || "Not Specified"}</span>
                        </div>

                        {/* Education */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <GraduationCap size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.education || "Not Specified"}</span>
                        </div>

                        {/* Marital Status */}
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center">
                                <User size={14} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-medium">{profile.maritalStatus || "Not Specified"}</span>
                        </div>
                    </div>

                    {/* 3. Footer Section (Indicating Lock Status) */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between group/btn">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${profile.isLocked ? 'text-orange-500' : 'text-slate-400'}`}>
                            {profile.isLocked ? "Premium Unlock Required" : "Contact Info Unlocked"}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${profile.isLocked ? 'bg-slate-200 text-slate-600' : 'bg-slate-900 text-white'} group-hover/btn:bg-blue-600 group-hover/btn:text-white`}>
                            {profile.isLocked ? <Lock size={14} /> : <User size={14} />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;