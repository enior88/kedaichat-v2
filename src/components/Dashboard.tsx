'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Search, ShoppingBag, Users, Package,
    TrendingUp, Share2, ChevronRight, Rocket,
    Store, Settings, Plus, Archive, ShieldCheck, LogOut, MessageCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [stats, setStats] = useState(() => {
        // Instant restoration from simple global cache
        if (typeof window !== 'undefined' && (window as any).kd_stats_cache) {
            return (window as any).kd_stats_cache;
        }
        return {
            businessName: 'Loading...',
            revenueToday: 0,
            totalOrders: 0,
            totalProducts: 0,
            slug: '',
            plan: 'FREE',
            isAdmin: false,
            archived: false
        };
    });
    const [showToast, setShowToast] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login'; // Redirect regular user to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch(`/api/dashboard?t=${Date.now()}`);
                const data = await res.json();

                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                if (res.status === 404 && data.error === 'Store not found') {
                    window.location.href = '/onboarding';
                    return;
                }

                if (!data.error) {
                    setStats(data);
                    // Update the global cache for instant restoration next time
                    if (typeof window !== 'undefined') {
                        (window as any).kd_stats_cache = data;
                    }
                } else {
                    console.error('Dashboard error:', data.error);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            }
        };
        fetchDashboard();
    }, []);

    const handleAction = (action: string) => {
        if (action === 'Add Product') {
            router.push('/products?action=add');
        } else if (action === 'Share Link') {
            const url = `${window.location.origin}/shop/${stats.slug}`;

            const copyToClipboard = async () => {
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(url);
                    } else {
                        // Fallback for insecure contexts (HTTP)
                        const textArea = document.createElement("textarea");
                        textArea.value = url;
                        textArea.style.position = "fixed";
                        textArea.style.left = "-999999px";
                        textArea.style.top = "-999999px";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                    }
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                } catch (err) {
                    console.error('Copy failed', err);
                }
            };

            if (!stats.slug) return;

            // Detect mobile for a better UX (native share is mostly useful on mobile)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile && navigator.share) {
                navigator.share({
                    title: stats.businessName,
                    text: `Check out my store on KedaiChat!`,
                    url: url,
                }).catch(() => {
                    // Fallback to clipboard if system share fails
                    copyToClipboard();
                });
            } else {
                // Default to clipboard on desktop for maximum reliability
                copyToClipboard();
            }
        } else if (action === 'Analytics') {
            router.push('/analytics');
        } else if (action === 'WhatsApp Status' || action === 'Status WhatsApp') {
            const url = `${window.location.origin}/shop/${stats.slug}`;

            const text = encodeURIComponent(`Check out my store on KedaiChat! 🛍️\n\n${url}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Archived Store Overlay */}
            {stats.archived && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="max-w-xs">
                        <div className="w-20 h-20 bg-orange-100 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-xl shadow-orange-100">
                            <Archive size={40} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Store Archived</h2>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">Your store has been archived by the administrator. It's currently hidden from customers.</p>
                        <button
                            onClick={() => window.location.href = 'https://wa.me/60123456789'}
                            className="w-full bg-[#25D366] text-white py-4 rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-green-200 active:scale-95 transition-all"
                        >
                            Contact Admin
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-[40px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{stats.businessName}</h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Store Live • kedaichat.online/shop/{stats.slug}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 p-3 rounded-2xl hover:bg-red-100 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={20} className="text-red-500" />
                        </button>
                        <button
                            onClick={() => router.push('/settings')}
                            className="bg-gray-100 p-3 rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            <Settings size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#25D366] rounded-[28px] p-6 text-white shadow-lg shadow-green-100 flex flex-col justify-between">
                        <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase opacity-80 mb-1">{t('revenue')}</p>
                            <h2 className="text-2xl font-black tracking-tighter">RM {stats.revenueToday.toFixed(2)}</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-50 flex flex-col justify-between">
                        <div className="bg-orange-50 text-orange-500 w-8 h-8 rounded-xl flex items-center justify-center mb-4">
                            <BarChart3 size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('total_orders')}</p>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{stats.totalOrders}</h2>
                        </div>
                    </div>
                </div>

                {/* Free Tier Usage Bar */}
                {stats.plan === 'FREE' && !stats.isAdmin && (
                    <div className="mt-6 bg-white rounded-[24px] p-5 shadow-sm border border-gray-50">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Free Plan Limits</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{stats.totalOrders} / 30 Orders Used</p>
                            </div>
                            <span className="text-[10px] font-black text-[#25D366] bg-green-50 px-2 py-1 rounded-full">{Math.round((stats.totalOrders / 30) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${stats.totalOrders >= 30 ? 'bg-red-500' : 'bg-[#25D366]'}`}
                                style={{ width: `${Math.min((stats.totalOrders / 30) * 100, 100)}%` }}
                            />
                        </div>
                        {stats.totalOrders >= 30 && (
                            <p className="text-xs text-red-500 font-medium mt-3">You've reached your monthly limit. Upgrade to continue receiving orders.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 space-y-6">
                {/* Quick Actions */}
                <section>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1 mb-4">{t('quick_actions')}</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { name: t('add_product'), icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { name: t('share_link'), icon: Share2, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { name: t('share_status'), icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
                            { name: t('analytics'), icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map(action => (
                            <button
                                key={action.name}
                                className="flex flex-col items-center gap-3 active:scale-95 transition-all"
                                onClick={() => handleAction(action.name)}
                            >
                                <div className={`${action.bg} ${action.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm`}>
                                    <action.icon size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 text-center uppercase leading-tight">{action.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-4 z-[60]">
                        Link copied to clipboard! 📋
                    </div>
                )}

                {/* Pro Upgrade or Admin Badge */}
                <div className={`${stats.isAdmin ? 'bg-[#25D366]' : 'bg-gray-900'} rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl`}>
                    <div className="relative z-10">
                        {stats.isAdmin ? (
                            <>
                                <h3 className="text-xl font-bold mb-2">Platform Master.</h3>
                                <p className="text-white/80 text-xs mb-6 max-w-[180px] leading-relaxed">You have full administrative access to manage all stores and platform settings.</p>
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="bg-white text-[#25D366] px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all"
                                >
                                    Admin Console <ShieldCheck size={14} />
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-2">Build your empire.</h3>
                                <p className="text-gray-400 text-xs mb-6 max-w-[180px] leading-relaxed">Unlock Resellers and Group orders to grow 10x.</p>
                                <button
                                    onClick={() => router.push('/billing')}
                                    className="bg-[#25D366] px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all"
                                >
                                    Go Pro <Rocket size={14} />
                                </button>
                            </>
                        )}
                    </div>
                    {stats.isAdmin ? (
                        <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
                    ) : (
                        <Store className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
                    )}
                </div>

                {/* Recent Orders List placeholder */}
                <section>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{t('recent_orders')}</h3>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Users size={18} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Customer #{i + 100}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">RM {(12 * i).toFixed(2)} • 2 mins ago</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 text-[#25D366] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                                    {t('paid')}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>


        </div>
    );
}
