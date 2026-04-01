'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from './BottomNav';

export default function Analytics() {
    const router = useRouter();
    const [storeInfo, setStoreInfo] = useState<{ plan?: string; isAdmin?: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const plan = storeInfo?.plan?.toUpperCase() || 'FREE';
    const isPro = plan === 'PRO' || plan === 'BUSINESS' || storeInfo?.isAdmin;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter relative">
            {/* Header */}
            <div className="bg-white p-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 active:scale-90 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Analytics</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-6 rounded-[28px]">
                        <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Total Visits</p>
                        <h2 className="text-2xl font-black text-blue-600">1,240</h2>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-[28px]">
                        <p className="text-[10px] font-bold text-purple-500 uppercase mb-2">Conversion</p>
                        <h2 className="text-2xl font-black text-purple-600">8.4%</h2>
                    </div>
                </div>
            </div>

            {!isPro && (
                <div className="absolute inset-0 top-[200px] z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm pb-24 text-center px-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-2xl text-center max-w-sm border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Feature</h3>
                        <p className="text-gray-500 text-sm mb-8 font-medium">Upgrade to Pro to unlock deep insights and advanced analytics for your store.</p>
                        <button
                            onClick={() => router.push('/billing')}
                            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            )}

            <div className={`p-6 space-y-6 ${!isPro ? 'opacity-20 pointer-events-none' : ''}`}>
                {/* Performance Chart Placeholder */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Weekly Sales</h3>
                        <div className="bg-green-50 text-[#25D366] px-3 py-1 rounded-full text-[10px] font-bold">
                            +12.5%
                        </div>
                    </div>
                    <div className="h-40 flex items-end gap-2 px-2">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-gray-50 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-[#25D366] rounded-t-lg transition-all duration-500 group-hover:bg-[#128C7E]"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                            <span key={d} className="text-[10px] font-bold text-gray-300">{d}</span>
                        ))}
                    </div>
                </div>

                {/* Deep Insights */}
                <div className="space-y-4">
                    <div className="premium-card !p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Top Product</p>
                            <p className="text-xs text-gray-400">Nasi Lemak Ayam (42 sales)</p>
                        </div>
                    </div>
                    <div className="premium-card !p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-[#25D366] rounded-2xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Repeat Customers</p>
                            <p className="text-xs text-gray-400">18% growth this month</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
