'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import BottomNav from '@/components/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Manual Service Worker registration for PWA reliability
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            const registerSW = () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => console.log('SW registered'),
                    (error) => console.log('SW registration failed: ', error)
                );
            };

            if (document.readyState === 'complete') {
                registerSW();
            } else {
                window.addEventListener('load', registerSW);
            }
        }

        // Catch PWA Install Prompt
        const handlePrompt = (e: any) => {
            e.preventDefault();
            (window as any).deferredPrompt = e;
            // Dispatch a custom event to notify components that install is available
            window.dispatchEvent(new Event('pwa-installable'));
        };

        window.addEventListener('beforeinstallprompt', handlePrompt);
        return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
    }, []);

    // Pages where we don't want the bottom nav (Landing Page, Login, Shop pages, and dynamic store slugs)
    const reservedPaths = ['group', 'admin', 'api', 'billing', 'dashboard', 'login', 'onboarding', 'orders', 'products', 'reseller', 'wallet', 'tools', 'shop', 'analytics', 'settings', 'checkout', 'privacy', 'terms'];
    const pathParts = pathname.split('/').filter(Boolean);
    const isStorePage = pathParts.length > 0 && !reservedPaths.includes(pathParts[0]);

    const hideNav = pathname === '/' || pathname === '/login' || isStorePage || pathname.startsWith('/shop');

    return (
        <>
            <main>{children}</main>
            {!hideNav && <BottomNav />}
        </>
    );
}
