'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingCarousel() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const slides = [
        {
            headline: "Create your store in seconds",
            subtext: "Set your name, logo, and brand color — done in under a minute.",
            visualType: 'store'
        },
        {
            headline: "Add products effortlessly",
            subtext: "Upload photos, set prices, and manage everything in one place.",
            visualType: 'products'
        },
        {
            headline: "Start selling instantly",
            subtext: "Share your link and receive orders directly on WhatsApp.",
            visualType: 'sell'
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

    return (
        <div className={`fixed inset-0 z-[200] bg-[#F9FAFB] flex flex-col font-inter transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full max-w-lg mx-auto h-full flex flex-col p-6 pt-12">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain contrast-125" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">KedaiChat</span>
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm font-semibold text-[#335F4B] opacity-80 hover:opacity-100 transition-opacity"
                    >
                        Skip
                    </button>
                </div>

                {/* Visual Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                    <div className="w-full aspect-[4/3] relative flex items-center justify-center">
                        {/* Screen 1 Visual: Floating Store Card */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="w-64 h-80 bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 flex flex-col p-6 space-y-4 overflow-hidden relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                        <img src="/logo.png" alt="" className="w-5 h-5 object-contain invert" />
                                    </div>
                                    <div className="h-2 w-24 bg-gray-100 rounded-full" />
                                </div>
                                <div className="flex-1 w-full bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                                    <div className="w-12 h-10 bg-gray-100 rounded-lg opacity-40" />
                                </div>
                                <div className="h-3 w-full bg-[#335F4B]/10 rounded-full" />

                                {/* Floating Overlay Note */}
                                <div className="absolute right-4 bottom-12 w-32 bg-white rounded-2xl p-3 shadow-xl border border-gray-50 animate-bounce-subtle">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                        <div className="h-1.5 w-12 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#335F4B]" />
                                        <div className="w-3 h-3 rounded-full bg-gray-600" />
                                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Screen 2 Visual: Product Cards Stack */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="relative w-full max-w-[280px]">
                                {/* Back Card */}
                                <div className="absolute -top-4 left-6 right-6 h-64 bg-gray-100 rounded-[28px] transform rotate-[-4deg] opacity-50" />
                                {/* Main Card */}
                                <div className="relative w-64 h-72 bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-4">
                                    <div className="w-full h-44 bg-[#F2F4F7] rounded-2xl overflow-hidden mb-4 relative">
                                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" alt="Sneaker" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Red Runner</h4>
                                    <p className="text-xs text-gray-400 font-medium">Footwear</p>
                                    <div className="absolute right-4 bottom-4 w-20 h-8 bg-white rounded-full shadow-lg border border-gray-50 flex items-center px-2 gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-[#335F4B] rounded-full" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">Edit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Screen 3 Visual: Share Link / Chat UI */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="w-72 h-80 bg-white rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-gray-100/30 p-6 flex flex-col space-y-6">
                                {/* Store Label */}
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                                        <div className="w-5 h-4 bg-[#335F4B] rounded-md opacity-80" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <div className="h-2 w-20 bg-gray-200 rounded-full" />
                                        <div className="h-1.5 w-12 bg-gray-100 rounded-full" />
                                    </div>
                                </div>

                                {/* Link Bubble */}
                                <div className="bg-[#F8F9FA] p-3.5 rounded-2xl flex items-center justify-between border border-gray-100/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-300 rounded-full opacity-40" />
                                        <span className="text-[10px] font-medium text-gray-400">kedaichat.com/my-shop</span>
                                    </div>
                                    <div className="bg-[#335F4B] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide">Copy</div>
                                </div>

                                {/* Chat Messages */}
                                <div className="space-y-3 pt-2">
                                    <div className="max-w-[80%] bg-[#F2F4F7] p-3 rounded-2xl rounded-tl-none">
                                        <div className="h-1.5 w-5/6 bg-gray-300 rounded-full opacity-50 mb-1.5" />
                                        <div className="h-1.5 w-1/2 bg-gray-300 rounded-full opacity-50" />
                                    </div>
                                    <div className="max-w-[85%] ml-auto bg-[#D1FAE5] p-3 rounded-2xl rounded-tr-none relative">
                                        <div className="h-1.5 w-5/6 bg-[#335F4B]/30 rounded-full mb-1.5" />
                                        <div className="h-1.5 w-2/3 bg-[#335F4B]/30 rounded-full" />
                                        <div className="absolute -right-2 bottom-0 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full text-center mt-4">
                        <div className="h-[120px] flex flex-col items-center justify-center px-4 space-y-4">
                            <h2 className={`text-3xl font-bold text-gray-900 leading-[1.1] transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                {currentSlide.headline}
                            </h2>
                            <p className={`text-[#8E8E93] font-medium leading-relaxed max-w-[280px] transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                {currentSlide.subtext}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer and Navigation */}
                <div className="pt-8 pb-10 space-y-10 px-4">
                    {/* Indicators */}
                    <div className="flex justify-center gap-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-6 bg-[#335F4B]' : 'w-1.5 bg-gray-200'}`}
                            />
                        ))}
                    </div>

                    {/* Primary Button */}
                    <button
                        onClick={next}
                        className="w-full h-[64px] bg-[#335F4B] text-white rounded-[24px] font-bold text-[17px] shadow-[0_12px_24px_-8px_rgba(51,95,75,0.4)] active:scale-[0.97] transition-all flex items-center justify-center"
                    >
                        {step === slides.length - 1 ? 'Get Started' : 'Continue'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
