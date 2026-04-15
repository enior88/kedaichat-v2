'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Users, ShoppingBag, Plus, Minus, ArrowLeft, Send, Clock } from 'lucide-react';

export default function GroupOrderParticipantPage() {
    const params = useParams();
    const router = useRouter();
    const inviteCode = params?.inviteCode as string;

    const [sessionData, setSessionData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [participantName, setParticipantName] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (!inviteCode) return;

        fetch(`/api/group-orders/${inviteCode}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setSessionData(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [inviteCode]);

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
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <Users className="text-gray-400" size={32} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Session Not Found</h1>
                <p className="text-gray-500 font-medium">This group order might have ended or the link is invalid.</p>
            </div>
        );
    }

    const { store } = sessionData;
    const products = store?.products || [];

    // Stage 1: Join
    if (!hasJoined) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] p-6 flex flex-col justify-center max-w-md mx-auto">
                <div className="bg-white rounded-[32px] p-8 shadow-xl text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto text-[#25D366]">
                        <Users size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Join {sessionData.title}</h1>
                    <p className="text-gray-400 font-medium text-sm mb-8">
                        Hosted by {store.businessName}.<br />
                        Deadline: {new Date(sessionData.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="text-left mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Your Name</label>
                        <input
                            type="text"
                            className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-6 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
                            placeholder="e.g. John from HR"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={!participantName.trim()}
                        onClick={() => setHasJoined(true)}
                        className="w-full h-14 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all text-sm uppercase tracking-wider disabled:opacity-50"
                    >
                        Join & View Menu
                    </button>
                </div>
            </div>
        );
    }

    // Stage 3: Complete
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] p-6 flex flex-col justify-center text-center">
                <div className="w-28 h-28 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200">
                    <Send className="text-white w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Submitted!</h1>
                <p className="text-gray-500 font-medium mb-10 max-w-[280px] mx-auto text-sm leading-relaxed">
                    Your items have been safely passed to the host's pool. You can close this window.
                </p>
            </div>
        );
    }

    // Handlers
    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.id !== productId);
        });
    };

    const getQuantity = (productId: string) => cart.find(item => item.id === productId)?.quantity || 0;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const res = await fetch(`/api/group-orders/${inviteCode}`, {
            method: 'POST',
            body: JSON.stringify({
                participantName,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
        });

        if (res.ok) setIsSubmitted(true);
        setIsSubmitting(false);
    };

    // Stage 2: Selection
    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            <div className="bg-white px-6 py-6 shadow-sm sticky top-0 z-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-[#25D366]">
                            <span className="font-black">{participantName[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-gray-900 tracking-tight">{sessionData.title}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">{store.businessName}</p>
                        </div>
                    </div>
                    {typeof window !== 'undefined' && localStorage.getItem(`host_${inviteCode}`) && (
                        <button
                            onClick={() => router.push(`/group/${inviteCode}/host`)}
                            className="bg-gray-900 text-white p-2 rounded-xl"
                            title="Manage Session"
                        >
                            <Users size={18} />
                        </button>
                    )}
                </div>
                {/* Notice Banner */}
                <div className="bg-gray-900 rounded-2xl p-3.5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#25D366]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Deadline</span>
                    </div>
                    <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-lg">
                        {new Date(sessionData.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4">Menu Items</h3>
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product: any) => (
                        <div key={product.id} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-3 overflow-hidden relative">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200" size={24} />
                                )}
                            </div>
                            <div className="flex-1 flex flex-col">
                                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{product.name}</h4>
                                <p className="text-[#25D366] font-black text-xs mt-auto mb-3">RM {product.price.toFixed(2)}</p>

                                {getQuantity(product.id) === 0 ? (
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full h-9 bg-gray-50 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all"
                                    >
                                        Add
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-between bg-gray-900 p-1 rounded-xl">
                                        <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 bg-white/10 text-white rounded-lg flex items-center justify-center hover:bg-white/20"><Minus size={14} /></button>
                                        <span className="text-white font-black text-xs">{getQuantity(product.id)}</span>
                                        <button onClick={() => addToCart(product)} className="w-7 h-7 bg-white text-gray-900 rounded-lg flex items-center justify-center"><Plus size={14} /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Checkout Bar */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 left-6 right-6 bg-gray-900 rounded-3xl p-2 shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-8">
                    <div className="pl-4">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Your Total</p>
                        <p className="text-white font-black text-lg leading-none">RM {totalPrice.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#25D366] text-white h-12 px-6 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wide disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'Pass to Host'}
                        {!isSubmitting && <Send size={16} />}
                    </button>
                </div>
            )}
        </div>
    );
}
