'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Minus, Search, ShoppingCart, Store, ChevronLeft, ChevronRight, Share2, Check, Users, Clock, X, Info } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function StoreCatalog({ slug, initialStoreData }: { slug?: string, initialStoreData?: any }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [store, setStore] = useState<any>(initialStoreData || null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cartItems, setCartItems] = useState<{ id: string, name: string, price: number, quantity: number }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [groupTitle, setGroupTitle] = useState('');
    const [groupDeadline, setGroupDeadline] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [showToast, setShowToast] = useState(false);

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

    const decreaseQuantity = (productId: string) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.id !== productId);
        });
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Auto-close modal if cart becomes empty
    useEffect(() => {
        if (cartCount === 0) {
            setIsCartModalOpen(false);
        }
    }, [cartCount]);

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
    const storeInitials = storeName[0] || 'S';

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: storeName,
            text: `Check out ${storeName} on KedaiChat!`,
            url: url,
        };

        const copyToClipboard = async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(url);
                } else {
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
                setTimeout(() => setShowToast(false), 3000);
            } catch (err) {
                console.error('Copy failed', err);
            }
        };

        // Trigger toast immediately for instant feedback
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Perform copy/share actions
        copyToClipboard();

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (navigator.share && isMobile) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Ignore share errors
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-36 font-inter relative overflow-x-hidden selection:bg-[#22C55E]/30 selection:text-[#0F172A] w-full">
            {/* Layer 1 - Background Mesh Gradient */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC]">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/20 blur-[120px] mix-blend-multiply opacity-50" />
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[50vw] rounded-full bg-cyan-200/10 blur-[120px] mix-blend-multiply opacity-50" />
                <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/20 blur-[100px] mix-blend-multiply opacity-50" />
            </div>

            {/* Loading & Archived Shields */}
            <AnimatePresence>
                {isLoadingData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-[#F8FAFC] flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 mb-8 relative">
                            <div className="absolute inset-0 border-4 border-[#25D366]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-[22px] font-black text-[#0F172A] mb-2 tracking-tight">Preparing Store...</h2>
                    </motion.div>
                )}
                {store?.archived && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-white/50 backdrop-blur-xl flex items-center justify-center p-12 text-center">
                        <div className="max-w-xs bg-white rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-[#0F172A]/5">
                            <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-gray-400 border border-gray-100 shadow-sm">
                                <Store size={36} strokeWidth={2} />
                            </div>
                            <h2 className="text-[24px] font-black text-[#0F172A] mb-3 tracking-tight">Store acts offline</h2>
                            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">This store is currently completely closed and not accepting new orders online.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 mx-auto max-w-7xl px-0 md:px-6 w-full flex flex-col lg:flex-row items-start gap-0 lg:gap-12 min-h-screen">

                {/* 
                  MOBILE STICKY HEADER (Only fixed/sticky on mobile)
                  On desktop, this part aligns with the sidebar at top-8
                */}
                <div className="w-full lg:w-[380px] shrink-0 sticky top-0 lg:top-8 flex flex-col lg:gap-8 lg:pt-4 z-40 lg:z-10 bg-white/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b border-[#0F172A]/5 lg:border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] lg:shadow-none">

                    <div className="p-4 lg:p-0 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white border border-[#0F172A]/5 text-[#0F172A] rounded-full hover:bg-gray-50 shadow-sm transition-all shrink-0 active:scale-95">
                                <ChevronLeft size={22} strokeWidth={2.5} />
                            </button>

                            {isSearching ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 px-3">
                                    <div className="relative w-full shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)] rounded-full">
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                                        <input autoFocus type="text" placeholder="Search menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F8FAFC] border border-[#0F172A]/5 rounded-full pl-10 pr-4 py-2.5 text-[14px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-all placeholder:text-[#64748B] placeholder:font-medium" />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 px-4 lg:hidden text-center">
                                    <h1 className="text-[17px] font-black text-[#0F172A] tracking-tight truncate">{storeName}</h1>
                                </div>
                            )}

                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => { setIsSearching(!isSearching); if (isSearching) setSearchTerm(''); }} className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-sm border", isSearching ? 'bg-[#0F172A] text-white border-transparent shadow-md' : 'bg-white text-[#0F172A] border-[#0F172A]/5 hover:bg-gray-50')}>
                                    {isSearching ? <X size={18} strokeWidth={2.5} /> : <Search size={18} strokeWidth={2.5} />}
                                </button>
                                {!isSearching && (
                                    <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center bg-white border border-[#0F172A]/5 text-[#0F172A] rounded-full hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                                        <Share2 size={18} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Horizontal Categories */}
                        <div className="lg:hidden flex gap-2.5 overflow-x-auto no-scrollbar pt-1 pb-3 -mx-4 px-4 snap-x relative z-30">
                            {allCategories.map((cat) => (
                                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="relative snap-start px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors flex items-center justify-center active:scale-95 border border-[#0F172A]/5 bg-white shadow-sm">
                                    {selectedCategory === cat.id && (
                                        <motion.div layoutId="mobile-category-bubble" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} className="absolute inset-0 bg-[#0F172A] rounded-full shadow-[0_6px_15px_-3px_rgba(15,23,42,0.3)] border border-[#0F172A]" />
                                    )}
                                    <span className={cn("relative z-10", selectedCategory === cat.id ? "text-white" : "text-[#64748B] hover:text-[#0F172A]")}>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Specific sticky container (For Bento Box + Links) */}
                    <div className="hidden lg:flex flex-col gap-4">
                        {/* Store Info Bento Panel (Desktop) */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white/70 backdrop-blur-3xl rounded-[32px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#0F172A]/5 relative overflow-hidden group">
                            {/* Decorative internal blur */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 blur-[50px] rounded-full point-events-none" />

                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative shrink-0">
                                    {store?.logoUrl ? (
                                        <div className="w-[88px] h-[88px] rounded-[24px] overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] bg-white border border-[#0F172A]/5">
                                            <Image src={store.logoUrl} alt={storeName} fill className="object-cover transition-transform duration-700 group-hover:scale-110" priority />
                                        </div>
                                    ) : (
                                        <div className="w-[88px] h-[88px] bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-[24px] overflow-hidden flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] border border-[#0F172A]/5">
                                            <span className="text-3xl font-black text-white uppercase">{storeInitials}</span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-[#22C55E] text-white p-1 rounded-full shadow-md border-[3px] border-white">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="text-[22px] font-black text-[#0F172A] leading-tight mb-1">{storeName}</h2>
                                    <p className="text-[13px] text-[#64748B] font-medium leading-relaxed line-clamp-2">
                                        {store?.category || store?.description || 'Authentic flavors, premium quality.'}
                                    </p>
                                </div>
                            </div>

                            {/* Premium Pills */}
                            <div className="flex items-center gap-3 mt-6 mb-8 relative z-10">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] bg-white px-3 py-1.5 rounded-xl shadow-sm border border-[#0F172A]/5">
                                    <Clock size={12} className="text-[#64748B]" />
                                    <span>20-30 min</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] bg-[#FFFBEB] px-3 py-1.5 rounded-xl shadow-sm border border-[#F59E0B]/20">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <span>4.9 Excellent</span>
                                </div>
                            </div>

                            {/* Store Actions */}
                            <div className="flex gap-3 relative z-10">
                                <button onClick={() => { if (store?.whatsappNumber) { const message = encodeURIComponent(`Hi ${storeName}, I have a question about your store.`); window.open(`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank'); } }} className="flex-1 flex justify-center items-center gap-2 bg-white text-[#22C55E] py-[14px] rounded-[18px] text-[14px] font-bold shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-[#0F172A]/5 hover:bg-emerald-50 hover:shadow-lg transition-all active:scale-95 group">
                                    <MessageCircle size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                    <span>Chat Store</span>
                                </button>
                                <button onClick={() => setIsGroupModalOpen(true)} className="flex-1 flex justify-center items-center gap-2 bg-[#0F172A] text-white py-[14px] rounded-[18px] text-[14px] font-bold shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)] hover:bg-[#1E293B] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-8px_rgba(15,23,42,0.6)] transition-all active:scale-95 group">
                                    <Users size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                    <span>Group Order</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Desktop Categories Stack (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-col gap-2 mt-4 ml-2">
                            <h3 className="text-[13px] font-black text-[#64748B] uppercase tracking-widest px-4 mb-2">Navigation</h3>
                            {allCategories.map((cat, i) => (
                                <motion.button key={cat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.05) }} onClick={() => setSelectedCategory(cat.id)} className="relative px-6 py-3.5 rounded-2xl text-[14px] font-bold text-left transition-colors flex items-center shrink-0 w-full group">
                                    {selectedCategory === cat.id && (
                                        <motion.div layoutId="desktop-category-bubble" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} className="absolute inset-0 bg-white rounded-2xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-[#0F172A]/5 backdrop-blur-md" />
                                    )}
                                    <span className={cn("relative z-10 transition-colors", selectedCategory === cat.id ? "text-[#0F172A]" : "text-[#64748B] group-hover:text-[#0F172A]")}>{cat.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 
                  MOBILE STORE INFO BENTO BOX 
                  Visible ONLY on mobile. Slides smoothly with scroll 
                */}
                <div className="lg:hidden w-full px-4 pt-6 flex flex-col z-10">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full bg-white/80 backdrop-blur-3xl rounded-[32px] p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-[#0F172A]/5 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 blur-[50px] rounded-full point-events-none" />

                        <div className="flex items-center gap-5 relative z-10">
                            <div className="relative shrink-0">
                                {store?.logoUrl ? (
                                    <div className="w-[80px] h-[80px] rounded-[24px] overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] bg-white border border-[#0F172A]/5">
                                        <Image src={store.logoUrl} alt={storeName} fill className="object-cover transition-transform duration-700 group-hover:scale-110" priority />
                                    </div>
                                ) : (
                                    <div className="w-[80px] h-[80px] bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-[24px] overflow-hidden flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] border border-[#0F172A]/5">
                                        <span className="text-3xl font-black text-white uppercase">{storeInitials}</span>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-[#22C55E] text-white p-1 rounded-full shadow-md border-[3px] border-white">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-[20px] font-black text-[#0F172A] leading-tight mb-1">{storeName}</h2>
                                <p className="text-[13px] text-[#64748B] font-medium leading-relaxed line-clamp-2">
                                    {store?.category || store?.description || 'Authentic flavors, premium quality.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 mb-6 relative z-10">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] bg-white px-3 py-1.5 rounded-xl shadow-sm border border-[#0F172A]/5">
                                <Clock size={12} className="text-[#64748B]" />
                                <span>20-30 min</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] bg-[#FFFBEB] px-3 py-1.5 rounded-xl shadow-sm border border-[#F59E0B]/20">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <span>4.9 Excellent</span>
                            </div>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <button onClick={() => { if (store?.whatsappNumber) { const message = encodeURIComponent(`Hi ${storeName}, I have a question about your store.`); window.open(`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank'); } }} className="flex-1 flex justify-center items-center gap-2 bg-white text-[#22C55E] py-[12px] rounded-[18px] text-[13px] font-bold shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-[#0F172A]/5 active:scale-95">
                                <MessageCircle size={16} strokeWidth={2.5} />
                                <span>Chat Store</span>
                            </button>
                            <button onClick={() => setIsGroupModalOpen(true)} className="flex-1 flex justify-center items-center gap-2 bg-[#0F172A] text-white py-[12px] rounded-[18px] text-[13px] font-bold shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)] active:scale-95">
                                <Users size={16} strokeWidth={2.5} />
                                <span>Group Order</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT PANE (Product Catalog) */}
                <div className="flex-1 w-full flex flex-col gap-6 lg:gap-8 pb-32">

                    {/* Desktop Search */}
                    <div className="hidden lg:flex items-center justify-between mt-8">
                        <h2 className="text-[32px] font-black text-[#0F172A] tracking-tight">{selectedCategory === 'All' ? 'Popular Items' : selectedCategory}</h2>
                        <div className="relative w-80">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                            <input type="text" placeholder="Search menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/50 backdrop-blur-md border border-[#0F172A]/5 rounded-2xl pl-12 pr-4 py-3.5 text-[15px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:bg-white transition-all shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] placeholder:text-[#64748B] placeholder:font-medium" />
                        </div>
                    </div>

                    {/* Mobile Category Title */}
                    <h2 className="lg:hidden text-[26px] font-black text-[#0F172A] tracking-tight px-4 mt-2">{selectedCategory === 'All' ? 'Popular Items' : selectedCategory}</h2>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 px-4 lg:px-0">
                        <AnimatePresence mode="popLayout">
                            {(store?.products || [])
                                .filter((p: any) => {
                                    const pCats = p.category ? p.category.split(',').filter(Boolean) : [];
                                    return (selectedCategory === 'All' || pCats.includes(selectedCategory) || p.description === selectedCategory) &&
                                        (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                })
                                .map((p: any, idx: number) => {
                                    const cartItem = cartItems.find(item => item.id === p.id);

                                    return (
                                        <motion.div
                                            key={p.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                                            onClick={() => !cartItem && addToCart(p)}
                                            className={cn(
                                                "group bg-white/80 backdrop-blur-lg border rounded-[28px] overflow-hidden flex flex-row p-4 transition-all duration-300 relative shadow-[0_10px_30px_-15px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.12)] cursor-pointer",
                                                cartItem ? "border-[#22C55E]/40 ring-2 ring-[#22C55E]/10" : "border-[#0F172A]/5 active:scale-[0.98]"
                                            )}
                                        >
                                            <div className="flex flex-col flex-1 pr-4 justify-between relative z-10 w-full h-full">
                                                <div>
                                                    <h3 className="font-black text-[#0F172A] text-[18px] leading-tight mb-2 tracking-tight group-hover:text-[#22C55E] transition-colors">{p.name}</h3>
                                                    {p.description && (
                                                        <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                                                    )}
                                                    {p.category && (
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {p.category.split(',').filter(Boolean).slice(0, 2).map((cat: string) => !defaultCategoryIds.includes(cat) ? (
                                                                <span key={cat} className="bg-[#F8FAFC] text-[#64748B] text-[10px] uppercase font-bold px-2 py-1 rounded-lg border border-[#0F172A]/5 tracking-wider">{cat}</span>
                                                            ) : null)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-2">
                                                    <p className="text-[#0F172A] font-black text-[22px] tracking-tight">RM {p.price.toFixed(2)}</p>

                                                    {cartItem ? (
                                                        <div className="flex items-center gap-3 bg-white rounded-full p-1.5 border border-[#0F172A]/5 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)]" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => decreaseQuantity(p.id)} className="w-[34px] h-[34px] rounded-full bg-[#F8FAFC] border border-[#0F172A]/5 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100 active:scale-90 transition-all">
                                                                <Minus size={16} strokeWidth={2.5} />
                                                            </button>
                                                            <span className="font-black text-[15px] min-w-[12px] text-center text-[#22C55E]">{cartItem.quantity}</span>
                                                            <button onClick={() => addToCart(p)} className="w-[34px] h-[34px] rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6] text-white shadow-md shadow-[#22C55E]/20 flex items-center justify-center active:scale-90 transition-all">
                                                                <Plus size={16} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="w-10 h-10 bg-[#F8FAFC] border border-[#0F172A]/5 text-[#0F172A] rounded-[14px] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white group-hover:shadow-[0_8px_15px_-5px_rgba(15,23,42,0.3)] transition-all group-active:scale-90 relative overflow-hidden">
                                                            <Plus size={18} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-[140px] h-[140px] shrink-0 bg-[#F8FAFC] rounded-[20px] overflow-hidden relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] group-hover:shadow-md transition-all border border-[#0F172A]/5">
                                                {p.imageUrl ? (
                                                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" priority={idx < 4} sizes="140px" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-white">
                                                        <ShoppingCart size={32} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                                {/* Action overlay hint */}
                                                {!cartItem && (
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]" />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </AnimatePresence>
                        {(!store?.products || store.products.length === 0) && (
                            <div className="col-span-1 md:col-span-2 text-center py-20 px-6 bg-white/40 backdrop-blur-xl rounded-[32px] border border-[#0F172A]/5 mt-4 shadow-sm">
                                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 text-emerald-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-[#0F172A]/5">
                                    <Search size={40} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[20px] font-black text-[#0F172A] mb-2">No items found</h3>
                                <p className="text-[14px] text-[#64748B] font-medium">Try changing your search keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Premium Floating Cart */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 lg:bottom-10 left-0 right-0 px-4 md:px-0 max-w-[500px] mx-auto z-[70]">
                        <button onClick={() => setIsCartModalOpen(true)} className="w-full h-[72px] bg-gradient-to-r from-[#0F172A] to-slate-900 border border-white/10 text-white rounded-[36px] flex items-center justify-between px-3 pr-4 shadow-[0_20px_40px_-5px_rgba(15,23,42,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(15,23,42,0.5)] hover:-translate-y-1 active:scale-[0.98] transition-all group overflow-hidden relative">
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#22C55E] to-[#14B8A6] rounded-[28px] overflow-hidden flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] relative border border-white/10">
                                        <ShoppingCart size={22} className="fill-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[11px] font-black min-w-[24px] h-[24px] px-1.5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm z-20">
                                        {cartCount}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start translate-y-0.5 text-left">
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-[-4px]">View Cart</span>
                                    <span className="text-[20px] font-black tracking-tight">RM {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[15px] font-black bg-white/10 px-6 py-3 rounded-full group-hover:bg-white/20 transition-colors relative z-10 border border-white/5">
                                Checkout <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Review Bottom Sheet */}
            <AnimatePresence>
                {isCartModalOpen && cartCount > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-[#0F172A]/40 backdrop-blur-md flex items-end justify-center">
                        <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-xl bg-white rounded-t-[40px] p-6 sm:p-8 pb-10 shadow-2xl relative max-h-[85vh] flex flex-col border border-white">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 shrink-0"></div>

                            <div className="flex justify-between items-center mb-6 px-2 shrink-0">
                                <div>
                                    <h3 className="text-[26px] font-black text-[#0F172A] tracking-tight leading-tight">Your Order</h3>
                                    <p className="text-[14px] text-[#64748B] mt-1 font-medium">{cartCount} items from {storeName}</p>
                                </div>
                                <button onClick={() => setIsCartModalOpen(false)} className="bg-gray-50 w-12 h-12 flex items-center justify-center rounded-full text-[#0F172A] border border-[#0F172A]/5 hover:bg-gray-100 transition-colors shrink-0 active:scale-95 shadow-sm">
                                    <X size={22} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="overflow-y-auto no-scrollbar flex-1 px-2 space-y-5 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between bg-white border-b border-[#0F172A]/5 pb-5 last:border-0 last:pb-0">
                                        <div className="flex flex-col flex-1 pr-4">
                                            <span className="font-black text-[#0F172A] text-[16px] mb-0.5">{item.name}</span>
                                            <span className="font-black text-[#22C55E] text-[15px]">RM {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1.5 border border-[#0F172A]/5 shadow-inner">
                                            <button onClick={() => decreaseQuantity(item.id)} className="w-[36px] h-[36px] rounded-full bg-white shadow-sm border border-[#0F172A]/5 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] active:scale-95 transition-all">
                                                <Minus size={18} strokeWidth={2.5} />
                                            </button>
                                            <span className="font-black text-[16px] w-6 text-center text-[#0F172A]">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-[36px] h-[36px] rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6] text-white shadow-md flex items-center justify-center active:scale-95 transition-all">
                                                <Plus size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-[#0F172A]/5 px-2 shrink-0">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[16px] font-bold text-[#64748B]">Total Amount</span>
                                    <span className="text-[28px] font-black text-[#0F172A] tracking-tight">RM {cartTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full h-[64px] bg-gradient-to-r from-[#0F172A] to-slate-900 border border-white/10 text-white rounded-[24px] font-black text-[18px] shadow-[0_15px_30px_-5px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_20px_40px_-5px_rgba(15,23,42,0.5)]">
                                    Proceed to Checkout <ChevronRight size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Group Order Modal */}
            <AnimatePresence>
                {isGroupModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#0F172A]/40 backdrop-blur-md flex items-end justify-center">
                        <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl border border-white">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-[#0F172A] rounded-[14px] flex items-center justify-center text-white shadow-md rotate-3">
                                            <Users size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-tight">Group Order</h3>
                                    </div>
                                    <p className="text-[14px] text-[#64748B] font-medium leading-relaxed mt-1">Start a session and invite friends via short-link to order together on a single bill.</p>
                                </div>
                                <button onClick={() => setIsGroupModalOpen(false)} className="bg-gray-50 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 transition-colors shrink-0 active:scale-95 border border-[#0F172A]/5">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-widest ml-1 mb-2.5 block">Session Title</label>
                                    <input type="text" placeholder="e.g. Office Lunch Flow" className="w-full h-[60px] bg-[#F8FAFC] border border-[#0F172A]/5 rounded-[20px] px-5 font-bold text-[16px] text-[#0F172A] focus:border-[#22C55E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all placeholder:font-medium placeholder:text-gray-400 shadow-inner" value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)} />
                                </div>

                                <div>
                                    <label className="text-[12px] font-black text-[#0F172A] uppercase tracking-widest ml-1 mb-2.5 block">Lock Orders By</label>
                                    <input type="datetime-local" className="w-full h-[60px] bg-[#F8FAFC] border border-[#0F172A]/5 rounded-[20px] px-5 font-bold text-[16px] text-[#0F172A] focus:border-[#22C55E] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all shadow-inner" value={groupDeadline} onChange={(e) => setGroupDeadline(e.target.value)} />
                                </div>

                                <button onClick={handleCreateGroupOrder} disabled={isCreatingGroup || !groupTitle || !groupDeadline} className="w-full h-[64px] bg-gradient-to-r from-[#0F172A] to-slate-900 text-white rounded-[24px] font-black text-[18px] shadow-[0_15px_30px_-5px_rgba(15,23,42,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(15,23,42,0.5)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-3 mt-4 border border-white/10">
                                    {isCreatingGroup ? (
                                        <div className="flex items-center gap-3"><div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div><span>Generating Link...</span></div>
                                    ) : (
                                        <>Create Session <ChevronRight size={20} strokeWidth={3} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Branding */}
            <div className="pt-8 pb-32 flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all mix-blend-multiply">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-[8px] overflow-hidden relative border border-[#0F172A]/10 shadow-sm bg-white">
                        <Image src="/logo.png" alt="KedaiChat" fill className="object-cover p-0.5" />
                    </div>
                    <span className="text-[13px] font-black tracking-tight text-[#0F172A]">KedaiChat</span>
                </div>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Premium Store</p>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed top-8 lg:bottom-12 lg:top-auto left-1/2 -translate-x-1/2 bg-white backdrop-blur-xl text-[#0F172A] px-6 py-4 rounded-[20px] text-[14px] font-black z-[9999] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex items-center gap-3 border border-[#0F172A]/5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check size={16} className="text-[#22C55E]" strokeWidth={3} />
                        </div>
                        Store link copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
