'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Download, Copy, ImagePlus, Lock, Loader2, MessageCircle, Plus, Edit2, X, Calendar, Clock, CheckCircle2, Palette, Type } from 'lucide-react';
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
    const [showPreview, setShowPreview] = useState(false);
    const [newItemName, setNewItemName] = useState('');
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

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim() && !selectedItems.includes(newItemName.trim())) {
            toggleItem(newItemName.trim());
            setNewItemName('');
        }
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

        try {
            // Create a high-res canvas
            const canvas = document.createElement('canvas');
            const scale = 2.5; // High resolution for premium feel
            canvas.width = 800 * scale;
            canvas.height = 1000 * scale;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // 1. Premium Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, primaryColor);
            // Derive a slightly darker color for the gradient bottom
            gradient.addColorStop(1, 'rgba(0,0,0,0.2)');

            ctx.fillStyle = primaryColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Background Image (if any)
            if (posterBg) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = posterBg;
                });

                const imgAspect = img.width / img.height;
                const canvasAspect = canvas.width / canvas.height;
                let drawW, drawH, drawX, drawY;
                if (imgAspect > canvasAspect) {
                    drawH = canvas.height;
                    drawW = canvas.height * imgAspect;
                    drawX = (canvas.width - drawW) / 2;
                    drawY = 0;
                } else {
                    drawW = canvas.width;
                    drawH = canvas.width / imgAspect;
                    drawX = 0;
                    drawY = (canvas.height - drawH) / 2;
                }
                ctx.drawImage(img, drawX, drawY, drawW, drawH);

                // Professional dark gradient overlay
                const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
                overlay.addColorStop(0, 'rgba(0,0,0,0.3)');
                overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
                ctx.fillStyle = overlay;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 3. Noise Texture Overlay (Premium Feel)
            const noiseCanvas = document.createElement('canvas');
            noiseCanvas.width = 100;
            noiseCanvas.height = 100;
            const noiseCtx = noiseCanvas.getContext('2d')!;
            const noiseData = noiseCtx.createImageData(100, 100);
            for (let i = 0; i < noiseData.data.length; i += 4) {
                const val = Math.random() * 255;
                noiseData.data[i] = val;
                noiseData.data[i + 1] = val;
                noiseData.data[i + 2] = val;
                noiseData.data[i + 3] = 15; // Subtle
            }
            noiseCtx.putImageData(noiseData, 0, 0);
            const noisePattern = ctx.createPattern(noiseCanvas, 'repeat')!;
            ctx.fillStyle = noisePattern;
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';

            // 4. Header Section
            // Logo Icon (Box shape)
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.roundRect(40 * scale, 40 * scale, 48 * scale, 48 * scale, 12 * scale);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 1 * scale;
            ctx.stroke();

            // Try to draw actual Logo Image
            let logoLoaded = false;
            if (storeInfo?.logoUrl) {
                try {
                    const logoImg = new Image();
                    logoImg.crossOrigin = "anonymous";
                    await new Promise((resolve, reject) => {
                        logoImg.onload = resolve;
                        logoImg.onerror = reject;
                        logoImg.src = storeInfo.logoUrl;
                    });

                    // Draw logo inside the box (with padding)
                    const pad = 8 * scale;
                    ctx.save();
                    ctx.beginPath();
                    ctx.roundRect(40 * scale, 40 * scale, 48 * scale, 48 * scale, 12 * scale);
                    ctx.clip();
                    ctx.drawImage(logoImg, 40 * scale, 40 * scale, 48 * scale, 48 * scale);
                    ctx.restore();
                    logoLoaded = true;
                } catch (e) {
                    console.warn("Logo failed to load for canvas", e);
                }
            }

            if (!logoLoaded) {
                ctx.fillStyle = 'white';
                ctx.font = `black ${24 * scale}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(storeInfo?.businessName?.[0] || 'K', 64 * scale, 73 * scale);
            }

            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = `900 ${10 * scale}px sans-serif`;
            ctx.fillText('PREMIUM SELECTION', 100 * scale, 55 * scale);

            ctx.fillStyle = 'white';
            ctx.font = `bold ${16 * scale}px sans-serif`;
            ctx.fillText(storeInfo?.businessName || 'Your Store', 100 * scale, 80 * scale);

            // Large Heading
            ctx.font = `900 ${52 * scale}px sans-serif`;
            ctx.fillText(customHeading.toUpperCase(), 40 * scale, 200 * scale);

            // Accent Line
            ctx.fillStyle = 'white';
            ctx.fillRect(40 * scale, 230 * scale, 80 * scale, 6 * scale);

            // 5. Items List with Icons
            const itemsToDraw = selectedItems.length > 0 ? selectedItems.slice(0, 5) : ['Signature Selection 1', 'Premium Item 2', 'Exclusive Choice 3'];
            itemsToDraw.forEach((item, idx) => {
                const y = 350 * scale + (idx * 80 * scale);

                // Glass circle
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.beginPath();
                ctx.arc(60 * scale, y - 10 * scale, 18 * scale, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.font = `bold ${14 * scale}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(String(idx + 1), 60 * scale, y - 5 * scale);

                // Item text
                ctx.textAlign = 'left';
                ctx.font = `900 ${28 * scale}px sans-serif`;
                ctx.fillText(item, 100 * scale, y - 2 * scale);
            });

            // 6. Footer Section
            // Shadow divider
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(40 * scale, 730 * scale, canvas.width - 80 * scale, 1 * scale);

            // Time Icons (Clocks)
            const drawTick = (x: number, y: number, label: string, val: string) => {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = `900 ${10 * scale}px sans-serif`;
                ctx.fillText(label, x, y);

                ctx.fillStyle = 'white';
                ctx.font = `900 ${28 * scale}px sans-serif`;
                ctx.fillText(val, x, y + 40 * scale);
            };

            drawTick(40 * scale, 780 * scale, 'PICKUP TIME', pickupTime);
            drawTick(400 * scale, 780 * scale, 'ORDER BY', deadline);

            // 7. Branding (Elegant)
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = `900 ${9 * scale}px sans-serif`;
            ctx.textAlign = 'center';
            // @ts-ignore
            ctx.letterSpacing = '4px';
            ctx.fillText('POWERED BY KEDAICHAT.ONLINE', canvas.width / 2, 950 * scale);

            // Export
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `kedaichat-${storeInfo?.businessName || 'store'}-flyer.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error('Download failed', err);
            const msg = err instanceof Error ? err.message : String(err);
            alert(`Err: ${msg}. Refreshing page may help.`);
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

                {/* Unified Selection (Visible for both modes) */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Add Items to Flyer</h2>

                    {/* Add Custom Item */}
                    <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Type item name..."
                            className="flex-1 h-12 bg-white border border-gray-100 rounded-2xl px-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-green-500 transition-all"
                        />
                        <button type="submit" className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {products.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => toggleItem(p.name)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedItems.includes(p.name) ? 'bg-[#25D366] text-white border-transparent' : 'bg-white text-gray-500 border-gray-100 shadow-xs'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Manage Selected Items */}
                    {selectedItems.length > 0 && (
                        <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Selected Flyer Items (Max 5)</h3>
                            <div className="space-y-2">
                                {selectedItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white p-2 px-3 rounded-xl shadow-xs group">
                                        <div className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...selectedItems];
                                                newItems[idx] = e.target.value;
                                                setSelectedItems(newItems);
                                            }}
                                            className="flex-1 bg-transparent border-none p-0 text-xs font-bold focus:ring-0"
                                        />
                                        <button
                                            onClick={() => toggleItem(item)}
                                            className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {selectedItems.length > 5 && (
                                    <p className="text-[10px] text-orange-500 font-bold px-1">⚠️ Only the first 5 items fit on the flyer.</p>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {mode === 'TEXT' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
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
                                        Flyer Title
                                    </label>
                                    <input
                                        type="text"
                                        value={customHeading}
                                        placeholder="e.g. TODAY'S SPECIALS"
                                        onChange={e => setCustomHeading(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                                            Pickup Time
                                        </label>
                                        <input
                                            type="text"
                                            value={pickupTime}
                                            onChange={e => setPickupTime(e.target.value)}
                                            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                                            Order Deadline
                                        </label>
                                        <input
                                            type="text"
                                            value={deadline}
                                            onChange={e => setDeadline(e.target.value)}
                                            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center justify-between">
                                        Theme Style
                                        {!isPro && <Lock size={10} className="text-orange-400" />}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { code: '#25D366', name: 'Emerald' },
                                            { code: '#000000', name: 'Midnight' },
                                            { code: '#1a365d', name: 'Royal' },
                                            { code: '#9b1c1c', name: 'Crimson' },
                                            { code: '#c2410c', name: 'Safety' }
                                        ].map((c, idx) => (
                                            <button
                                                key={c.code}
                                                onClick={() => (isPro || idx < 2) && setPrimaryColor(c.code)}
                                                className={`h-8 px-3 rounded-full border-2 text-[10px] font-bold transition-all flex items-center gap-2 ${primaryColor === c.code ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 bg-white text-gray-500'} ${!isPro && idx >= 2 ? 'opacity-30' : ''}`}
                                            >
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.code }} />
                                                {c.name}
                                                {!isPro && idx >= 2 && <Lock size={8} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center justify-between">
                                        Custom Background
                                        {!isPro && <Lock size={10} className="text-orange-400" />}
                                    </label>
                                    <label className={`w-full h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition-all ${!isPro ? 'bg-gray-50 opacity-50 pointer-events-none' : ''}`}>
                                        <ImagePlus size={16} /> {posterBg ? 'Change Photo' : 'Upload Image'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>

                            {!isPro && (
                                <button onClick={() => router.push('/billing')} className="w-full py-3 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-orange-100 transition-all">
                                    Get Pro for Custom Colors & Brands
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

