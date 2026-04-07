'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share, ChevronLeft, Calendar, Clock, CheckCircle2, Loader2, Share2, Lock, MessageCircle, ImagePlus, Download, Palette, Type } from 'lucide-react';
import BottomNav from './BottomNav';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import html2canvas from 'html2canvas';

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
        const el = posterRef.current;
        if (!el) return;
        setIsLoading(true);

        // Wait for rendering and fonts
        setTimeout(async () => {
            try {
                const canvas = await html2canvas(el, {
                    useCORS: true,
                    scale: 2, // High resolution
                    backgroundColor: primaryColor,
                    logging: false,
                    allowTaint: true,
                    windowWidth: 800, // Force specific width for consistent layout
                    windowHeight: 1000,
                });

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${storeInfo?.businessName || 'kedai'}-flyer-${Date.now()}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error('Download failed', err);
                const msg = err instanceof Error ? err.message : String(err);
                alert(`Err: ${msg}. Please refresh or try another browser.`);
            } finally {
                setIsLoading(false);
            }
        }, 1000);
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
                                className="aspect-[4/5] w-full relative overflow-hidden"
                                style={{
                                    backgroundColor: primaryColor,
                                    width: '100%',
                                    aspectRatio: '4/5',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '24px'
                                }}
                            >
                                {/* Background Image with Overlay */}

                                {/* Background Image with Overlay */}
                                {posterBg && (
                                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                                        <img src={posterBg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="bg" />
                                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
                                    </div>
                                )}

                                {/* Card Content */}
                                <div style={{
                                    position: 'relative',
                                    zIndex: 10,
                                    padding: '32px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    color: 'white',
                                    flex: 1
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 900,
                                                fontSize: '20px',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                color: 'white'
                                            }}>
                                                {storeInfo?.businessName?.[0] || 'K'}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px', opacity: 0.8, color: 'white', margin: 0 }}>Local Shop</p>
                                                <p style={{ fontWeight: 700, fontSize: '14px', color: 'white', margin: 0 }}>{storeInfo?.businessName || 'Your Store'}</p>
                                            </div>
                                        </div>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            borderRadius: '9999px',
                                            padding: '6px 16px',
                                            fontSize: '10px',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            Open Now
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '32px' }}>
                                        <h3 style={{ fontWeight: 900, fontSize: '36px', marginBottom: '8px', lineHeight: 1.1, letterSpacing: '-0.05em', color: 'white', margin: 0 }}>{customHeading}</h3>
                                        <div style={{ width: '48px', height: '6px', backgroundColor: 'white', borderRadius: '9999px' }}></div>
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {(selectedItems.length > 0 ? selectedItems.slice(0, 5) : ['Best Selection 1', 'Premium Item 2', 'Signature Dish 3']).map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9999px',
                                                    backgroundColor: 'white',
                                                    color: '#111827',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 900,
                                                    fontSize: '12px'
                                                }}>
                                                    {idx + 1}
                                                </div>
                                                <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.025em', color: 'white' }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        marginTop: '32px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderTop: '1px solid rgba(255,255,255,0.2)',
                                        paddingTop: '32px',
                                        paddingBottom: '16px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Delivery/Pickup</p>
                                            <p style={{ fontWeight: 900, fontSize: '18px', color: 'white', margin: 0 }}>{pickupTime}</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Order Before</p>
                                            <p style={{ fontWeight: 900, fontSize: '18px', color: 'white', margin: 0 }}>{deadline}</p>
                                        </div>
                                    </div>

                                    {/* Viral Loop / Branding */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '32px',
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        width: '100%'
                                    }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{ width: '12px', height: '12px', backgroundColor: '#25D366', borderRadius: '3px' }}></div>
                                        </div>
                                        <p style={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.8, color: 'white', margin: 0 }}>Powered by KedaiChat</p>
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
            {
                copyStatus && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
                            <CheckCircle2 size={16} className="text-[#25D366]" />
                            {copyStatus}
                        </div>
                    </div>
                )
            }
            <BottomNav />
        </div >
    );
}

