'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, ShieldCheck, Upload, X } from 'lucide-react';
import BottomNav from './BottomNav';

export default function BillingSubscription() {
    const [selectedPlan, setSelectedPlan] = useState('BASIC');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Receipt Upload State
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [adminBankQrUrl, setAdminBankQrUrl] = useState<string | null>('/qr-payment.png');
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const plans = [
        { id: 'FREE', name: 'Free', price: '0', features: ['30 orders per month', 'Basic dashboard', 'Product manager'] },
        { id: 'BASIC', name: 'Basic', price: '29', features: ['Unlimited orders', 'Group order system', 'Reseller links', 'Repeat order button'] },
        { id: 'PRO', name: 'Pro', price: '49', features: ['Analytics dashboard', 'Broadcast tools', 'Advanced reseller system', 'Priority support'] },
    ];

    useEffect(() => {
        const fetchAdminBankQr = async () => {
            try {
                const res = await fetch('/api/public/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.adminBankQrUrl) setAdminBankQrUrl(data.adminBankQrUrl);
                }
            } catch (error) {
                console.error('Failed to fetch admin bank QR:', error);
            }
        };
        fetchAdminBankQr();
    }, []);

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
                setReceiptUrl(data.fileUrl);
            } else {
                alert('Failed to upload receipt');
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
            setFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleVerify = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: selectedPlan,
                    receiptUrl: receiptUrl
                }),
            });

            if (res.ok) {
                setShowSuccess(true);
                setFile(null);
                setReceiptUrl(null);
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit upgrade request');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 font-inter">
            <div className="p-6">
                <h1 className="text-2xl font-black text-gray-900 mb-2">Subscription</h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-8">Choose your power plan</p>

                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-100 p-6 rounded-[28px] animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3 mb-2 text-[#25D366]">
                            <ShieldCheck size={20} />
                            <p className="font-bold text-sm">Payment Verification Sent</p>
                        </div>
                        <p className="text-[10px] text-gray-600 font-medium">Your bank transfer has been automatically verified! Your account is now upgraded and your new features are ready to use. 🚀</p>
                    </div>
                )}

                {/* Plans */}
                <div className="space-y-4 mb-10">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => {
                                setSelectedPlan(plan.id);
                                if (plan.id === 'FREE') {
                                    setFile(null);
                                    setReceiptUrl(null);
                                }
                            }}
                            className={`premium-card !p-6 cursor-pointer transition-all border-2 ${selectedPlan === plan.id ? 'border-[#25D366] bg-green-50/10' : 'border-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-black">RM {plan.price}</span>
                                        <span className="text-[10px] text-gray-400 font-bold pb-1.5 uppercase">/ Month</span>
                                    </div>
                                </div>
                                {selectedPlan === plan.id && (
                                    <div className="bg-[#25D366] text-white p-1 rounded-full">
                                        <Check size={16} />
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-2">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Payment Logic (Simple Bank QR for MVP) */}
                {selectedPlan !== 'FREE' && (
                    <div className="mt-8 bg-white rounded-[32px] p-8 shadow-xl border border-gray-50">
                        <h4 className="text-center font-bold text-gray-900 mb-6">Pay via Bank QR / DuitNow</h4>
                        <div className="aspect-square bg-white rounded-[24px] border border-gray-100 flex flex-col items-center justify-center p-2 mb-6 relative overflow-hidden shadow-inner">
                            <img
                                src={adminBankQrUrl || '/qr-payment.png'}
                                alt="DuitNow QR Payment"
                                className="w-full h-full object-contain rounded-2xl"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/400x400?text=Scan+QR+to+Pay';
                                }}
                            />
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck size={16} className="text-[#25D366]" />
                                <p className="text-xs font-bold text-gray-900">How to pay?</p>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                1. Scan QR with your banking app.<br />
                                2. Pay <b>RM {plans.find(p => p.id === selectedPlan)?.price ?? '0'}</b>.<br />
                                3. We will approve your account within 1 hour.
                            </p>
                        </div>

                        {/* Upload Proof */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Upload Receipt proof</h3>
                            {!file ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all text-center"
                                >
                                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />
                                    <Upload size={24} className="text-gray-400 mb-2" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Tap to upload proof</p>
                                </div>
                            ) : (
                                <div className="h-24 bg-green-50 border-2 border-[#25D366] rounded-2xl flex items-center justify-between px-4 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Check size={20} className="text-white" />
                                        </div>
                                        <div className="truncate pr-8 text-left">
                                            <p className="font-bold text-gray-900 text-sm truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500">{uploading ? 'Uploading...' : 'Upload complete'}</p>
                                        </div>
                                    </div>
                                    {!uploading && (
                                        <button onClick={() => { setFile(null); setReceiptUrl(null); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors absolute right-2">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isSubmitting || !receiptUrl || uploading}
                            className="w-full h-14 bg-gray-900 text-white font-bold rounded-[2xl] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Upgrading...' : "I've Paid - Verify My Payment"}
                            {!isSubmitting && <ChevronRight size={18} />}
                        </button>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
