'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Minus, Search, ShoppingCart, Store, ChevronLeft, ChevronRight, Share2, Check, Users, Clock, X } from 'lucide-react';
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
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [groupTitle, setGroupTitle] = useState('');
    const [groupDeadline, setGroupDeadline] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(!initialStoreData);
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
                setTimeout(() => setShowToast(false), 2000);
            } catch (err) {
                console.error('Copy failed', err);
            }
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await copyToClipboard();
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                await copyToClipboard();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-36 font-inter relative max-w-md mx-auto shadow-2xl overflow-hidden sm:border-x sm:border-gray-100">
            {/* Loading State */}
            {isLoadingData && (
                <div className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
                    <div className="w-20 h-20 mb-8 relative">
                        <div className="absolute inset-0 border-4 border-[#25D366]/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Rilek Dolok ! <span className="inline-block animate-bounce">😁</span></h2>
                    <div className="flex gap-1.5 mt-4">
                        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                </div>
            )}

            {/* Archived Store Overlay */}
            {store?.archived && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center p-12 text-center animate-in fade-in duration-500">
                    <div className="max-w-xs">
                        <div className="w-24 h-24 bg-gray-50/80 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-gray-400 shadow-sm border border-gray-100">
                            <Store size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-[28px] font-black text-gray-900 mb-3 tracking-tight">Store is Closed</h2>
                        <p className="text-[15px] text-gray-500 font-medium leading-relaxed mb-10">This store is currently not accepting orders. Please check back later.</p>
                    </div>
                </div>
            )}

            {/* Premium Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] pt-1">
                <div className="flex items-center justify-between p-4 pb-3">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-900 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>

                    {isSearching ? (
                        <div className="flex-1 px-3 animate-in slide-in-from-right-4 fade-in">
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search delicious food..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2.5 text-[14px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 px-4 text-center">
                            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight truncate">{storeName}</h1>
                            <p className="text-[11px] font-semibold text-[#25D366] uppercase tracking-wider mt-0.5">Accepting Orders</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => {
                                setIsSearching(!isSearching);
                                if (isSearching) setSearchTerm('');
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isSearching ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                        >
                            {isSearching ? <X size={18} strokeWidth={2.5} /> : <Search size={18} strokeWidth={2.5} />}
                        </button>
                        {!isSearching && (
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Share2 size={18} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Horizontal Category Navigation (Sticky Part 2) */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5 pb-4 pt-1 snap-x">
                    {allCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`snap-start px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.id
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-100 ring-2 ring-gray-900 ring-offset-1'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 scale-95'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Store Banner / Info Profile (Scrolls) */}
            <div className="bg-white px-6 pb-8 pt-6 mb-2 rounded-b-[32px] border-b border-gray-100 shadow-sm relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50/50 to-transparent"></div>

                <div className="flex flex-col relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            {store?.logoUrl ? (
                                <div className="w-[88px] h-[88px] rounded-[24px] overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] bg-white border border-gray-100">
                                    <Image src={store.logoUrl} alt={storeName} fill className="object-cover" priority />
                                </div>
                            ) : (
                                <div className="w-[88px] h-[88px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[24px] overflow-hidden flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] border border-gray-100">
                                    <span className="text-3xl font-black text-white uppercase">{storeInitials}</span>
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-[#25D366] text-white p-1 rounded-full shadow-md border-[3px] border-white">
                                <Check size={12} strokeWidth={4} />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="text-[22px] font-black text-gray-900 leading-tight mb-1">{storeName}</h2>
                            <p className="text-[13px] text-gray-500 font-medium leading-snug line-clamp-2">
                                {store?.category || store?.description || 'Authentic flavors, premium quality. Order now and enjoy.'}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                    <Clock size={12} className="text-gray-400" />
                                    <span>20-30 min</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF9800] bg-orange-50 px-2 py-1 rounded-md border border-orange-100/50">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <span>4.9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => {
                                if (store?.whatsappNumber) {
                                    const message = encodeURIComponent(`Hi ${storeName}, I have a question about your store.`);
                                    window.open(`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#F6F8F6] text-[#25D366] py-[14px] rounded-2xl text-[14px] font-bold active:scale-[0.98] transition-all border border-green-100"
                        >
                            <MessageCircle size={18} strokeWidth={2.5} />
                            <span>Chat Store</span>
                        </button>
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-[14px] rounded-2xl text-[14px] font-bold active:scale-[0.98] transition-all shadow-md shadow-gray-900/20"
                        >
                            <Users size={18} strokeWidth={2.5} />
                            <span>Group Order</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="px-4 pt-4 pb-8">
                <h3 className="text-[18px] font-black text-gray-900 mb-4 px-2">{
                    selectedCategory === 'All' ? 'Popular Items' : selectedCategory
                }</h3>

                <div className="flex flex-col gap-4">
                    {(store?.products || [])
                        .filter((p: any) => {
                            const pCats = p.category ? p.category.split(',').filter(Boolean) : [];
                            return (selectedCategory === 'All' || pCats.includes(selectedCategory) || p.description === selectedCategory) &&
                                (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        })
                        .map((p: any) => {
                            // Find quantity of this item in the cart to show a counter and modify buttons directly on the list (FoodPanda style)
                            const cartItem = cartItems.find(item => item.id === p.id);

                            return (
                                <div
                                    key={p.id}
                                    onClick={() => !cartItem && addToCart(p)}
                                    className={`bg-white rounded-[24px] overflow-hidden shadow-sm border flex p-3 transition-all duration-200 group hover:shadow-md ${cartItem ? 'border-[#25D366]/30' : 'border-gray-100 active:scale-[0.98] cursor-pointer'}`}
                                >
                                    <div className="flex flex-col flex-1 pr-3 justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 tracking-tight group-hover:text-[#25D366] transition-colors">{p.name}</h3>
                                            {p.description && (
                                                <p className="text-[12px] text-gray-500 leading-snug line-clamp-2 mb-2">{p.description}</p>
                                            )}
                                            {p.category && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {p.category.split(',').filter(Boolean).slice(0, 2).map((cat: string) => !defaultCategoryIds.includes(cat) ? (
                                                        <span key={cat} className="bg-gray-50 text-gray-500 text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded border border-gray-100">{cat}</span>
                                                    ) : null)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <p className="text-gray-900 font-black text-[15px]">RM {p.price.toFixed(2)}</p>

                                            {cartItem ? (
                                                <div className="flex items-center gap-2.5 bg-gray-50 rounded-full p-1 border border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => decreaseQuantity(p.id)}
                                                        className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
                                                    >
                                                        <Minus size={14} strokeWidth={2.5} />
                                                    </button>
                                                    <span className="font-black text-[13px] w-3 text-center text-[#25D366]">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(p)}
                                                        className="w-7 h-7 rounded-full bg-[#25D366] text-white shadow-sm flex items-center justify-center active:scale-95 transition-all"
                                                    >
                                                        <Plus size={14} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-50 border border-gray-100 text-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-all">
                                                    <Plus size={16} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-[110px] h-[110px] shrink-0 bg-gray-50 rounded-[18px] overflow-hidden relative shadow-inner">
                                        {p.imageUrl ? (
                                            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                <ShoppingCart size={28} strokeWidth={1.5} />
                                                <span className="text-[9px] mt-2 font-bold uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                        {/* Action overlay hint */}
                                        {!cartItem && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-[12px] font-bold">Add</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    {(!store?.products || store.products.length === 0) && (
                        <div className="text-center py-16 px-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm border border-gray-100">
                                <Search size={32} />
                            </div>
                            <h3 className="text-[17px] font-bold text-gray-900 mb-1">No items found</h3>
                            <p className="text-[13px] text-gray-500">Try changing your search or category filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Floating Cart */}
            {cartCount > 0 && (
                <div className="fixed bottom-8 left-0 right-0 px-4 md:px-0 max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-300 z-[70]">
                    <button
                        onClick={() => setIsCartModalOpen(true)}
                        className="w-full h-[64px] bg-gray-900/95 backdrop-blur-xl text-white font-bold rounded-[32px] flex items-center justify-between px-2 pr-6 shadow-[0_8px_30px_rgb(0,0,0,0.2)] active:scale-[0.98] transition-all border border-gray-800"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-inner relative">
                                <ShoppingCart size={20} className="fill-white" strokeWidth={2.5} />
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900 shadow-sm">
                                    {cartCount}
                                </div>
                            </div>
                            <div className="flex flex-col items-start translate-y-0.5">
                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-[-2px]">View Order</span>
                                <span className="text-[16px] font-black">RM {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[14px] font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                            Checkout <ChevronRight size={16} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            )}

            {/* Cart Review Bottom Sheet */}
            {isCartModalOpen && cartCount > 0 && (
                <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-t-[32px] p-6 pb-8 animate-in slide-in-from-bottom-10 duration-400 shadow-2xl relative max-h-[85vh] flex flex-col">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>

                        <div className="flex justify-between items-center mb-6 px-2 shrink-0">
                            <div>
                                <h3 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">Your Order</h3>
                                <p className="text-[13px] text-gray-500 mt-1 font-medium">{cartCount} items from {storeName}</p>
                            </div>
                            <button onClick={() => setIsCartModalOpen(false)} className="bg-gray-50 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0">
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="overflow-y-auto no-scrollbar flex-1 px-2 space-y-4 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex flex-col flex-1 pr-4">
                                        <span className="font-bold text-gray-900 text-[15px]">{item.name}</span>
                                        <span className="font-black text-[#25D366] text-[14px] mt-0.5">RM {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1.5 border border-gray-100">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
                                        >
                                            <Minus size={16} strokeWidth={2.5} />
                                        </button>
                                        <span className="font-black text-[14px] w-5 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-8 h-8 rounded-full bg-[#25D366] text-white shadow-sm shadow-green-100 flex items-center justify-center active:scale-95 transition-all"
                                        >
                                            <Plus size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 px-2 shrink-0">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[15px] font-bold text-gray-500">Subtotal</span>
                                <span className="text-[22px] font-black text-gray-900">RM {cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full h-[60px] bg-gray-900 text-white rounded-[20px] font-bold text-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-gray-800"
                            >
                                Proceed to Checkout <ChevronRight size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Group Order Modal (Polished) */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-t-[40px] p-6 pb-12 animate-in slide-in-from-bottom-10 duration-400 shadow-2xl">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <div className="flex justify-between items-center mb-8 px-2">
                            <div>
                                <h3 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">Start Group Order</h3>
                                <p className="text-[13px] text-gray-500 mt-1 font-medium">Create a session and invite friends to order together.</p>
                            </div>
                            <button onClick={() => setIsGroupModalOpen(false)} className="bg-gray-50 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0">
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="space-y-6 px-2">
                            <div>
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Group Session Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Office Lunch Flow"
                                    className="w-full h-[56px] bg-gray-50 border-2 border-transparent rounded-2xl px-5 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
                                    value={groupTitle}
                                    onChange={(e) => setGroupTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Order Deadline</label>
                                <input
                                    type="datetime-local"
                                    className="w-full h-[56px] bg-gray-50 border-2 border-transparent rounded-2xl px-5 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all"
                                    value={groupDeadline}
                                    onChange={(e) => setGroupDeadline(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleCreateGroupOrder}
                                disabled={isCreatingGroup || !groupTitle || !groupDeadline}
                                className="w-full h-[60px] bg-gray-900 text-white rounded-[20px] font-bold text-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4 hover:bg-gray-800"
                            >
                                {isCreatingGroup ? (
                                    <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Initializing...</span></div>
                                ) : (
                                    <>
                                        Start Session <ChevronRight size={18} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Branding */}
            <div className="pt-4 pb-16 flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-[6px] overflow-hidden relative shadow-sm border border-gray-200">
                        <Image src="/logo.png" alt="KedaiChat" fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-black tracking-tighter text-gray-400">KedaiChat</span>
                </div>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Powered by KedaiChat</p>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-8 py-4 rounded-[20px] text-xs font-bold animate-in fade-in slide-in-from-bottom-4 z-[200] shadow-2xl flex items-center gap-2 border border-white/10">
                    <Check size={16} className="text-[#25D366]" strokeWidth={3} />
                    Store link copied!
                </div>
            )}
        </div>
    );
}
