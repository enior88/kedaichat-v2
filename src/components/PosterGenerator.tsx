'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share, ChevronLeft, Calendar, Clock, CheckCircle2, Loader2, Share2 } from 'lucide-react';
import BottomNav from './BottomNav';
import { useRouter } from 'next/navigation';

export default function PosterGenerator() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [pickupTime, setPickupTime] = useState('12:30 PM');
    const [deadline, setDeadline] = useState('11:00 AM');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

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
            <div className="p-6 flex items-center gap-4 bg-white shadow-xs">
                <button onClick={() => router.back()} className="text-gray-400 group active:scale-95 transition-all">
                    <ChevronLeft size={24} className="group-hover:text-gray-900" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Create Group Order</h1>
            </div>

            <div className="p-6 space-y-8 max-w-lg mx-auto">
                {/* Menu Selection */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Menu Items</h2>
                        <span className="text-[10px] font-bold text-[#25D366] bg-green-50 px-2 py-1 rounded-full">{selectedItems.length} selected</span>
                    </div>
                    {products.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
                            No products found. Add products in the manager first!
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {products.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => toggleItem(p.name)}
                                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${selectedItems.includes(p.name)
                                        ? 'bg-[#25D366] border-[#25D366] text-white shadow-md shadow-green-100'
                                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Pickup Time</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                                className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Deadline</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* WhatsApp Preview */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">WhatsApp Preview</h2>
                        <div className="flex items-center gap-1 text-[#25D366]">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-bold">Live Preview</span>
                        </div>
                    </div>
                    <div className="bg-[#E7FCE3] border-2 border-dashed border-[#25D366] rounded-[24px] p-6 text-sm text-gray-800 whitespace-pre-line leading-relaxed shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#25D366]/5 rounded-bl-[40px]" />
                        {previewText}
                    </div>
                </section>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleCopy('whatsapp')}
                        className="w-full h-14 bg-[#25D366] text-white font-bold rounded-[2xl] flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                    >
                        <Copy size={20} />
                        Copy WhatsApp Post
                    </button>
                    <button
                        onClick={() => handleCopy('link')}
                        className="w-full h-14 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-[2xl] flex items-center justify-center gap-2 active:bg-gray-50 transition-all"
                    >
                        <Share2 size={20} />
                        Copy Order Link
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full h-12 text-[#25D366] text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-50 rounded-xl transition-all"
                    >
                        <Share size={16} />
                        Share Directly
                    </button>
                </div>
            </div>

            {/* Toast */}
            {copyStatus && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <div className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#25D366]" />
                        {copyStatus}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
