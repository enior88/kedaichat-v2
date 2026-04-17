'use client';

import React, { useState } from 'react';
import { ChevronLeft, QrCode, ShieldCheck, CheckCircle2, Copy, MessageCircle, Download } from 'lucide-react';
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

    const handleDownloadQR = () => {
        if (!cartState?.paymentQrUrl) return;
        setIsDownloading(true);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 1100;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = cartState.paymentQrUrl;

        img.onload = async () => {
            try {
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, '#f3f4f6');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0,0,0,0.1)';
                ctx.shadowBlur = 40;
                ctx.beginPath();
                if ((ctx as any).roundRect) (ctx as any).roundRect(40, 40, 720, 1020, 60);
                else ctx.rect(40, 40, 720, 1020);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#111827';
                ctx.font = '900 48px Inter, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(cartState.storeName || 'KedaiChat', canvas.width / 2, 140);

                ctx.fillStyle = '#25D366';
                ctx.font = 'bold 24px Inter, system-ui, sans-serif';
                ctx.fillText('STORE PAYMENT QR', canvas.width / 2, 185);

                ctx.fillStyle = '#6B7280';
                ctx.font = '500 20px Inter, system-ui, sans-serif';
                ctx.fillText('Scan this QR code with any banking app', canvas.width / 2, 230);

                const qrSize = 560;
                const qrX = (canvas.width - qrSize) / 2;
                const qrY = 280;

                ctx.strokeStyle = '#f3f4f6';
                ctx.lineWidth = 2;
                ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

                ctx.fillStyle = '#111827';
                ctx.font = 'bold 32px Inter, system-ui, sans-serif';
                ctx.fillText('kedaichat.online', canvas.width / 2, 950);

                ctx.fillStyle = '#9CA3AF';
                ctx.font = '500 18px Inter, system-ui, sans-serif';
                ctx.fillText('Powered by KedaiChat', canvas.width / 2, 990);

                const fileName = `Payment-QR-${cartState.storeSlug || 'shop'}.png`;
                const dataUrl = canvas.toDataURL('image/png', 1.0);

                // Strategy 1: Web Share API (Mobile Premium)
                if (navigator.share && navigator.canShare) {
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const file = new File([blob], fileName, { type: 'image/png' });
                            if (navigator.canShare({ files: [file] })) {
                                try {
                                    alert('Ready! Select "Save Image" or "Save to Photos" from the menu.');
                                    await navigator.share({
                                        files: [file],
                                        title: 'Payment QR',
                                        text: 'Save this QR to your gallery for payment.'
                                    });
                                    setIsDownloading(false);
                                    return;
                                } catch (err: any) {
                                    if (err.name !== 'AbortError') {
                                        console.error('Share failed, falling back:', err);
                                        const newWindow = window.open();
                                        if (newWindow) {
                                            newWindow.document.write(`<img src="${dataUrl}" style="width:100%; height:auto;" />`);
                                            newWindow.document.write('<p style="text-align:center; font-family:sans-serif; margin-top:20px;"><b>Long-press the image to save to your gallery</b></p>');
                                        }
                                    }
                                }
                            }
                        }
                        setIsDownloading(false);
                    }, 'image/png');
                }
                // Strategy 2: Data URL Open (Mobile Fallback)
                else if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    alert('Generating QR... Please long-press the image to SAVE TO GALLERY.');
                    const newWindow = window.open();
                    if (newWindow) {
                        newWindow.document.write(`<img src="${dataUrl}" style="width:100%; height:auto;" />`);
                        newWindow.document.write('<p style="text-align:center; font-family:sans-serif; margin-top:20px;"><b>Long-press the image to save to your gallery</b></p>');
                    } else {
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = dataUrl;
                        link.click();
                    }
                    setIsDownloading(false);
                }
                // Strategy 3: Standard Download (Desktop)
                else {
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = dataUrl;
                    link.click();
                    setIsDownloading(false);
                }
            } catch (error) {
                console.error('Canvas processing failed:', error);
                alert('Connection issue. Please long-press the QR code directly to save.');
                setIsDownloading(false);
            }
        };

        img.onerror = () => {
            alert('Failed to process QR for download. Please try long-pressing the original image to save.');
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

            <div className="p-6">
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
                        <section className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50 text-center">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">{t('scan_pay')}</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-8">{t('secure_qr')}</p>

                            {cartState?.paymentQrUrl ? (
                                <>
                                    <div className="aspect-square bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-center p-4 mb-4 relative group overflow-hidden">
                                        <img src={cartState.paymentQrUrl} alt="Store Payment QR" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px]">
                                            <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold">{t('zoom_qr')}</button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadQR}
                                        disabled={isDownloading}
                                        className="w-full h-12 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all mb-4 border border-gray-100"
                                    >
                                        <Download size={18} />
                                        {isDownloading ? 'Processing...' : 'SAVE QR TO GALLERY'}
                                    </button>
                                </>
                            ) : (
                                <div className="aspect-square bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 mb-8">
                                    <QrCode size={64} className="text-gray-300 mb-4" />
                                    <p className="text-sm font-bold text-gray-500">QR Code not provided</p>
                                    <p className="text-xs text-gray-400 mt-2">Please contact the seller for payment.</p>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-2 mb-10">
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
                                    className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[2xl] flex items-center justify-center shadow-lg shadow-green-100 active:scale-[0.98] transition-all disabled:opacity-50"
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
                    <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center justify-center pt-20 text-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-1000 ${isPaid ? 'bg-[#25D366] text-white scale-110 shadow-2xl shadow-green-200' : 'bg-gray-100 text-gray-300 animate-pulse'}`}>
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">
                            {isPaid ? t('payment_confirmed') : t('verifying_payment')}
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] mb-12">
                            {isPaid ? t('order_prepared') : t('checking_txn')}
                        </p>

                        {isPaid && (
                            <div className="w-full max-w-xs space-y-3">
                                {waLink && (
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[24px] flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                                    >
                                        <MessageCircle size={18} />
                                        Send to WhatsApp
                                    </a>
                                )}
                                <Link
                                    href="/wallet"
                                    className="w-full h-16 bg-gray-900 text-white font-bold rounded-[24px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
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
