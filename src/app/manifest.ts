import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KedaiChat',
        short_name: 'KedaiChat',
        description: 'Transform your business with KedaiChat - The ultimate WhatsApp OS.',
        id: '/',
        start_url: '/',
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
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '384x384',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
