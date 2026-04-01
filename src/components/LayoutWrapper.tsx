'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Pages where we don't want the bottom nav (Landing Page, Login, Shop pages)
    const hideNav = pathname === '/' || pathname === '/login' || pathname.startsWith('/shop');

    return (
        <>
            <main>{children}</main>
            {!hideNav && <BottomNav />}
        </>
    );
}
