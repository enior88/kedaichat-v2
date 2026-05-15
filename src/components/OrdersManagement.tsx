'use client';

import React, { useState } from 'react';
import BottomNav from './BottomNav';
import { ChevronRight, XCircle, Search, Phone, MessageCircle, Clock, PackageCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function OrdersManagement() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Active');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['Active', 'Completed', 'Canceled'];

    // Stats for priority header
    const stats = {
        preparing: orders.filter(o => o.paymentStatus === 'PREPARING').length,
        delivering: orders.filter(o => o.paymentStatus === 'DELIVERING').length,
        unpaid: orders.filter(o => o.paymentStatus === 'UNPAID').length,
        pending: orders.filter(o => o.paymentStatus === 'PAID').length
    };

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

    const getFlowConfig = (order: any) => {
        const isAllService = order.items?.every((item: any) => item.product?.type === 'SERVICE');

        if (isAllService) {
            return {
                UNPAID: { label: 'Unpaid', next: 'Paid' },
                PAID: { label: 'Confirmed', next: 'In Progress' },
                PREPARING: { label: 'In Progress', next: 'Heading Over' },
                DELIVERING: { label: 'Heading Over', next: 'Done' },
                COMPLETED: { label: 'Done', next: 'Done' }
            };
        }
        return {
            UNPAID: { label: 'Unpaid', next: 'Paid' },
            PAID: { label: 'Paid', next: 'Preparing' },
            PREPARING: { label: 'Preparing', next: 'Delivering' },
            DELIVERING: { label: 'Delivering', next: 'Completed' },
            COMPLETED: { label: 'Completed', next: 'Completed' }
        };
    };

    const handleUpdateStatus = async (id: string, currentStatus: string, order?: any) => {
        let newStatus = 'COMPLETED';
        if (currentStatus === 'UNPAID') newStatus = 'PAID';
        else if (currentStatus === 'PAID') newStatus = 'PREPARING';
        else if (currentStatus === 'PREPARING') newStatus = 'DELIVERING';
        else if (currentStatus === 'DELIVERING') newStatus = 'COMPLETED';

        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, paymentStatus: newStatus })
            });
            if (res.ok) {
                fetchOrders();
                if (order) {
                    handleNotifyStatus(order, newStatus);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleNotifyStatus = (order: any, status: string) => {
        const phone = order.customerPhone || '';
        if (!phone) return;

        const config = getFlowConfig(order);
        const statusLabel = config[status as keyof ReturnType<typeof getFlowConfig>]?.label || status;
        const storeName = order.store?.name || 'KedaiChat Store';
        const orderId = order.id.slice(-6).toUpperCase();

        let message = '';
        if (status === 'PREPARING') {
            const action = order.items?.every((item: any) => item.product?.type === 'SERVICE') ? 'now in progress' : 'being prepared';
            message = `Hi ${order.customerName}! 👨‍💻 Your order #${orderId} from ${storeName} is ${action}. We'll notify you when it's ready!`;
        } else if (status === 'DELIVERING') {
            const deliveryMsg = order.items?.every((item: any) => item.product?.type === 'SERVICE') ? 'Our team is heading over to you now!' : 'is on its way to you!';
            message = `Hi ${order.customerName}! 🚀 Great news! Your order #${orderId} from ${storeName} ${deliveryMsg} RM ${order.total.toFixed(2)} total.`;
        } else if (status === 'COMPLETED') {
            message = `Hi ${order.customerName}! ✅ Your order #${orderId} from ${storeName} has been completed. Thank you for your support! Don't forget to order again.`;
        }

        if (message) {
            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesTab = (activeTab === 'Active' && ['UNPAID', 'PAID', 'PREPARING', 'DELIVERING'].includes(o.paymentStatus)) ||
            (activeTab === 'Completed' && o.paymentStatus === 'COMPLETED') ||
            (activeTab === 'Canceled' && o.paymentStatus === 'CANCELED');

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            (o.customerName?.toLowerCase().includes(searchLower)) ||
            (o.customerPhone?.includes(searchQuery)) ||
            (o.id.toLowerCase().includes(searchLower)) ||
            (o.items?.some((i: any) => i.product?.name.toLowerCase().includes(searchLower)));

        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Header & Tabs */}
            <div className="bg-white px-6 pt-6 shadow-sm sticky top-0 z-30">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <div className="flex gap-2">
                        {stats.unpaid > 0 && (
                            <div className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse border border-orange-100">
                                <Clock size={12} /> {stats.unpaid} Unverified
                            </div>
                        )}
                        {stats.pending > 0 && (
                            <div className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-100">
                                <Clock size={12} /> {stats.pending} New Paid
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Preparing</p>
                            <p className="text-lg font-black text-gray-900 leading-tight">{stats.preparing}</p>
                        </div>
                    </div>
                    <div className="bg-green-50/50 p-3 rounded-2xl border border-green-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-[#25D366]">
                            <Truck size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#25D366] uppercase tracking-widest">Delivering</p>
                            <p className="text-lg font-black text-gray-900 leading-tight">{stats.delivering}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name, ID, or items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#25D366]/20 transition-all placeholder:text-gray-400"
                    />
                </div>

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
                ) : (
                    filteredOrders.map((order) => (
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
                                    <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                        {order.customerName || 'Customer'}
                                        {order.customerPhone && (
                                            <div className="flex gap-2">
                                                <a href={`tel:${order.customerPhone}`} className="text-blue-500 hover:scale-110 transition-transform">
                                                    <Phone size={14} />
                                                </a>
                                                <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" className="text-[#25D366] hover:scale-110 transition-transform">
                                                    <MessageCircle size={14} />
                                                </a>
                                            </div>
                                        )}
                                        • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${['PAID', 'COMPLETED', 'PREPARING', 'DELIVERING'].includes(order.paymentStatus) ? 'bg-green-50 text-[#25D366]' : 'bg-orange-50 text-orange-500'
                                    }`}>
                                    {getFlowConfig(order)[order.paymentStatus as keyof ReturnType<typeof getFlowConfig>]?.label || order.paymentStatus}
                                </span>
                            </div>

                            {/* Status Progress Bar */}
                            <div className="mb-6 px-1">
                                <div className="flex justify-between items-center relative">
                                    <div className="absolute h-0.5 bg-gray-100 left-0 right-0 top-1/2 -translate-y-1/2 z-0"></div>
                                    <div
                                        className="absolute h-0.5 bg-[#25D366] left-0 top-1/2 -translate-y-1/2 z-0 transition-all duration-1000"
                                        style={{
                                            width: order.paymentStatus === 'PAID' ? '0%' :
                                                order.paymentStatus === 'PREPARING' ? '33%' :
                                                    order.paymentStatus === 'DELIVERING' ? '66%' : '100%'
                                        }}
                                    ></div>

                                    {[
                                        { status: 'UNPAID', icon: Clock, label: getFlowConfig(order)['UNPAID'].label },
                                        { status: 'PAID', icon: CheckCircle2, label: getFlowConfig(order)['PAID'].label },
                                        { status: 'PREPARING', icon: PackageCheck, label: getFlowConfig(order)['PREPARING'].label },
                                        { status: 'DELIVERING', icon: Truck, label: getFlowConfig(order)['DELIVERING'].label },
                                        { status: 'COMPLETED', icon: CheckCircle2, label: getFlowConfig(order)['COMPLETED'].label }
                                    ].map((step, idx) => {
                                        const isPast = ['UNPAID', 'PAID', 'PREPARING', 'DELIVERING', 'COMPLETED'].indexOf(order.paymentStatus) >= idx;

                                        return (
                                            <div key={step.status} className="relative z-10 flex flex-col items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isPast ? 'bg-[#25D366] border-[#25D366] text-white shadow-lg shadow-green-100' : 'bg-white border-gray-100 text-gray-300'}`}>
                                                    <step.icon size={12} strokeWidth={3} />
                                                </div>
                                                <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 transition-colors ${isPast ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                                            </div>
                                        );
                                    })}
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
                                        onClick={() => handleUpdateStatus(order.id, order.paymentStatus, order)}
                                        className="flex-1 py-3 bg-[#25D366] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm shadow-lg shadow-green-100"
                                    >
                                        Mark as {getFlowConfig(order)[order.paymentStatus as keyof ReturnType<typeof getFlowConfig>]?.next || 'Next'}
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
                    ))
                )}
            </div>
            <BottomNav />
        </div>
    );
}
