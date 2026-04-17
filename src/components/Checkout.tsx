'use client';

import React, { useState } from 'react';
import { ChevronLeft, QrCode, ShieldCheck, CheckCircle2, Copy, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Checkout({ params }: { params: { name: string } }) {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isPaid, setIsPaid] = useState(false);
    const [cartState, setCartState] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [waLink, setWaLink] = useState('');

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
            // Simulated payment verification time
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate WhatsApp Message
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

            // Post order to database
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

                // Save specific order id to local storage to show in Wallet
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
                localStorage.removeItem('kd_ref'); // clear referral after use

                setStep(2);
                setIsPaid(true);

                // Auto open WhatsApp Link after a brief delay
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
            // Generate WhatsApp Message (Same as payment submit but no delay)
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

            // Post order to database for tracking
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

                // Save to Wallet history
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

                // Open WhatsApp immediately
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

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-inter max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
            {/* Header */}
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
                                <div className="aspect-square bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-center p-4 mb-8 relative group overflow-hidden">
                                    <img src={cartState.paymentQrUrl} alt="Store Payment QR" className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px]">
                                        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold">{t('zoom_qr')}</button>
                                    </div>
                                </div>
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
                                    className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[2xl] flex items-center justify-center shadow-lg shadow-green-100 active:scale-95 transition-all disabled:opacity-50"
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
                            {isPaid
                                ? t('order_prepared')
                                : t('checking_txn')}
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
