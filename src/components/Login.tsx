'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Phone, ArrowLeft, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function Login() {
    const { t } = useLanguage() || { t: (key: string) => key };
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [resetPhone, setResetPhone] = useState('');
    const [resetData, setResetData] = useState<{ tempPassword?: string, waLink?: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                // Detect mobile for direct-to-store routing
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

                if (data.isAdmin) {
                    window.location.replace('/admin');
                } else if (isMobile && data.storeSlug) {
                    // Direct to their store catalog on mobile
                    window.location.replace(`/shop/${data.storeSlug}`);
                } else {
                    window.location.replace('/dashboard');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please check your internet.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsappNumber: resetPhone })
            });
            const data = await res.json();
            if (data.success) {
                setResetData(data);
            } else {
                setError(data.error || 'Reset failed');
            }
        } catch (err) {
            setError('Connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyPassword = () => {
        if (!resetData?.tempPassword) return;
        navigator.clipboard.writeText(resetData.tempPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center p-6 font-inter">
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Header */}
                <div className="text-center mt-12 mb-12 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg shadow-green-100">
                        <img src="/logo.png" alt="KedaiChat Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">KedaiChat</h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[2px]">Login to manage your store</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="w-full mb-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-[22px] border border-red-100 animate-in fade-in shake">
                        {error}
                    </div>
                )}

                {/* Form */}
                {!isForgotMode ? (
                    <>
                        <div className="w-full space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email / WhatsApp</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 0123456789"
                                        value={formData.identifier}
                                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                        className="w-full h-16 bg-white border border-gray-100 rounded-[28px] pl-16 pr-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-16 bg-white border border-gray-100 rounded-[28px] pl-16 pr-14 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full text-right mt-4 px-2">
                            <button
                                onClick={() => setIsForgotMode(true)}
                                className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#25D366] transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Primary Action */}
                        <div className="mt-8 w-full">
                            <button
                                disabled={isLoading || !formData.identifier}
                                onClick={handleLogin}
                                className="w-full h-16 bg-[#25D366] text-white font-black rounded-[28px] shadow-2xl shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 text-lg"
                            >
                                {isLoading ? 'Verifying...' : 'Login'}
                                {!isLoading && <ChevronRight size={22} />}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full animate-in slide-in-from-right-4 fade-in duration-300">
                        {resetData ? (
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-[#25D366]">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 mb-2">Temporary Password</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Generated successfully for {resetPhone}</p>

                                <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 flex items-center justify-between mb-8">
                                    <span className="text-2xl font-mono font-black tracking-tighter text-[#25D366]">{resetData.tempPassword}</span>
                                    <button
                                        onClick={copyPassword}
                                        className="p-3 bg-white text-gray-400 rounded-2xl active:scale-90 transition-all shadow-sm"
                                    >
                                        {copied ? <CheckCircle2 size={18} className="text-[#25D366]" /> : <Copy size={18} />}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href={resetData.waLink}
                                        target="_blank"
                                        className="w-full h-16 bg-[#25D366] text-white font-black rounded-[28px] shadow-xl shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Notify via WhatsApp
                                        <ExternalLink size={18} />
                                    </a>
                                    <button
                                        onClick={() => {
                                            setIsForgotMode(false);
                                            setResetData(null);
                                        }}
                                        className="w-full text-[10px] font-black text-gray-300 uppercase tracking-[3px] py-4"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <button
                                    onClick={() => setIsForgotMode(false)}
                                    className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back to Login
                                </button>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                            <input
                                                type="text"
                                                placeholder="e.g. 60123456789"
                                                value={resetPhone}
                                                onChange={(e) => setResetPhone(e.target.value)}
                                                className="w-full h-16 bg-white border border-gray-100 rounded-[28px] pl-16 pr-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all font-bold"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isLoading || !resetPhone}
                                        onClick={handleResetPassword}
                                        className="w-full h-16 bg-[#25D366] text-white font-black rounded-[28px] shadow-2xl shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 text-lg"
                                    >
                                        {isLoading ? 'Processing...' : 'Reset Password'}
                                        {!isLoading && <ChevronRight size={22} />}
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 font-medium leading-relaxed px-4 italic">
                                        We will generate a temporary password that you can use to login.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Setup link */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Don't have a store? {' '}
                        <Link href="/onboarding" className="text-[#25D366] underline decoration-2 underline-offset-4">
                            Create one
                        </Link>
                    </p>


                </div>
            </div>
        </div>
    );
}
