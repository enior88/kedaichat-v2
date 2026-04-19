'use client';

import React, { useState } from 'react';
import { Store, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Onboarding() {
    const router = useRouter();
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const planId = searchParams?.get('plan') || 'FREE';
    const receiptUrl = searchParams?.get('receipt') || '';

    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        whatsapp: '',
        email: '',
        password: '',
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: formData.businessName,
                    category: formData.category,
                    whatsappNumber: formData.whatsapp,
                    email: formData.email,
                    password: formData.password,
                    planId,
                    receiptUrl
                }),
            });

            const data = await response.json();
            if (data.success) {
                setStep(6);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-[#F8F9FA] to-[#E9ECEF] flex flex-col items-center p-6 font-inter pt-14 pb-32">
            <div className="w-full max-w-md flex items-center justify-between mb-8 animate-in fade-in duration-700">
                <div className="w-[42px] h-[42px] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                    <img src="/logo.png" alt="KedaiChat Logo" className="w-full h-full object-cover" />
                </div>
                <LanguageToggle />
            </div>

            {/* Progress */}
            <div className="w-full max-w-md h-1.5 bg-gray-200/50 rounded-full mb-10 flex overflow-hidden shadow-inner">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 transition-all duration-500 ease-out ${step >= s ? 'bg-[#25D366]' : 'bg-transparent'}`}
                    />
                ))}
            </div>

            <div className="w-full max-w-md">
                {step > 1 && step < 6 && (
                    <button onClick={handleBack} className="mb-6 p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-white">
                        <ArrowLeft size={20} />
                    </button>
                )}

                {step === 1 && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h1 className="text-[28px] leading-tight font-black text-gray-900 mb-3 tracking-tight">{t('ob_store_name_title')}</h1>
                        <p className="text-[#25D366] font-bold text-[11px] uppercase tracking-[0.2em] mb-10">{t('ob_store_name_desc')}</p>
                        <input
                            type="text"
                            placeholder={t('ob_store_name_placeholder')}
                            className="premium-input text-lg bg-white/60 focus:bg-white shadow-inner h-14 rounded-2xl px-5 w-full border-2 border-transparent focus:border-[#25D366] transition-all outline-none text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            autoFocus
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h1 className="text-[28px] leading-tight font-black text-gray-900 mb-3 tracking-tight">{t('ob_category_title')}</h1>
                        <p className="text-[#25D366] font-bold text-[11px] uppercase tracking-[0.2em] mb-8">{t('ob_category_desc')}</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'Food', label: t('cat_food') },
                                { id: 'Fashion', label: t('cat_fashion') },
                                { id: 'Grocery', label: t('cat_grocery') },
                                { id: 'Services', label: t('cat_services') }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setFormData({ ...formData, category: cat.id });
                                        setTimeout(() => handleNext(), 150); // Small delay for visual feedback
                                    }}
                                    className={`p-5 rounded-[24px] border-2 transition-all duration-200 text-left font-bold active:scale-[0.96] ${formData.category === cat.id
                                        ? 'border-[#25D366] bg-green-50/80 text-[#25D366] shadow-sm'
                                        : 'border-transparent bg-white/60 shadow-sm text-gray-600 hover:border-gray-100 hover:bg-white'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center transition-colors ${formData.category === cat.id ? 'bg-[#25D366] text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>
                                        <Store size={18} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[15px]">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h1 className="text-[28px] leading-tight font-black text-gray-900 mb-3 tracking-tight">{t('ob_whatsapp_title')}</h1>
                        <p className="text-[#25D366] font-bold text-[11px] uppercase tracking-[0.2em] mb-10">{t('ob_whatsapp_desc')}</p>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[15px]">+60</span>
                            <input
                                type="tel"
                                placeholder="123 456 789"
                                className="premium-input pl-[60px] text-[16px] tracking-wide bg-white/60 focus:bg-white shadow-inner h-14 rounded-2xl w-full border-2 border-transparent focus:border-[#25D366] transition-all outline-none text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h1 className="text-[28px] leading-tight font-black text-gray-900 mb-3 tracking-tight">{t('ob_email_title')}</h1>
                        <p className="text-[#25D366] font-bold text-[11px] uppercase tracking-[0.2em] mb-10">{t('ob_email_desc')}</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder={t('ob_email_placeholder')}
                                className="premium-input px-5 text-[15px] bg-white/60 focus:bg-white shadow-inner h-14 rounded-2xl w-full border-2 border-transparent focus:border-[#25D366] transition-all outline-none text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h1 className="text-[28px] leading-tight font-black text-gray-900 mb-3 tracking-tight">{t('ob_password_title')}</h1>
                        <p className="text-[#25D366] font-bold text-[11px] uppercase tracking-[0.2em] mb-10">{t('ob_password_desc')}</p>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="premium-input px-5 text-[16px] tracking-widest bg-white/60 focus:bg-white shadow-inner h-14 rounded-2xl w-full border-2 border-transparent focus:border-[#25D366] transition-all outline-none text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[32px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-white animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center justify-center text-center mt-4">
                        <div className="w-20 h-20 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-6 shadow-xl shadow-green-200">
                            <Check size={36} strokeWidth={3} />
                        </div>
                        <h1 className="text-[26px] font-black text-gray-900 mb-3 tracking-tight leading-tight">{t('ob_welcome_title')}</h1>
                        <p className="text-gray-500 font-medium mb-8 text-[14px] leading-relaxed max-w-[200px]">{t('ob_welcome_subtitle')}</p>

                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 w-full">
                            <p className="text-[13px] font-bold text-gray-900">
                                {t('ob_welcome_action')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-center w-full">
                    {step < 5 && (
                        <button
                            disabled={(step === 1 && !formData.businessName) || (step === 2 && !formData.category) || (step === 3 && !formData.whatsapp)}
                            onClick={handleNext}
                            className="w-full h-14 max-w-[280px] bg-gray-900 text-white text-[15px] font-bold rounded-[20px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800"
                        >
                            {t('ob_continue')}
                            <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    )}

                    {step === 5 && (
                        <button
                            disabled={!formData.password || isLoading}
                            onClick={handleFinish}
                            className="w-full h-14 max-w-[280px] bg-[#25D366] text-white text-[15px] font-bold rounded-[20px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,211,102,0.3)] disabled:opacity-50 active:scale-[0.98] transition-all hover:bg-[#20bd5a]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {t('ob_launch_store')}
                                    <ChevronRight size={18} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    )}

                    {step === 6 && (
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full h-14 max-w-[280px] bg-gray-900 text-white text-[15px] font-bold rounded-[20px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all hover:bg-gray-800"
                        >
                            {t('ob_go_dashboard')}
                            <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
