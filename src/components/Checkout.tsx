'use client';

import React, { useState } from 'react';
import { ChevronLeft, QrCode, ShieldCheck, CheckCircle2, Copy, MessageCircle, Download, Check } from 'lucide-react';
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
            text += `Total: *RM ${cartTotal.toFixed(2)}*\n\n`;
            text += `*Items:*\n`;
            cartState?.items?.forEach((item: any) => {
                text += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
            });
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
            text += `Total: *RM ${cartTotal.toFixed(2)}*\n\n`;
            text += `*Items:*\n`;
            cartState?.items?.forEach((item: any) => {
                text += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
            });
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

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 1100;

        const img = new Image();
        img.crossOrigin = "anonymous";
        // Use JPEG for maximum compatibility and smaller file size
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
                ctx.fillText('OFFICIAL PAYMENT QR', canvas.width / 2, 185);

                const qrSize = 560;
                const qrX = (canvas.width - qrSize) / 2;
                const qrY = 280;
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

                ctx.fillStyle = '#111827';
                ctx.font = 'bold 32px sans-serif';
                ctx.fillText('kedaichat.online', canvas.width / 2, 950);

                // Export as JPEG (most reliable for saving on all OS)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setReadyImage(dataUrl);
                setIsDownloading(false);

                // Desktop fallback: also trigger a real download
                if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    const link = document.createElement('a');
                    link.download = `Payment-QR-${cartState.storeSlug || 'shop'}.jpg`;
                    link.href = dataUrl;
                    link.click();
                } else {
                    // Try to share the file directly on mobile as well
                    canvas.toBlob(async (blob) => {
                        if (blob && navigator.share && navigator.canShare) {
                            const file = new File([blob], 'payment-qr.jpg', { type: 'image/jpeg' });
                            if (navigator.canShare({ files: [file] })) {
                                try {
                                    await navigator.share({
                                        files: [file],
                                        title: 'Payment QR'
                                    });
                                } catch (e) { }
                            }
                        }
                    }, 'image/jpeg', 0.9);
                }
            } catch (error) {
                console.error('Canvas failed', error);
                setReadyImage(cartState.paymentQrUrl);
                setIsDownloading(false);
            }
        };

        img.onerror = () => {
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
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('scan_pay')}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">Payment Proof is Required</p>

                            {readyImage ? (
                                <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                    <div className="bg-green-50 rounded-[40px] p-2 border-2 border-dashed border-[#25D366]/30">
                                        <img src={readyImage} alt="Payment QR" className="w-full h-auto rounded-[32px] shadow-sm" />
                                    </div>
                                    <div className="bg-gray-900 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2">
                                        <Check size={20} className="text-[#25D366]" />
                                        <span className="text-sm font-bold">HOLD IMAGE TO SAVE TO GALLERY</span>
                                    </div>
                                    <button
                                        onClick={() => setReadyImage(null)}
                                        className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        Go Back / Use Original QR
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="aspect-square bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-center p-4 mb-4 relative overflow-hidden">
                                        {cartState?.paymentQrUrl ? (
                                            <img src={cartState.paymentQrUrl} alt="Store Payment QR" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <QrCode size={48} className="text-gray-200" />
                                                <p className="text-[10px] font-bold text-gray-400 tracking-wider">NO QR UPLOADED</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleGenerateQR}
                                        disabled={isDownloading || !cartState?.paymentQrUrl}
                                        className="w-full h-14 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-95 transition-all mb-4 border border-gray-100 shadow-sm disabled:opacity-50"
                                    >
                                        {isDownloading ? (
                                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Download size={20} />
                                                SAVE QR TO GALLERY
                                            </>
                                        )}
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
                                    disabled={isSubmitting || cartTotal === 0}
                                    className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[22px] flex items-center justify-center shadow-lg shadow-green-100 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Verifying payment...' : t('submit_proof')}
                                </button>
                                <button
                                    onClick={handleWhatsAppOnly}
                                    disabled={isSubmitting || cartTotal === 0}
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
