'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search, ShoppingCart, Store, ChevronLeft, ChevronRight, Share2, Check, Users, Clock, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function StoreCatalog({ slug, initialStoreData }: { slug?: string, initialStoreData?: any }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [store, setStore] = useState<any>(initialStoreData || null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cartItems, setCartItems] = useState<{ id: string, name: string, price: number, quantity: number }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupTitle, setGroupTitle] = useState('');
    const [groupDeadline, setGroupDeadline] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(!initialStoreData);

    const categories = [
        { id: 'All', label: t('cat_all') },
        { id: 'Rice Items', label: t('cat_rice') },
        { id: 'Noodles', label: t('cat_noodles') },
        { id: 'Drinks', label: t('cat_drinks') },
        { id: 'Desserts', label: t('cat_desserts') },
        { id: 'Others', label: t('cat_others') }
    ];

    const defaultCategoryIds = ['All', 'Rice Items', 'Noodles', 'Drinks', 'Desserts', 'Snacks', 'Add-ons', 'Others'];
    const customCategories = store?.products
        ? Array.from(new Set(store.products.flatMap((p: any) => p.category ? p.category.split(',').filter(Boolean) : []).filter((c: any) => c && !defaultCategoryIds.includes(c))))
        : [];

    const allCategories = [
        ...categories,
        ...customCategories.map(c => ({ id: c as string, label: c as string }))
    ];

    useEffect(() => {
        if (slug && !initialStoreData) {
            setIsLoadingData(true);
            fetch(`/api/store?slug=${slug}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setStore(data);
                })
                .catch(console.error)
                .finally(() => setIsLoadingData(false));
        }

        // Capture ?ref= referral code from URL and persist it
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        if (refCode) {
            localStorage.setItem('kd_ref', refCode);
        }
    }, [slug, initialStoreData]);

    const addToCart = (product: any) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        const refCode = localStorage.getItem('kd_ref');
        localStorage.setItem('kd_cart', JSON.stringify({
            items: cartItems,
            storeId: store.id,
            whatsappNumber: store.whatsappNumber,
            storeName: store.name,
            paymentQrUrl: store.paymentQrUrl,
            refCode: refCode || null
        }));
        router.push(`/shop/${slug || store.slug}/checkout`);
    };

    const handleCreateGroupOrder = async () => {
        if (!groupTitle || !groupDeadline) return;
        setIsCreatingGroup(true);

        try {
            const hostToken = Math.random().toString(36).substring(2);
            const res = await fetch('/api/group-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: groupTitle,
                    deadline: groupDeadline,
                    pickupTime: 'TBD',
                    storeId: store.id,
                    hostToken
                })
            });

            const data = await res.json();
            if (!data.error) {
                // Save host status locally
                localStorage.setItem(`host_${data.inviteCode}`, hostToken);
                router.push(`/group/${data.inviteCode}/host`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreatingGroup(false);
        }
    };

    const storeName = store?.name || 'My Store';
    const storeInitials = storeName[0];

    const handleShare = async () => {
        const shareData = {
            title: storeName,
            text: `Check out ${storeName} on KedaiChat!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Store link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter relative max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Loading State */}
            {isLoadingData && (
                <div className="fixed inset-0 z-[110] bg-[#F8F9FA] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mb-8 shadow-sm"></div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight flex items-center justify-center gap-2">Rilek Dolok ! <span className="inline-block animate-bounce">😁</span></h2>
                    <div className="h-1 w-12 bg-[#25D366] rounded-full animate-pulse mb-6 mx-auto"></div>
                    <div className="h-3 w-48 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
            )}

            {/* Archived Store Overlay */}
            {store?.archived && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-12 text-center animate-in fade-in duration-500">
                    <div className="max-w-xs">
                        <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-gray-300 shadow-sm border border-gray-100">
                            <Store size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Shop Closed</h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-10">This store is temporarily unavailable. Please check back later or contact the owner.</p>
                        <div className="h-1.5 w-12 bg-gray-100 rounded-full mx-auto" />
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-[#F8F9FA] p-6 pb-2">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => router.back()} className="text-gray-900 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <ChevronLeft size={24} />
                    </button>

                    {isSearching ? (
                        <div className="flex-1 px-3">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-[#25D366] transition-colors"
                            />
                        </div>
                    ) : (
                        <h1 className="text-[17px] font-bold text-gray-900 tracking-tight truncate px-2">{storeName}</h1>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => setIsSearching(!isSearching)}
                            className={`text-gray-900 p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100 ${isSearching ? 'bg-gray-100' : ''}`}
                        >
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="text-gray-900 p-2 -mr-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
                        >
                            <Share2 size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Store Profile Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-4">
                        {store?.logoUrl ? (
                            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-white shadow-lg bg-white relative">
                                <Image src={store.logoUrl} alt={storeName} fill className="object-cover" priority />
                            </div>
                        ) : (
                            <div className="w-[100px] h-[100px] bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full overflow-hidden flex items-center justify-center border-[3px] border-white shadow-lg">
                                <span className="text-4xl font-black text-white uppercase">{storeInitials}</span>
                            </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-[#25D366] text-white p-0.5 rounded-full border-2 border-[#F8F9FA] shadow-md">
                            <Check size={14} strokeWidth={4} />
                        </div>
                    </div>

                    <h2 className="text-[22px] font-bold text-gray-900 mb-1 leading-tight">{storeName}</h2>
                    <p className="text-[13px] text-gray-500/80 font-medium px-4 mb-6 leading-snug max-w-[300px]">
                        {store?.category || store?.description || 'Welcome to my store! We provide the best products and services for you.'}
                    </p>

                    <div className="flex gap-4 w-full px-4">
                        <button
                            onClick={() => {
                                if (store?.whatsappNumber) {
                                    const message = encodeURIComponent(`Hi ${storeName}, I have a question about your store.`);
                                    window.open(`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-[15px] rounded-[24px] text-[15px] font-black shadow-xl shadow-green-100/50 active:scale-[0.96] transition-all"
                        >
                            <MessageCircle size={19} strokeWidth={2.5} className="fill-white" />
                            <span>Chat</span>
                        </button>
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2.5 bg-gray-900 text-white py-[15px] rounded-[24px] text-[15px] font-black shadow-xl shadow-gray-200/50 active:scale-[0.96] transition-all"
                        >
                            <Users size={19} strokeWidth={2.5} />
                            <span>Group Order</span>
                        </button>
                    </div>
                </div>

                {/* Group Order Modal */}
                {isGroupModalOpen && (
                    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
                        <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom-10 duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Setup Group Order</h3>
                                <button onClick={() => setIsGroupModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Group Session Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Office Lunch Flow"
                                        className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-5 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all"
                                        value={groupTitle}
                                        onChange={(e) => setGroupTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Order Deadline</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-5 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all"
                                        value={groupDeadline}
                                        onChange={(e) => setGroupDeadline(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleCreateGroupOrder}
                                    disabled={isCreatingGroup || !groupTitle || !groupDeadline}
                                    className="w-full h-16 bg-[#25D366] text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-green-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isCreatingGroup ? 'Initializing...' : (
                                        <>
                                            Start Session <ChevronRight size={18} strokeWidth={3} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
                    {allCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-[10px] rounded-full text-[14px] font-bold whitespace-nowrap transition-all border ${selectedCategory === cat.id
                                ? 'bg-[#25D366] border-[#25D366] text-white shadow-md shadow-green-100/50'
                                : 'bg-white border-gray-100 text-gray-600 shadow-sm'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="p-6 pt-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {(store?.products || [])
                        .filter((p: any) => {
                            const pCats = p.category ? p.category.split(',').filter(Boolean) : [];
                            return (selectedCategory === 'All' || pCats.includes(selectedCategory) || p.description === selectedCategory) &&
                                (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        })
                        .map((p: any) => (
                            <div key={p.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/80 flex flex-col p-2.5 pb-4">
                                <div className="aspect-square bg-gray-100 rounded-[24px] overflow-hidden mb-3 relative">
                                    {p.imageUrl ? (
                                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingCart size={32} strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <div className="px-1.5 flex flex-col flex-grow justify-between">
                                    <h3 className="font-bold text-gray-900 text-[13.5px] leading-tight mb-1 tracking-tight">{p.name}</h3>
                                    {p.description && (
                                        <div className="mb-1.5">
                                            <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{p.description}</p>
                                        </div>
                                    )}
                                    {p.category && (
                                        <div className="mb-1.5 flex flex-wrap gap-1">
                                            {p.category.split(',').filter(Boolean).map((cat: string) => !defaultCategoryIds.includes(cat) ? (
                                                <span key={cat} className="bg-[#25D366]/10 text-[#25D366] text-[9.5px] uppercase font-black px-1.5 py-0.5 rounded border border-[#25D366]/20">{cat}</span>
                                            ) : null)}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-end mt-auto">
                                        <p className="text-[#25D366] font-bold text-[14px]">RM {p.price.toFixed(2)}</p>
                                        <button
                                            onClick={() => addToCart(p)}
                                            className="w-8 h-8 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-md shadow-green-100 active:scale-90 transition-all shrink-0"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {(!store?.products || store.products.length === 0) && (
                        <div className="col-span-2 text-center py-10 text-gray-400">
                            No products available.
                        </div>
                    )}
                </div>
            </div>

            {cartCount > 0 && (
                <div className="fixed bottom-10 left-6 right-6 animate-in slide-in-from-bottom-10 z-[70]">
                    <button
                        onClick={handleCheckout}
                        className="w-full h-[64px] bg-[#25D366] text-white font-bold rounded-[32px] flex items-center justify-between px-6 shadow-xl shadow-green-200/50 active:scale-[0.98] transition-all"
                    >
                        <div className="flex gap-2">
                            <span className="bg-white/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
                                {cartCount} Items
                            </span>
                        </div>
                        <span className="text-[17px] font-bold">RM {cartTotal.toFixed(2)}</span>
                        <div className="flex items-center gap-2 text-[15px] font-bold">
                            View Cart <ShoppingCart size={20} strokeWidth={2.5} className="fill-white/20" />
                        </div>
                    </button>
                </div>
            )}
            {/* Footer Branding */}
            <div className="py-12 flex flex-col items-center gap-2 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md overflow-hidden relative">
                        <Image src="/logo.png" alt="KedaiChat" fill className="object-cover" />
                    </div>
                    <span className="text-[10px] font-black tracking-tighter text-gray-400">KedaiChat</span>
                </div>
                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Powered by KedaiChat</p>
            </div>
        </div>
    );
}
