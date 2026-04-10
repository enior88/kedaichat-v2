import React, { Suspense } from 'react';
import LandingPageClient from '@/components/LandingPageClient';
import OnboardingCarousel from '@/components/OnboardingCarousel';
import { Metadata } from 'next';

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
        return <OnboardingCarousel />;
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LandingPageClient />
        </Suspense>
    );
}
