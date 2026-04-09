import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KedaiChat',
        short_name: 'KedaiChat',
        description: 'Transform your business with KedaiChat - The ultimate WhatsApp OS.',
        id: '/?v=2',
        start_url: '/?v=2',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#25D366',
        categories: ['business', 'productivity', 'utilities'],
        shortcuts: [
            {
                name: 'Dashboard',
                url: '/dashboard',
                icons: [{ src: '/logo.png', sizes: '192x192' }]
            },
            {
                name: 'Orders',
                url: '/orders',
                icons: [{ src: '/logo.png', sizes: '192x192' }]
            }
        ],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
