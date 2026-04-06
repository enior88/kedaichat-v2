import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KedaiChat',
        short_name: 'KedaiChat',
        description: 'Transform your business with KedaiChat - The ultimate WhatsApp OS.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#25D366',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
