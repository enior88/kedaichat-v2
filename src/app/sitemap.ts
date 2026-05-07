import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://kedaichat.online';

    // Fetch all non-archived stores with error handling for build environment
    let storeUrls: any[] = [];
    try {
        const stores = await prisma.store.findMany({
            where: { archived: false },
            select: { slug: true, updatedAt: true },
            take: 100 // Limit for sitemap safety
        });

        storeUrls = stores.map((store) => ({
            url: `${baseUrl}/shop/${store.slug}`,
            lastModified: store.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Failed to fetch stores for sitemap:', error);
        // During build, the DB might not be reachable. We continue with static URLs.
    }

    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/onboarding`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
    ];

    return [...staticUrls, ...storeUrls];
}
