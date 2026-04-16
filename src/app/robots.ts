import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/dashboard/', '/onboarding/', '/settings/', '/orders/', '/products/', '/billing/', '/wallet/', '/analytics/'],
        },
        sitemap: 'https://kedaichat.online/sitemap.xml',
    };
}
