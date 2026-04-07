'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share, ChevronLeft, Calendar, Clock, CheckCircle2, Loader2, Share2, Lock, MessageCircle, ImagePlus, Download, Palette, Type } from 'lucide-react';
import BottomNav from './BottomNav';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import * as htmlToImage from 'html-to-image';

export default function PosterGenerator() {
    const router = useRouter();
    const { t } = useLanguage();
    const [products, setProducts] = useState<any[]>([]);
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [pickupTime, setPickupTime] = useState('12:30 PM');
    const [deadline, setDeadline] = useState('11:00 AM');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [mode, setMode] = useState<'TEXT' | 'VISUAL'>('TEXT');

    // Editable Features
    const [primaryColor, setPrimaryColor] = useState('#25D366');
    const [customHeading, setCustomHeading] = useState('TODAY\'S SPECIALS');
    const [customFooter, setCustomFooter] = useState('Place your order via WhatsApp now!');
    const [posterBg, setPosterBg] = useState<string | null>(null);
    const posterRef = React.useRef<HTMLDivElement>(null);

    const plan = storeInfo?.plan?.toUpperCase() || 'FREE';
    const isPro = plan === 'PRO' || plan === 'BUSINESS' || storeInfo?.isAdmin;

    useEffect(() => {
        const loadContent = async () => {
            try {
                const [prodRes, dashRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/dashboard')
                ]);
                const prodData = await prodRes.json();
                const dashData = await dashRes.json();

                if (!prodData.error) setProducts(prodData.products || []);
                if (!dashData.error) setStoreInfo(dashData);
            } catch (error) {
                console.error('Failed to load poster data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const toggleItem = (name: string) => {
        setSelectedItems(prev =>
            prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
        );
    };

    const storeUrl = storeInfo?.slug
        ? `${window.location.origin}/shop/${storeInfo.slug}`
        : '...';

    const previewText = `🍛 *${storeInfo?.businessName || 'Nasi Lemak'} Lunch Menu Today*
${selectedItems.length > 0
            ? selectedItems.map((item, idx) => `${idx + 1}️⃣ ${item}`).join('\n')
            : '_(Select items below)_'}

📦 Pickup: *${pickupTime}*
⏳ Order before: *${deadline}*

Order here 👇
${storeUrl}`;

    const handleCopy = async (type: 'whatsapp' | 'link') => {
        const textToCopy = type === 'whatsapp' ? previewText : storeUrl;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopyStatus(type === 'whatsapp' ? 'WhatsApp post copied!' : 'Link copied!');
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Group Order: ${storeInfo?.businessName}`,
                    text: previewText,
                    url: storeUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            handleCopy('whatsapp');
        }
    };

    const handleStatusShare = () => {
        const text = encodeURIComponent(previewText);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleDownload = async () => {
        if (!posterRef.current) return;
        setIsLoading(true);
        try {
            // Optimization for mobile: Use a higher pixel ratio for better quality
            // and ensure we wait for any images/fonts to settle
            const dataUrl = await htmlToImage.toPng(posterRef.current, {
                pixelRatio: 2,
                backgroundColor: primaryColor,
                cacheBust: true,
                style: {
                    borderRadius: '0',
                }
            });

            const link = document.createElement('a');
            link.download = `${storeInfo?.businessName || 'kedai'}-flyer-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download failed', err);
            alert('Download failed. Try taking a screenshot instead or use a different browser.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPosterBg(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#25D366]" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32 font-inter">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-2 shadow-xs sticky top-0 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-400 group active:scale-95 transition-all">
                            <ChevronLeft size={24} className="group-hover:text-gray-900" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Order Poster</h1>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-gray-100 p-1 rounded-2xl mb-4">
                    <button
                        onClick={() => setMode('TEXT')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${mode === 'TEXT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                    >
                        Text Post
                    </button>
                    <button
                        onClick={() => setMode('VISUAL')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${mode === 'VISUAL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                    >
                        Visual Flyer
                    </button>
                </div>
            </div>

            <div className={`p-6 space-y-8 max-w-lg mx-auto`}>

                {mode === 'TEXT' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Menu Selection (Simplified) */}
                        <section>
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Select Products</h2>
                            <div className="flex flex-wrap gap-2">
                                {products.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => toggleItem(p.name)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedItems.includes(p.name) ? 'bg-[#25D366] text-white border-transparent' : 'bg-white text-gray-500 border-gray-100'}`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Text Preview */}
                        <section>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">WhatsApp Text</h2>
                            <div className="bg-[#E7FCE3] border-2 border-dashed border-[#25D366] rounded-[24px] p-6 text-sm text-gray-800 whitespace-pre-line leading-relaxed shadow-sm">
                                {previewText}
                            </div>
                        </section>

                        <div className="space-y-3">
                            <button onClick={() => handleCopy('whatsapp')} className="w-full h-14 bg-[#25D366] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                                <Copy size={20} /> Copy WhatsApp Post
                            </button>
                            <button onClick={handleStatusShare} className="w-full h-14 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <MessageCircle size={20} /> Post to Status
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-16">
                        {/* Editor Controls */}
                        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Customize Your Flyer</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center justify-between">
                                        Poster Heading
                                        {!isPro && <Lock size={10} className="text-orange-400" />}
                                    </label>
                                    <input
                                        disabled={!isPro}
                                        type="text"
                                        value={customHeading}
                                        onChange={e => setCustomHeading(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold disabled:opacity-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center justify-between">
                                        Theme Color
                                        {!isPro && <Lock size={10} className="text-orange-400" />}
                                    </label>
                                    <div className="flex gap-2">
                                        {['#25D366', '#000000', '#FFB800', '#FF4B4B', '#4B7BFF'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => isPro && setPrimaryColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor === c ? 'border-gray-900 scale-110' : 'border-transparent opacity-60'} ${!isPro && c !== '#25D366' ? 'hidden' : ''}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center justify-between">
                                        Background Image
                                        {!isPro && <Lock size={10} className="text-orange-400" />}
                                    </label>
                                    <label className={`w-full h-12 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-100 transition-all ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <ImagePlus size={16} /> {posterBg ? 'Change Photo' : 'Upload Background'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>

                            {!isPro && (
                                <button onClick={() => router.push('/billing')} className="w-full py-3 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-orange-100 transition-all">
                                    Upgrade to Pro for Full Editor
                                </button>
                            )}
                        </section>

                        {/* The DOM element we capture */}
                        <div className="relative group">
                            <div
                                ref={posterRef}
                                className="aspect-[4/5] w-full bg-white rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {/* Pattern Overlay for Premium Feel */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                                {/* Background Image with Overlay */}
                                {posterBg && (
                                    <div className="absolute inset-0 z-0">
                                        <img src={posterBg} className="w-full h-full object-cover" alt="bg" />
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="relative z-10 p-8 flex flex-col h-full text-white" style={{ color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div className="flex justify-between items-start mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                        <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border border-[rgba(255,255,255,0.3)] text-white" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                                                {storeInfo?.businessName?.[0] || 'K'}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-80" style={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px', opacity: 0.8 }}>Local Shop</p>
                                                <p className="font-bold text-sm leading-none" style={{ fontWeight: 700, fontSize: '14px' }}>{storeInfo?.businessName || 'Your Store'}</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[rgba(255,255,255,0.1)] text-white" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px', padding: '6px 16px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'white' }}>
                                            Open Now
                                        </div>
                                    </div>

                                    <div className="mb-8" style={{ marginBottom: '32px' }}>
                                        <h3 className="text-4xl font-black mb-2 leading-tight tracking-tighter" style={{ fontWeight: 900, fontSize: '36px', marginBottom: '8px', lineHeight: 1.25, letterSpacing: '-0.05em' }}>{customHeading}</h3>
                                        <div className="w-12 h-1.5 bg-white rounded-full" style={{ width: '48px', height: '6px', backgroundColor: 'white', borderRadius: '9999px' }}></div>
                                    </div>

                                    <div className="space-y-6 flex-1" style={{ flex: 1 }}>
                                        {(selectedItems.length > 0 ? selectedItems.slice(0, 5) : ['Best Selection 1', 'Premium Item 2', 'Signature Dish 3']).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-5" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                                                <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-black text-xs" style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: 'white', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px' }}>
                                                    {idx + 1}
                                                </div>
                                                <span className="font-black text-xl tracking-tight" style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.025em' }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-8 border-t border-[rgba(255,255,255,0.2)] pt-8 pb-4" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '32px', paddingBottom: '16px' }}>
                                        <div>
                                            <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-2" style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Delivery/Pickup</p>
                                            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                                <p className="font-black text-lg" style={{ fontWeight: 900, fontSize: '18px' }}>{pickupTime}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-2" style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Order Before</p>
                                            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                                <p className="font-black text-lg" style={{ fontWeight: 900, fontSize: '18px' }}>{deadline}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Viral Loop / Branding */}
                                    <div className="mt-auto pt-8 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-center gap-3" style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center" style={{ width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="w-4 h-4 bg-[#25D366] rounded flex items-center justify-center" style={{ width: '16px', height: '16px', backgroundColor: '#25D366', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CheckCircle2 size={10} style={{ color: 'white' }} />
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 text-white" style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.8, color: 'white' }}>Powered by KedaiChat</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full h-16 bg-gray-900 text-white font-black rounded-3xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                        >
                            <Download size={20} />
                            Download Flyer Image
                        </button>
                    </div>
                )}
            </div>

            {/* Toast */}
            {copyStatus && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                        <CheckCircle2 size={16} className="text-[#25D366]" />
                        {copyStatus}
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
}

