'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import BottomNav from '@/components/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Manual Service Worker registration for PWA reliability
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('SW registered: ', registration);
                    },
                    (error) => {
                        console.log('SW registration failed: ', error);
                    }
                );
            });
        }
    }, []);

    // Pages where we don't want the bottom nav (Landing Page, Login, Shop pages)
    const hideNav = pathname === '/' || pathname === '/login' || pathname.startsWith('/shop');

    return (
        <>
            <main>{children}</main>
            {!hideNav && <BottomNav />}
        </>
    );
}
