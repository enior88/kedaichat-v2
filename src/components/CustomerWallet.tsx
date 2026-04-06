'use client';

import React from 'react';
import { ChevronLeft, RotateCcw, ShoppingBag, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter } from 'next/navigation';
import BottomNav from './BottomNav';

export default function CustomerWallet() {
    const { t } = useLanguage();
    const router = useRouter();
    const [orders, setOrders] = React.useState<any[]>([]);
    const [lastStore, setLastStore] = React.useState<any>(null);
    const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);

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

    const handleRepeatOrder = (order: any) => {
        if (!order.items || !order.whatsappNumber) {
            // Fallback to store front if no items/number (old orders)
            if (order.storeSlug) {
                router.push(`/shop/${order.storeSlug}`);
            }
            return;
        }

        // Generate WhatsApp Message
        let text = `*Repeat Order - Previous Order #${order.id.slice(-8).toUpperCase()}*\n\n`;
        text += `Total: *RM ${order.total?.toFixed(2)}*\n\n`;
        text += `*Items:*\n`;
        order.items.forEach((item: any) => {
            text += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
        });
        text += `\n_I would like to repeat my previous order. Please verify._`;

        const encodedText = encodeURIComponent(text);
        const phone = order.whatsappNumber.replace(/\D/g, '') || '';
        const link = `https://wa.me/${phone}?text=${encodedText}`;

        window.open(link, '_blank');
    };

    const handleEditOrder = (order: any) => {
        if (!order.items || !order.storeSlug) return;

        // Pre-fill the cart with previous order items
        const newCart = {
            storeId: order.storeId,
            storeName: order.storeName,
            storeSlug: order.storeSlug,
            whatsappNumber: order.whatsappNumber,
            items: order.items
        };

        localStorage.setItem('kd_cart', JSON.stringify(newCart));
        router.push(`/shop/${order.storeSlug}`);
    };

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
                                <div
                                    className="flex justify-between items-start mb-4 cursor-pointer"
                                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                            <ChevronDown size={12} className={`transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180 text-[#25D366]' : ''}`} />
                                        </h3>
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

                                {expandedOrderId === order.id && order.items && order.items.length > 0 && (
                                    <div className="mb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Items</p>
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                <span className="text-gray-600 font-medium">
                                                    <span className="text-gray-900 font-bold">{item.quantity}x</span> {item.name}
                                                </span>
                                                <span className="text-gray-400">RM {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="py-3 border-t border-gray-50 mb-4">
                                    <p className="text-xs text-gray-600 truncate opacity-80 italic font-medium">
                                        From: {order.storeName || 'Unknown Store'}
                                    </p>
                                </div>

                                {lastStore?.plan !== 'FREE' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRepeatOrder(order)}
                                            className="flex-1 h-12 bg-[#25D366] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[10px] uppercase tracking-wider"
                                        >
                                            <RotateCcw size={14} />
                                            {t('repeat_order') || 'Repeat Order'}
                                        </button>
                                        <button
                                            onClick={() => handleEditOrder(order)}
                                            className="flex-1 h-12 bg-gray-50 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[10px] uppercase tracking-wider border border-gray-100"
                                        >
                                            {t('edit_order') || 'Edit Order'}
                                        </button>
                                    </div>
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
