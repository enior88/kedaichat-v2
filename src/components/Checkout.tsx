'use client';

import React, { useState } from 'react';
import { ChevronLeft, QrCode, ShieldCheck, CheckCircle2, Copy, MessageCircle, Download, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Checkout({ params }: { params: { name: string } }) {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isPaid, setIsPaid] = useState(false);
    const [cartState, setCartState] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [waLink, setWaLink] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [readyImage, setReadyImage] = useState<string | null>(null);
    const [debugError, setDebugError] = useState<string | null>(null);

    // Customer Info
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

    React.useEffect(() => {
        const saved = localStorage.getItem('kd_cart');
        if (saved) {
            setCartState(JSON.parse(saved));
        }
    }, []);

    const cartTotal = cartState?.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;

    const handlePaymentSubmit = async () => {
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            let text = `*New Order - ${cartState?.storeName || 'KedaiChat'}*\n\n`;
            text += `*Customer:* ${customerName || 'Anonymous'}\n`;
            if (customerPhone) text += `*Phone:* ${customerPhone}\n`;
            text += `Total: *RM ${cartTotal.toFixed(2)}*\n\n`;
            text += `*Items:*\n`;
            cartState?.items?.forEach((item: any) => {
                text += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
            });
            if (notes) text += `\n*Notes:*\n${notes}\n`;
            text += `\n_Please verify my payment attached._`;

            const encodedText = encodeURIComponent(text);
            const phone = cartState?.whatsappNumber?.replace(/\D/g, '') || '';
            const link = `https://wa.me/${phone}?text=${encodedText}`;
            setWaLink(link);

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: cartState?.storeId,
                    items: cartState?.items,
                    total: cartTotal,
                    customerName,
                    customerPhone,
                    notes,
                    refCode: cartState?.refCode || null,
                })
            });

            if (res.ok) {
                const data = await res.json();
                const myOrders = JSON.parse(localStorage.getItem('kd_my_orders') || '[]');
                const enrichedOrder = {
                    ...data.order,
                    items: cartState.items,
                    storeName: cartState.storeName,
                    storeSlug: params.name,
                    whatsappNumber: cartState.whatsappNumber
                };
                myOrders.push(enrichedOrder);
                localStorage.setItem('kd_my_orders', JSON.stringify(myOrders));
                localStorage.removeItem('kd_cart');
                localStorage.removeItem('kd_ref');

                setStep(2);
                setIsPaid(true);

                setTimeout(() => {
                    window.open(link, '_blank');
                }, 1500);
            } else {
                const errorData = await res.json();
                if (res.status === 403) {
                    alert(errorData.error || "This store cannot accept new orders at this time.");
                } else {
                    alert('Failed to process order. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Checkout failed', error);
            alert('An unexpected error occurred during checkout.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppOnly = async () => {
        setIsSubmitting(true);
        try {
            let text = `*New Order - ${cartState?.storeName || 'KedaiChat'}*\n\n`;
            text += `*Customer:* ${customerName || 'Anonymous'}\n`;
            if (customerPhone) text += `*Phone:* ${customerPhone}\n`;
            text += `Total: *RM ${cartTotal.toFixed(2)}*\n\n`;
            text += `*Items:*\n`;
            cartState?.items?.forEach((item: any) => {
                text += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
            });
            if (notes) text += `\n*Notes:*\n${notes}\n`;
            text += `\n_I would like to pay via WhatsApp. Please verify._`;

            const encodedText = encodeURIComponent(text);
            const phone = cartState?.whatsappNumber?.replace(/\D/g, '') || '';
            const link = `https://wa.me/${phone}?text=${encodedText}`;
            setWaLink(link);

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: cartState?.storeId,
                    items: cartState?.items,
                    total: cartTotal,
                    customerName,
                    customerPhone,
                    notes,
                    refCode: cartState?.refCode || null,
                })
            });

            if (res.ok) {
                const data = await res.json();
                const myOrders = JSON.parse(localStorage.getItem('kd_my_orders') || '[]');
                const enrichedOrder = {
                    ...data.order,
                    items: cartState.items,
                    storeName: cartState.storeName,
                    storeSlug: params.name,
                    whatsappNumber: cartState.whatsappNumber
                };
                myOrders.push(enrichedOrder);
                localStorage.setItem('kd_my_orders', JSON.stringify(myOrders));
                localStorage.removeItem('kd_cart');

                setStep(2);
                setIsPaid(true);
                window.open(link, '_blank');
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to process order.');
            }
        } catch (error) {
            console.error('WhatsApp order failed', error);
            alert('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateQR = () => {
        if (!cartState?.paymentQrUrl) return;
        setIsDownloading(true);
        setDebugError(null);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 1100;

        const img = new Image();
        img.crossOrigin = "anonymous";
        // Cache-buster to ensure the browser respects the crossOrigin header
        img.src = cartState.paymentQrUrl + (cartState.paymentQrUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        img.onload = () => {
            try {
                // Background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Branding
                ctx.fillStyle = '#111827';
                ctx.font = 'bold 44px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(cartState.storeName || 'KedaiChat', canvas.width / 2, 140);

                ctx.fillStyle = '#25D366';
                ctx.font = 'bold 24px sans-serif';
                ctx.fillText('STORE PAYMENT QR', canvas.width / 2, 185);

                const qrSize = 560;
                const qrX = (canvas.width - qrSize) / 2;
                const qrY = 280;
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

                ctx.fillStyle = '#111827';
                ctx.font = 'bold 32px sans-serif';
                ctx.fillText('kedaichat.online', canvas.width / 2, 950);

                // Export as JPEG
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            const formData = new FormData();
                            formData.append('file', blob, 'payment-qr.jpg');

                            const res = await fetch('/api/public/upload-qr', {
                                method: 'POST',
                                body: formData
                            });

                            if (res.ok) {
                                const data = await res.json();
                                setReadyImage(data.fileUrl);
                            } else {
                                throw new Error('Cloudinary upload failed');
                            }
                        } catch (e) {
                            console.error('Upload error, falling back to data URL', e);
                            setReadyImage(canvas.toDataURL('image/jpeg', 0.9));
                        }
                    } else {
                        throw new Error('Blob generation failed');
                    }
                    setIsDownloading(false);
                }, 'image/jpeg', 0.9);

            } catch (error: any) {
                console.error('Canvas processing failed', error);
                setDebugError(error.message || 'Processing error');
                setReadyImage(cartState.paymentQrUrl);
                setIsDownloading(false);
            }
        };

        img.onerror = () => {
            setDebugError('Failed to load QR image');
            setReadyImage(cartState.paymentQrUrl);
            setIsDownloading(false);
        };
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            <div className="bg-white p-6 border-b border-gray-50 flex items-center gap-4">
                <Link href={`/shop/${params.name}`} className="text-gray-400">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">{t('checkout_title')}</h1>
            </div>

            <div className="p-6 text-center">
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                        <section className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 text-left">Order Details</h2>

                            <div className="space-y-4 mb-8">
                                <div className="text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Your Name *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="e.g. Ahmad"
                                        className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-6 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="012-3456789"
                                        className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl px-6 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Note to Seller (Optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="No spicy, extra sauce, etc."
                                        rows={2}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-bold text-gray-900 focus:border-[#25D366] focus:bg-white focus:outline-none transition-all placeholder:text-gray-300 resize-none"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-50 mb-8" />

                            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('scan_pay')}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">Payment Proof is Required</p>

                            {readyImage ? (
                                <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                    <div className="bg-green-50 rounded-[40px] p-2 border-2 border-dashed border-[#25D366]/30 relative group">
                                        <img
                                            src={readyImage}
                                            alt="Payment QR"
                                            className="w-full h-auto rounded-[32px] shadow-sm select-auto pointer-events-auto"
                                            style={{ '-webkit-user-select': 'auto', 'user-select': 'auto' } as any}
                                        />
                                    </div>
                                    <div className="bg-gray-900 text-white rounded-2xl py-4 px-6 flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <Check size={20} className="text-[#25D366]" />
                                            <span className="text-sm font-bold uppercase tracking-wide">Ready to Save!</span>
                                        </div>
                                        <p className="text-[10px] text-white/60 font-medium">Long-press image above and select <span className="text-white font-bold">"Download Image"</span></p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href={readyImage}
                                            download={`Payment-QR-${cartState.storeName}.jpg`}
                                            className="w-full h-12 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-100"
                                        >
                                            <Download size={18} />
                                            DIRECT DOWNLOAD
                                        </a>
                                        <button
                                            onClick={() => setReadyImage(null)}
                                            className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-900 transition-colors py-2"
                                        >
                                            Reset / Use Original QR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="aspect-square bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden">
                                        {isDownloading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-gray-900 uppercase">Generating Branded QR</p>
                                                    <p className="text-[10px] text-gray-400 font-medium tracking-tight">Optimizing for your phone gallery...</p>
                                                </div>
                                            </div>
                                        ) : cartState?.paymentQrUrl ? (
                                            <img src={cartState.paymentQrUrl} alt="Store Payment QR" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <QrCode size={48} className="text-gray-200" />
                                                <p className="text-[10px] font-bold text-gray-400 tracking-wider">NO QR UPLOADED</p>
                                            </div>
                                        )}
                                    </div>

                                    {debugError && (
                                        <div className="flex items-center justify-center gap-2 text-red-500 mb-4 bg-red-50 py-2 rounded-xl text-[10px] font-bold">
                                            <AlertCircle size={14} />
                                            {debugError}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleGenerateQR}
                                        disabled={isDownloading || !cartState?.paymentQrUrl}
                                        className="w-full h-14 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-95 transition-all mb-4 border border-gray-100 shadow-sm disabled:opacity-50"
                                    >
                                        <Download size={20} />
                                        SAVE QR TO GALLERY
                                    </button>
                                </>
                            )}

                            <div className="flex flex-col items-center gap-2 mt-8 mb-8">
                                <p className="text-3xl font-black text-gray-900">RM {cartTotal.toFixed(2)}</p>
                                <div className="flex items-center gap-2 bg-green-50 text-[#25D366] px-3 py-1 rounded-full text-[10px] font-bold">
                                    <ShieldCheck size={12} />
                                    {t('verified_biz')}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handlePaymentSubmit}
                                    disabled={isSubmitting || cartTotal === 0 || !customerName.trim()}
                                    className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[22px] flex items-center justify-center shadow-lg shadow-green-100 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Verifying payment...' : t('submit_proof')}
                                </button>
                                <button
                                    onClick={handleWhatsAppOnly}
                                    disabled={isSubmitting || cartTotal === 0 || !customerName.trim()}
                                    className="w-full py-4 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors disabled:opacity-50"
                                >
                                    {t('pay_whatsapp')}
                                </button>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center justify-center pt-20">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-1000 ${isPaid ? 'bg-[#25D366] text-white scale-110 shadow-2xl shadow-green-200' : 'bg-gray-100 text-gray-300 animate-pulse'}`}>
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">
                            {isPaid ? t('payment_confirmed') : t('verifying_payment')}
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] mb-12 mx-auto">
                            {isPaid ? t('order_prepared') : t('checking_txn')}
                        </p>

                        {isPaid && (
                            <div className="w-full max-w-xs space-y-3 mx-auto">
                                {waLink && (
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[22px] flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                                    >
                                        <MessageCircle size={18} />
                                        Send to WhatsApp
                                    </a>
                                )}
                                <Link
                                    href="/wallet"
                                    className="w-full h-16 bg-gray-900 text-white font-bold rounded-[22px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                                >
                                    {t('track_order')}
                                    <ChevronLeft size={18} className="rotate-180" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
