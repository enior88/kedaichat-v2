'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Users, Send, ChevronRight, TrendingUp, Loader2, Info } from 'lucide-react';
import BottomNav from './BottomNav';

export default function ResellerGroupDashboard() {
    const [activeTab, setActiveTab] = useState('Resellers');
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const tabs = ['Resellers', 'Group Orders'];

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStoreInfo(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#25D366]" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter">
            {/* Conditional Content Gating */}
            {(storeInfo?.plan === 'FREE' && !storeInfo.isAdmin) ? (
                <div className="flex flex-col min-h-[80vh]">
                    {/* Simplified Header for Free Users */}
                    <div className="bg-white px-6 py-8 shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Network</h1>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{storeInfo?.businessName || 'KedaiChat'}</p>
                    </div>

                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
                        <div className="w-28 h-28 bg-green-50 rounded-[40px] flex items-center justify-center mb-8 text-[#25D366] shadow-2xl shadow-green-100/50 rotate-3 transition-transform hover:rotate-0">
                            <Users size={56} strokeWidth={2.5} />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                            Scale your business <br /> with Resellers.
                        </h2>

                        <p className="text-gray-500 font-bold mb-10 max-w-[280px] leading-relaxed mx-auto text-sm">
                            Invite regulars to sell for you and manage group orders seamlessly. These are premium features.
                        </p>

                        <button
                            onClick={() => window.location.href = '/billing'}
                            className="w-full max-w-xs bg-[#25D366] text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Upgrade to Basic <ChevronRight size={20} />
                        </button>

                        <p className="mt-10 text-[10px] font-black text-gray-300 uppercase tracking-[4px]">
                            Professional Edition Required
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header & Tabs */}
                    <div className="bg-white px-6 pt-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Network</h1>
                                <p className="text-xs text-gray-400 font-medium">{storeInfo?.businessName || 'Your Store'}</p>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-[#25D366] uppercase tracking-wider">Live</span>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-1.5 rounded-[20px] mb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-sm font-bold rounded-[16px] transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 max-w-lg mx-auto">
                        {activeTab === 'Resellers' ? (
                            <div className="space-y-6 text-gray-900">
                                {/* Commission Card */}
                                <div className="bg-[#25D366] rounded-[28px] p-6 text-white shadow-xl shadow-green-100 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Total Commission Owed</p>
                                        <h2 className="text-3xl font-black mb-4">RM {(storeInfo?.revenueToday * 0.1 || 0).toFixed(2)}</h2>
                                        <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            <TrendingUp size={14} />
                                            <span className="text-[10px] font-bold">Calculated at 10% rate</span>
                                        </div>
                                    </div>
                                    <Users className="absolute -right-6 -bottom-6 text-white/10 w-36 h-36 rotate-12" />
                                </div>

                                {/* Tip/Info */}
                                <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 italic text-[11px] text-orange-700 leading-relaxed font-medium">
                                    <Info size={16} className="shrink-0" />
                                    Invite your regulars to become resellers! They earn commission while you get more orders automatically.
                                </div>

                                {/* Reseller List */}
                                <div>
                                    <div className="flex justify-between items-center mb-4 text-gray-900">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Resellers</h3>
                                        <span className="text-[10px] font-bold text-[#25D366]">3 Active</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Ali', sales: 14, comm: (storeInfo?.revenueToday || 140) * 0.05 },
                                            { name: 'Fatimah', sales: 8, comm: (storeInfo?.revenueToday || 80) * 0.03 },
                                            { name: 'Zul', sales: 22, comm: (storeInfo?.revenueToday || 220) * 0.02 },
                                        ].map((reseller) => (
                                            <div key={reseller.name} className="bg-white border border-gray-100 rounded-[24px] p-4 flex justify-between items-center shadow-xs hover:border-[#25D366]/30 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all">
                                                        {reseller.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{reseller.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{reseller.sales} Orders Generated</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900">RM {reseller.comm.toFixed(2)}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Pending</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full h-14 bg-[#25D366] text-white font-black rounded-[2xl] flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                                    <Share2 size={20} />
                                    Generate Reseller Invite Link
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 text-gray-900">
                                {/* Group Orders List */}
                                {[
                                    { id: 1, title: 'Friday Office Lunch', items: 12, status: 'Active', time: '12:30 PM' },
                                    { id: 2, title: 'Gym Buds Dinner', items: 5, status: 'Draft', time: '08:00 PM' },
                                ].map((session) => (
                                    <div key={session.id} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
                                        {session.status === 'Active' && (
                                            <div className="absolute top-0 right-0 bg-[#25D366] text-white text-[9px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest">
                                                Active
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-black text-gray-900 text-lg leading-tight">{session.title}</h3>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Delivery: {session.time} • {session.items} Items</p>
                                            </div>
                                            <div className={`p-2 rounded-xl ${session.status === 'Active' ? 'bg-green-50 text-[#25D366]' : 'bg-gray-50 text-gray-300'}`}>
                                                <TrendingUp size={22} />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-6">
                                            <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#25D366]" style={{ width: session.status === 'Active' ? '65%' : '0%' }} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400">{session.status === 'Active' ? '65%' : '0%'}</span>
                                        </div>

                                        <button className="w-full h-12 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest">
                                            <Send size={16} />
                                            Push Combined Order
                                        </button>
                                    </div>
                                ))}

                                <div className="p-8 text-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px]">
                                    <p className="text-sm font-bold">New group order session?</p>
                                    <button
                                        onClick={() => setActiveTab('Resellers')} // placeholder action
                                        className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-xs font-black text-gray-900 hover:border-[#25D366] transition-all"
                                    >
                                        Start New Session
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}


        </div>
    );

}
