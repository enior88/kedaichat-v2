'use client';

import React, { useState } from 'react';
import BottomNav from './BottomNav';
import { mockOrders } from '@/data/mockData';
import { ChevronRight } from 'lucide-react';

export default function OrdersManagement() {
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
                    <div className="text-center py-10 text-gray-400">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No {activeTab.toLowerCase()} orders.</div>
                ) : filteredOrders.map((order) => (
                    <div key={order.id} className="premium-card !p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Order {order.id.slice(0, 6)}</h3>
                                <p className="text-xs text-gray-400 font-medium">{order.customerName || 'Customer'} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-gray-900 leading-tight">RM {order.total.toFixed(2)}</p>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${['PAID', 'COMPLETED'].includes(order.paymentStatus) ? 'bg-green-50 text-[#25D366]' : 'bg-orange-50 text-orange-500'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {order.items && (
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    {(typeof order.items === 'string') ? order.items : 'Items list...'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'Active' && (
                            <button
                                onClick={() => handleUpdateStatus(order.id, order.paymentStatus)}
                                className="w-full py-3 border-2 border-[#25D366] text-[#25D366] font-bold rounded-2xl flex items-center justify-center gap-2 active:bg-green-50 transition-all text-sm"
                            >
                                Mark as {order.paymentStatus === 'PAID' ? 'Preparing' : order.paymentStatus === 'PREPARING' ? 'Delivering' : 'Completed'}
                                <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
