'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Loader2, Users, ShoppingBag, Plus, Minus, ArrowLeft,
    Send, Share2, Trash2, CheckCircle2, MessageSquare, ExternalLink,
    Clock, Smartphone
} from 'lucide-react';

export default function GroupOrderHostPage() {
    const params = useParams();
    const router = useRouter();
    const inviteCode = params?.inviteCode as string;

    const [sessionData, setSessionData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    useEffect(() => {
        if (!inviteCode) return;

        // Simple security: Check if this user is the host
        const isHost = localStorage.getItem(`host_${inviteCode}`);
        if (!isHost) {
            router.push(`/group/${inviteCode}`);
            return;
        }

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [inviteCode]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/group-orders/${inviteCode}`);
            const data = await res.json();
            if (!data.error) setSessionData(data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/group/${inviteCode}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join our Group Order: ${sessionData?.title}`,
                    text: `Hey! I'm hosting a group order at ${sessionData?.store?.businessName}. Use this link to add your items!`,
                    url
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            await navigator.clipboard.writeText(url);
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2000);
        }
    };

    const handleSendToWhatsApp = () => {
        if (!sessionData) return;

        const { store, items, title } = sessionData;
        const participantOrders = items.reduce((acc: any, item: any) => {
            if (!acc[item.participantName]) acc[item.participantName] = [];
            acc[item.participantName].push(item);
            return acc;
        }, {});

        const productCounts = items.reduce((acc: any, item: any) => {
            if (!acc[item.product.name]) acc[item.product.name] = 0;
            acc[item.product.name] += item.quantity;
            return acc;
        }, {});

        let message = `*GROUP ORDER: ${title}*\n`;
        message += `Store: ${store.name || 'KedaiChat'}\n\n`;

        message += `*--- CONSOLIDATED ITEMS ---*\n`;
        Object.entries(productCounts).forEach(([name, qty]) => {
            message += `- ${name} x${qty}\n`;
        });

        message += `\n*--- PARTICIPANT BREAKDOWN ---*\n`;
        Object.entries(participantOrders).forEach(([name, userItems]: [string, any]) => {
            message += `_👤 ${name}:_\n`;
            userItems.forEach((item: any) => {
                message += `  • ${item.product.name} x${item.quantity}\n`;
            });
            message += `\n`;
        });

        const totalPrice = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        message += `*Total Amount: RM ${totalPrice.toFixed(2)}*`;

        const waUrl = `https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#25D366]" size={32} />
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black text-gray-900 mb-2">Session Not Found</h1>
                <p className="text-gray-500 font-medium">Please check the link and try again.</p>
            </div>
        );
    }

    const { store, items } = sessionData;
    const totalItems = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const participantCount = new Set(items.map((i: any) => i.participantName)).size;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-40 font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-8 shadow-sm rounded-b-[40px]">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => router.push(`/shop/${store.slug}`)} className="text-gray-900 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Group Host Mode
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-green-100 shrink-0">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{sessionData.title}</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{store.businessName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-[28px] p-5 flex flex-col justify-between border border-green-100">
                        <p className="text-[10px] font-bold text-[#25D366] uppercase mb-1">Participants</p>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{participantCount}</h2>
                    </div>
                    <div className="bg-gray-50 rounded-[28px] p-5 flex flex-col justify-between border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Items</p>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{totalItems}</h2>
                    </div>
                </div>
            </div>

            {/* Link Sharing Card */}
            <div className="p-6">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Invite Others</h3>
                        <p className="text-sm font-bold text-gray-900 mb-4 truncate bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {window.location.origin}/group/{inviteCode}
                        </p>
                        <button
                            onClick={handleShare}
                            className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Share2 size={18} />
                            {showCopySuccess ? 'Copied!' : 'Share Invite Link'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Participants Orders */}
            <div className="p-6 pt-0 space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1">Orders in Pool</h3>

                {items.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Clock size={24} />
                        </div>
                        <p className="text-gray-400 text-sm font-bold">Waiting for friends to join...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Array.from(new Set(items.map((i: any) => i.participantName))).map((pName: any) => (
                            <div key={pName} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-[#25D366]">
                                            <span className="font-black">{(pName as string)[0]?.toUpperCase()}</span>
                                        </div>
                                        <h4 className="font-black text-gray-900">{pName}</h4>
                                    </div>
                                    <span className="bg-green-100 text-[#25D366] text-[10px] font-black px-2 py-1 rounded-lg uppercase">Sent</span>
                                </div>
                                <div className="space-y-2">
                                    {items.filter((i: any) => i.participantName === pName).map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-500">{item.product.name} x{item.quantity}</span>
                                            <span className="text-gray-900">RM {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Action Footer */}
            {items.length > 0 && (
                <div className="fixed bottom-8 left-6 right-6 bg-white rounded-[40px] p-3 shadow-2xl border border-gray-100 flex items-center justify-between z-50 animate-in slide-in-from-bottom-10">
                    <div className="pl-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Pool</p>
                        <h2 className="text-xl font-black text-gray-900 leading-none">RM {totalPrice.toFixed(2)}</h2>
                    </div>
                    <button
                        onClick={handleSendToWhatsApp}
                        className="bg-[#25D366] text-white h-16 px-8 rounded-[32px] font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-green-100"
                    >
                        Send to Seller <MessageSquare size={20} className="fill-white" />
                    </button>
                </div>
            )}
        </div>
    );
}
