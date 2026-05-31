'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADSENSE_CLIENT = 'ca-pub-7574089831743846';

interface AdSenseContainerProps {
    plan?: string;
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    variant?: 'mobile' | 'desktop' | 'footer';
}

export default function AdSenseContainer({ plan = 'FREE', slot = '1234567890', format = 'auto', variant = 'mobile' }: AdSenseContainerProps) {
    const router = useRouter();
    const isMobile = variant === 'mobile';

    // Only show ads for FREE plan stores (or stores with no subscription)
    if (plan && plan !== 'FREE') return null;

    return (
        <div className={`w-full flex flex-col items-center ${isMobile ? 'my-3 px-4' : 'my-4'}`}>
            {/* Real AdSense Unit */}
            <div className={`w-full bg-gray-50/60 border border-dashed border-gray-200 rounded-2xl overflow-hidden relative ${isMobile ? 'min-h-[100px]' : 'min-h-[120px]'}`}>
                <span className="absolute top-1.5 right-2.5 text-[9px] font-bold text-gray-300 uppercase tracking-widest z-10 pointer-events-none">
                    Sponsored
                </span>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={ADSENSE_CLIENT}
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />
                <AdInit />
            </div>

            {/* Upgrade nudge */}
            <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Ad</span>
                <div className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                <button
                    onClick={() => router.push('/billing')}
                    className="text-[9px] font-bold text-gray-400 hover:text-[#22C55E] transition-colors uppercase tracking-widest underline underline-offset-2"
                >
                    Remove Ads ↗
                </button>
            </div>
        </div>
    );
}

// Separate client component to safely push the ad init
function AdInit() {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // Silently ignore if adsbygoogle is not loaded yet
        }
    }, []);
    return null;
}
