import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateMarketingContent } from '@/lib/gemini';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const store = await prisma.store.findFirst({
            where: { ownerId: session.userId },
            include: {
                products: {
                    where: { active: true },
                    take: 5,
                    select: { name: true }
                }
            }
        });

        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const productNames = store.products.map(p => p.name);
        const aiContent = await generateMarketingContent(
            store.name,
            productNames,
            store.category || 'General Store'
        );

        // Optional: Persist this manual generation as a post too
        const post = await prisma.marketingPost.create({
            data: {
                headline: aiContent.headline,
                caption: aiContent.caption,
                hashtags: aiContent.hashtags.join(' '),
                seoTitle: aiContent.seoTitle,
                seoDescription: aiContent.seoDescription,
                storeId: store.id
            }
        });

        const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://kedaichat.online'}/shop/${store.name.toLowerCase().replace(/\s+/g, '-')}`;
        const utmParams = `?utm_source=kedaichat&utm_medium=ai_agent&utm_campaign=growth_marketing`;

        return NextResponse.json({
            ...aiContent,
            postId: post.id,
            shareUrl: `${storeUrl}${utmParams}`
        });

    } catch (error: any) {
        console.error('Manual Marketing Generation Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to generate content',
            details: error.stack
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
