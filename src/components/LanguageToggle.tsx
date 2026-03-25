'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={`flex bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm w-fit ${className}`}>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-[#25D366] text-white shadow-sm' : 'text-gray-400'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('ms')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'ms' ? 'bg-[#25D366] text-white shadow-sm' : 'text-gray-400'
                    }`}
            >
                BM
            </button>
        </div>
    );
}
