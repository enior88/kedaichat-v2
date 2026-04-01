'use client';

import React, { useState, useRef, Suspense } from 'react';
import { ShieldCheck, QrCode, Upload, Check, ChevronRight, X, ArrowLeft, Download } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams?.get('plan') || 'BASIC';

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [adminBankQrUrl, setAdminBankQrUrl] = useState<string | null>(null);
    const [isLoadingQr, setIsLoadingQr] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const plans = {
        BASIC: { name: 'Basic Plan', price: '29' },
        PRO: { name: 'Pro Plan', price: '49' },
    };

    const currentPlan = plans[planId as keyof typeof plans] || plans.BASIC;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            await uploadReceipt(selectedFile);
        }
    };

    const uploadReceipt = async (selectedFile: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setReceiptUrl(data.fileUrl); // Store reference for later
            } else {
                alert('Failed to upload receipt. Please try again.');
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            alert('Upload error.');
            setFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleContinue = () => {
        if (!receiptUrl) return;
        router.push(`/onboarding?plan=${planId}&receipt=${encodeURIComponent(receiptUrl)}`);
    };

    const handleDownloadQR = () => {
        if (!adminBankQrUrl) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions for high-quality card (800x1100)
        canvas.width = 800;
        canvas.height = 1100;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = adminBankQrUrl;

        img.onload = () => {
            // 1. Background Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f3f4f6');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Card Decoration
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(40, 40, 720, 1020, 60);
            else ctx.rect(40, 40, 720, 1020);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 3. Header Branding
            ctx.fillStyle = '#111827';
            ctx.font = '900 48px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('KedaiChat', canvas.width / 2, 140);

            ctx.fillStyle = '#25D366';
            ctx.font = 'bold 24px Inter, system-ui, sans-serif';
            ctx.fillText('OFFICIAL PAYMENT CARD', canvas.width / 2, 185);

            // 4. Instructions
            ctx.fillStyle = '#6B7280';
            ctx.font = '500 20px Inter, system-ui, sans-serif';
            ctx.fillText('Scan this QR code with any banking app', canvas.width / 2, 230);

            // 5. QR Code Area
            const qrSize = 560;
            const qrX = (canvas.width - qrSize) / 2;
            const qrY = 280;

            ctx.strokeStyle = '#f3f4f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

            // 6. Footer Branding
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 32px Inter, system-ui, sans-serif';
            ctx.fillText('kedaichat.online', canvas.width / 2, 950);

            ctx.fillStyle = '#9CA3AF';
            ctx.font = '500 18px Inter, system-ui, sans-serif';
            ctx.fillText('Automated Merchant OS', canvas.width / 2, 990);

            // 7. Download
            const link = document.createElement('a');
            link.download = `KedaiChat-Payment-${planId}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        };

        img.onerror = () => {
            alert('Failed to process QR for download. Please try long-pressing the image to save.');
        };
    };

    React.useEffect(() => {
        const fetchAdminBankQr = async () => {
            try {
                const res = await fetch('/api/public/settings');
                if (res.ok) {
                    const data = await res.json();
                    setAdminBankQrUrl(data.adminBankQrUrl || null);
                }
            } catch (error) {
                console.error('Failed to fetch admin bank QR:', error);
            } finally {
                setIsLoadingQr(false);
            }
        };
        fetchAdminBankQr();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-6 font-inter flex flex-col items-center justify-center py-12">
            <button onClick={() => router.back()} className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-gray-50">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Upgrade to {currentPlan.name}</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Pay via Bank QR / DuitNow</p>
                </div>

                <div
                    onClick={() => {
                        if (!adminBankQrUrl) {
                            alert('Administrator has not uploaded a QR code yet. Please upload it in your Admin Panel > Settings.');
                        }
                    }}
                    className="aspect-square bg-white rounded-[24px] border border-gray-100 flex flex-col items-center justify-center p-2 mb-6 relative overflow-hidden shadow-inner cursor-pointer hover:border-[#25D366] transition-all group"
                >
                    {isLoadingQr ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-400 font-medium">Loading QR...</p>
                        </div>
                    ) : (adminBankQrUrl || receiptUrl) ? (
                        <img
                            src={adminBankQrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Please%20Upload%20QR%20in%20Admin'}
                            alt="DuitNow QR Payment"
                            className="w-full h-full object-contain rounded-2xl transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <QrCode size={48} className="mx-auto text-gray-200 mb-2 group-hover:text-[#25D366] transition-colors" />
                            <p className="text-sm font-bold text-gray-400">Scan QR to Pay</p>
                            <p className="text-[10px] text-gray-400 mt-1">Please contact admin for QR</p>
                        </div>
                    )}
                </div>

                {adminBankQrUrl && (
                    <button
                        onClick={handleDownloadQR}
                        className="w-full h-12 mt-2 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg mb-8"
                    >
                        <Download size={20} />
                        SAVE QR TO GALLERY
                    </button>
                )}

                <div className="bg-green-50 rounded-2xl p-5 mb-8 text-center text-[#128C7E]">
                    <p className="text-sm font-bold mb-1">Total to Pay</p>
                    <p className="text-3xl font-black">RM {currentPlan.price}<span className="text-sm text-[#25D366]">.00</span></p>
                </div>

                {/* Upload Section */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Upload Receipt proof</h3>

                    {!file ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
                        >
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Tap to upload proof</p>
                        </div>
                    ) : (
                        <div className="h-24 bg-green-50 border-2 border-[#25D366] rounded-2xl flex items-center justify-between px-4 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Check size={20} className="text-white" />
                                </div>
                                <div className="truncate pr-8">
                                    <p className="font-bold text-gray-900 text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{uploading ? 'Uploading...' : 'Upload complete'}</p>
                                </div>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={() => { setFile(null); setReceiptUrl(null); }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors absolute right-2"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <button
                    disabled={!receiptUrl || uploading}
                    onClick={handleContinue}
                    className="w-full h-14 bg-[#25D366] text-white font-bold rounded-[2xl] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-300"
                >
                    I've Paid - Continue
                    <ChevronRight size={18} />
                </button>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 text-center">
                <ShieldCheck size={14} className="inline mr-1" />
                Payments are securely processed and automatically verified
            </p>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
