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
            subtext: "From home-based to street pop-ups — launch your store in under a minute.",
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
        <div className="fixed inset-0 z-[200] bg-[#F9FAFB] flex flex-col font-inter">
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
                <div className="flex-[1.5] flex flex-col items-center justify-end relative px-2 min-h-0">
                    <div className="w-full relative flex items-center justify-center scale-90 sm:scale-100 h-full">
                        {/* Screen 1 Visual: Floating Store Card */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="w-60 h-72 bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 flex flex-col p-6 space-y-4 overflow-hidden relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#335F4B] flex items-center justify-center overflow-hidden">
                                        <img src="/logo.png" alt="" className="w-5 h-5 object-contain invert" />
                                    </div>
                                    <div className="h-2 w-20 bg-gray-100 rounded-full" />
                                </div>
                                <div className="flex-1 w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1517520216436-bb515714041d?auto=format&fit=crop&q=80"
                                        alt="Motorcycle Coffee Entrepreneur"
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                                </div>
                                <div className="h-2.5 w-full bg-[#335F4B]/10 rounded-full" />

                                {/* Floating Overlay Note */}
                                <div className="absolute right-4 bottom-10 w-28 bg-white rounded-2xl p-3 shadow-xl border border-gray-50 animate-bounce-subtle">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
                                        <div className="h-1.5 w-10 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#335F4B]" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Screen 2 Visual: Product Cards Stack */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="relative w-full max-w-[260px]">
                                {/* Back Card */}
                                <div className="absolute -top-4 left-6 right-6 h-56 bg-gray-100 rounded-[28px] transform rotate-[-4deg] opacity-50" />
                                {/* Main Card */}
                                <div className="relative w-60 h-64 bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-4">
                                    <div className="w-full h-36 bg-[#F2F4F7] rounded-2xl overflow-hidden mb-3 relative">
                                        <img src="/kuih-gula-melaka.jpg" alt="Kuih Gula Melaka" className="w-full h-full object-cover opacity-90" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">Kuih Gula Melaka</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Traditional Dessert</p>
                                    <div className="absolute right-3 bottom-3 w-16 h-7 bg-white rounded-full shadow-md border border-gray-50 flex items-center px-1.5 gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-[#335F4B] scale-75" />
                                        <span className="text-[9px] font-bold text-gray-500">Edit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Screen 3 Visual: Share Link / Chat UI */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${step === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            <div className="w-64 h-72 bg-white rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-gray-100/30 p-5 flex flex-col space-y-5">
                                {/* Store Label */}
                                <div className="flex gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#D1FAE5] flex items-center justify-center" />
                                    <div className="space-y-1.5 pt-1">
                                        <div className="h-2 w-16 bg-gray-200 rounded-full" />
                                        <div className="h-1.5 w-10 bg-gray-100 rounded-full" />
                                    </div>
                                </div>

                                {/* Link Bubble */}
                                <div className="bg-[#F8F9FA] p-3 rounded-2xl flex items-center justify-between border border-gray-100/50">
                                    <span className="text-[9px] font-medium text-gray-400">kedaichat.online/my-shop</span>
                                    <div className="bg-[#335F4B] text-white px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wide">Copy</div>
                                </div>

                                {/* Chat Messages */}
                                <div className="space-y-2.5 pt-1">
                                    <div className="max-w-[80%] bg-[#F2F4F7] p-2.5 rounded-2xl rounded-tl-none">
                                        <div className="h-1.5 w-5/6 bg-gray-300 rounded-full opacity-50 mb-1" />
                                        <div className="h-1.5 w-1/2 bg-gray-300 rounded-full opacity-50" />
                                    </div>
                                    <div className="max-w-[85%] ml-auto bg-[#D1FAE5] p-2.5 rounded-2xl rounded-tr-none relative">
                                        <div className="h-1.5 w-5/6 bg-[#335F4B]/30 rounded-full mb-1" />
                                        <div className="h-1.5 w-2/3 bg-[#335F4B]/30 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Section */}
                <div className="flex-1 flex flex-col items-center justify-start text-center pt-8 px-4">
                    <div className="flex flex-col items-center space-y-4">
                        <h2 className={`text-3xl font-bold text-gray-900 leading-[1.1] transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {currentSlide.headline}
                        </h2>
                        <p className={`text-[#8E8E93] font-medium leading-relaxed max-w-[280px] transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {currentSlide.subtext}
                        </p>
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
