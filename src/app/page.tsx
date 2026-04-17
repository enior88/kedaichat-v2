import React, { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LandingPageClient = dynamic(() => import('@/components/LandingPageClient'), {
    loading: () => <div className="min-h-screen bg-white" />
});

const OnboardingCarousel = dynamic(() => import('@/components/OnboardingCarousel'), {
    loading: () => <div className="min-h-screen bg-[#F9FAFB]" />
});

export const metadata: Metadata = {
    title: "KedaiChat - WhatsApp Business Shop & Order Management",
    description: "WhatsApp-first Business OS. Manage orders, resellers, and group orders via WhatsApp.",
};

export default function LandingPage({
    searchParams
}: {
    searchParams: { v?: string }
}) {
    // Server-side check for PWA param to avoid landing page flash
    const fromPwa = searchParams.v === '2';

    if (fromPwa) {
        return (
            <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB]" />}>
                <OnboardingCarousel />
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LandingPageClient />
        </Suspense>
    );
}
