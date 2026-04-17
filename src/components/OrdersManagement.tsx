'use client';

import React, { useState } from 'react';
import BottomNav from './BottomNav';
import { ChevronRight, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function OrdersManagement() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Active');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const tabs = ['Active', 'Completed', 'Canceled'];

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, currentStatus: string) => {
        let newStatus = 'COMPLETED';
        if (currentStatus === 'PAID') newStatus = 'PREPARING';
        else if (currentStatus === 'PREPARING') newStatus = 'DELIVERING';
        else if (currentStatus === 'DELIVERING') newStatus = 'COMPLETED';

        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, paymentStatus: newStatus })
            });
            if (res.ok) fetchOrders();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredOrders = orders.filter(o =>
        (activeTab === 'Active' && ['PAID', 'PREPARING', 'DELIVERING'].includes(o.paymentStatus)) ||
        (activeTab === 'Completed' && o.paymentStatus === 'COMPLETED') ||
        (activeTab === 'Canceled' && o.paymentStatus === 'CANCELED')
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Header & Tabs */}
            <div className="bg-white px-6 pt-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#25D366]' : 'text-gray-400'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#25D366] rounded-t-full shadow-lg shadow-green-100"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="premium-card !p-4 animate-pulse">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-100 rounded-md w-3/4"></div>
                                        <div className="h-3 bg-gray-50 rounded-md w-1/2"></div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="h-6 bg-gray-100 rounded-md w-16 ml-auto"></div>
                                        <div className="h-4 bg-gray-50 rounded-md w-12 ml-auto"></div>
                                    </div>
                                </div>
                                <div className="h-20 bg-gray-50 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No {activeTab.toLowerCase()} orders.</div>
                ) : filteredOrders.map((order) => (
                    <div key={order.id} className="premium-card !p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                                        {order.items && order.items.length > 0
                                            ? `${order.items[0].product?.name || 'Item'} x${order.items[0].quantity}${order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}`
                                            : `Order ${order.id.slice(0, 6)}`}
                                    </h3>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${order.deliveryType === 'DELIVERY' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-gray-100 text-gray-500'}`}>
                                        {order.deliveryType === 'DELIVERY' ? '🚚 Delivery' : '🏪 Pickup'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{order.customerName || 'Customer'} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-gray-900 leading-tight">RM {order.total.toFixed(2)}</p>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${['PAID', 'COMPLETED', 'PREPARING', 'DELIVERING'].includes(order.paymentStatus) ? 'bg-green-50 text-[#25D366]' : 'bg-orange-50 text-orange-500'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (
                            <div className="mb-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                <p className="text-xs font-bold text-gray-700 leading-relaxed">{order.deliveryAddress}</p>
                            </div>
                        )}

                        {order.items && order.items.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-600 italic">
                                            {item.product?.name} x{item.quantity}
                                        </span>
                                        <span className="text-gray-400">
                                            RM {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                {order.notes && (
                                    <div className="mt-2 pt-2 border-t border-gray-100 italic text-gray-500">
                                        "{order.notes}"
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Active' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus(order.id, order.paymentStatus)}
                                    className="flex-1 py-3 border-2 border-[#25D366] text-[#25D366] font-bold rounded-2xl flex items-center justify-center gap-2 active:bg-green-50 transition-all text-sm"
                                >
                                    Mark as {order.paymentStatus === 'PAID' ? 'Preparing' : order.paymentStatus === 'PREPARING' ? 'Delivering' : 'Completed'}
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm('Are you sure you want to cancel this order?')) {
                                            try {
                                                const res = await fetch('/api/orders', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: order.id, paymentStatus: 'CANCELED' })
                                                });
                                                if (res.ok) fetchOrders();
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        }
                                    }}
                                    className="p-3 border-2 border-red-100 text-red-500 rounded-2xl flex items-center justify-center active:bg-red-50 transition-all"
                                    title={t('cancel_order')}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>


        </div>
    );
}
