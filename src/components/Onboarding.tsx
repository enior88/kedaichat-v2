'use client';

import React, { useState } from 'react';
import { Store, ChevronRight, Check, Camera, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { useSearchParams } from 'next/navigation';

export default function Onboarding() {
    console.log('Onboarding component rendering');
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    console.log('Onboarding: searchParams initialized');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const planId = searchParams?.get('plan') || 'FREE';
    const receiptUrl = searchParams?.get('receipt') || '';

    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        whatsapp: '',
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
                    password: formData.password,
                    planId,
                    receiptUrl
                }),
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = '/dashboard';
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
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center p-6 font-inter pt-12">
            <div className="w-full max-w-md flex items-center justify-between mb-8 animate-in fade-in duration-700">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                    <img src="/logo.png" alt="KedaiChat Logo" className="w-full h-full object-cover" />
                </div>
                <LanguageToggle />
            </div>

            {/* Progress */}
            <div className="w-full max-w-md h-1.5 bg-gray-100 rounded-full mb-12 flex overflow-hidden shadow-inner">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-[#25D366]' : 'bg-transparent'}`}
                    />
                ))}
            </div>

            <div className="w-full max-w-md">
                {step > 1 && (
                    <button onClick={handleBack} className="mb-6 p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                )}

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('ob_store_name_title')}</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">{t('ob_store_name_desc')}</p>
                        <input
                            type="text"
                            placeholder={t('ob_store_name_placeholder')}
                            className="premium-input text-lg"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            autoFocus
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('ob_category_title')}</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">{t('ob_category_desc')}</p>
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
                                        handleNext();
                                    }}
                                    className={`p-6 rounded-[24px] border-2 transition-all text-left font-bold ${formData.category === cat.id
                                        ? 'border-[#25D366] bg-green-50/50 text-[#25D366]'
                                        : 'border-transparent bg-white shadow-sm text-gray-500 hover:border-gray-100'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center ${formData.category === cat.id ? 'bg-[#25D366] text-white' : 'bg-gray-50'}`}>
                                        <Store size={16} />
                                    </div>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('ob_whatsapp_title')}</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">{t('ob_whatsapp_desc')}</p>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+60</span>
                            <input
                                type="tel"
                                placeholder="123456789"
                                className="premium-input pl-16"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{t('ob_password_title')}</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">{t('ob_password_desc')}</p>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="premium-input pl-6"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                <div className="mt-12">
                    {step < 4 && (
                        <button
                            disabled={(step === 1 && !formData.businessName) || (step === 2 && !formData.category) || (step === 3 && !formData.whatsapp)}
                            onClick={handleNext}
                            className="w-full h-16 bg-gray-900 text-white font-bold rounded-[24px] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-xl shadow-gray-200"
                        >
                            {t('ob_continue')}
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {step === 4 && (
                        <button
                            disabled={!formData.password || isLoading}
                            onClick={handleFinish}
                            className="w-full h-16 bg-[#25D366] text-white font-bold rounded-[24px] flex items-center justify-center gap-2 shadow-lg shadow-green-100 disabled:opacity-50 active:scale-95 transition-all"
                        >
                            {isLoading ? t('ob_launching') : t('ob_launch_store')}
                            {!isLoading && <ChevronRight size={20} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
