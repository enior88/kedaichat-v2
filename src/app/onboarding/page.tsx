import { Suspense } from 'react';
import Onboarding from '@/components/Onboarding';

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Onboarding />
        </Suspense>
    );
}
