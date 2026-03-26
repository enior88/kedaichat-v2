'use client';

import React from 'react';
import { ChevronLeft, RotateCcw, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';
import BottomNav from './BottomNav';

export default function CustomerWallet() {
    const { t } = useLanguage();
    const router = useRouter();
    const [orders, setOrders] = React.useState<any[]>([]);
    const [lastStore, setLastStore] = React.useState<any>(null);

    React.useEffect(() => {
        const saved = localStorage.getItem('kd_my_orders');
        if (saved) {
            const parsedOrders = JSON.parse(saved).reverse();
            setOrders(parsedOrders);

            // Extract store info from the most recent order
            if (parsedOrders.length > 0) {
                const recent = parsedOrders[0];
                const slug = recent.storeSlug || '';
                setLastStore({
                    name: recent.storeName || 'KedaiChat Store',
                    slug: slug,
                    plan: 'FREE' // Default
                });

                // Fetch current plan for the store
                if (slug) {
                    fetch(`/api/store?slug=${slug}`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.error) {
                                setLastStore((prev: any) => ({
                                    ...prev,
                                    plan: data.subscription?.plan?.toUpperCase() || 'FREE'
                                }));
                            }
                        })
                        .catch(console.error);
                }
            }
        }
    }, []);

    const handleOrderAgain = () => {
        if (lastStore?.slug) {
            router.push(`/shop/${lastStore.slug}`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Header */}
            <div className="p-6 bg-white flex items-center gap-4 shadow-sm">
                <button onClick={() => router.back()} className="text-gray-400 active:scale-95 transition-all">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white font-black shadow-md shadow-green-100">
                        {(lastStore?.name?.[0] || 'K').toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 leading-tight">{lastStore?.name || 'KedaiChat Wallet'}</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('customer_account') || 'Customer Account'}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-lg mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6">{t('your_orders') || 'Your Orders'}</h2>

                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="text-gray-300" size={32} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">{t('no_orders_yet') || 'No orders yet.'}</p>
                            <button
                                onClick={() => router.push('/')}
                                className="mt-4 text-[#25D366] text-sm font-bold hover:underline"
                            >
                                {t('browse_shops') || 'Browse Shops'}
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-50 hover:border-[#25D366]/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest mb-1">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                        <p className="text-lg font-black text-gray-900">RM {order.total?.toFixed(2)}</p>
                                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-black px-3 py-1 bg-green-50 text-[#25D366] rounded-full uppercase tracking-widest">
                                            {order.paymentStatus || 'PAID'}
                                        </span>
                                    </div>
                                </div>

                                <div className="py-3 border-t border-gray-50 mb-4">
                                    <p className="text-xs text-gray-600 truncate opacity-80 italic font-medium">
                                        From: {order.storeName || 'Unknown Store'}
                                    </p>
                                </div>

                                {lastStore?.plan !== 'FREE' && (
                                    <button
                                        onClick={() => router.push(`/shop/${order.storeSlug}`)}
                                        className="w-full h-12 bg-[#25D366]/10 text-[#25D366] font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase"
                                    >
                                        <RotateCcw size={16} />
                                        {t('repeat_order') || 'Order Again'}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            {lastStore?.slug && lastStore?.plan !== 'FREE' && (
                <div className="fixed bottom-10 left-6 right-6 max-w-md mx-auto z-40">
                    <button
                        onClick={handleOrderAgain}
                        className="w-full h-14 bg-gray-900 text-white font-bold rounded-[24px] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all border-4 border-white/10"
                    >
                        <ShoppingBag size={20} />
                        {t('order_again') || 'Order Again from Store'}
                    </button>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
