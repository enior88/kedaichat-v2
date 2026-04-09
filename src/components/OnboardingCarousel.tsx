'use client';

import React, { useState } from 'react';
import { Store, Package, Share2, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingCarousel() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const slides = [
        {
            title: "Create Your Store",
            description: "Launch your professional storefront in seconds. Customize your name, logo, and brand color.",
            icon: Store,
            color: "from-blue-500 to-indigo-600",
            lightColor: "bg-blue-50 text-blue-600"
        },
        {
            title: "Add Your Products",
            description: "Upload high-quality photos, set prices, and manage stock levels with ease.",
            icon: Package,
            color: "from-[#25D366] to-[#128C7E]",
            lightColor: "bg-green-50 text-[#25D366]"
        },
        {
            title: "Share & Start Selling",
            description: "Send your store link to customers and start receiving orders directly on WhatsApp.",
            icon: Share2,
            color: "from-purple-500 to-pink-600",
            lightColor: "bg-purple-50 text-purple-600"
        }
    ];

    const next = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            router.push('/login');
        }
    };

    const currentSlide = slides[step];
    const Icon = currentSlide.icon;

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-between font-inter animate-in fade-in duration-700">
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${currentSlide.color} opacity-[0.03] -z-10`} />

            <div className="w-full max-w-md h-full flex flex-col p-8 pt-20">
                {/* Header/Skip */}
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-black tracking-tighter">KedaiChat</span>
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                    >
                        Skip
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className={`${currentSlide.lightColor} w-32 h-32 rounded-[40px] flex items-center justify-center shadow-xl shadow-gray-100 relative`}>
                        <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                            <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-gray-50 flex items-center gap-1">
                                <Zap size={10} className="fill-[#25D366] text-[#25D366]" />
                                <span className="text-[8px] font-black uppercase text-gray-400">Step {step + 1}</span>
                            </div>
                        </div>
                        <Icon size={48} strokeWidth={2.5} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">{currentSlide.title}</h1>
                        <p className="text-gray-500 font-medium leading-relaxed px-4">{currentSlide.description}</p>
                    </div>
                </div>

                {/* Footer / Controls */}
                <div className="space-y-8 pb-12">
                    {/* Indicators */}
                    <div className="flex justify-center gap-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'}`}
                            />
                        ))}
                    </div>

                    {/* Button */}
                    <button
                        onClick={next}
                        className="w-full h-16 bg-gray-900 text-white rounded-[24px] font-black flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 active:scale-95 transition-all group"
                    >
                        {step === slides.length - 1 ? 'Get Started' : 'Next Step'}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
