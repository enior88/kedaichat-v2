'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, ClipboardList, Package, Users, Settings, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { isAdmin } = useLanguage();

    const navItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Orders', icon: ClipboardList, path: '/orders' },
        { name: 'Products', icon: Package, path: '/products' },
        { name: 'Customers', icon: Users, path: '/reseller' },
        { name: 'Tools', icon: Settings, path: '/tools' },
    ];

    if (isAdmin) {
        navItems.push({ name: 'Admin', icon: ShieldCheck, path: '/admin' });
    }

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center h-20 px-4 pb-4 z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`flex flex-col items-center justify-center space-y-1 ${isActive ? 'text-[#25D366]' : 'text-gray-400'}`}
                    >
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
