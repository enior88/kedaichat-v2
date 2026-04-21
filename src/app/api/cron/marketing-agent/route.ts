import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateMarketingContent } from '@/lib/gemini';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    // 1. Verify Cron Secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Select a target shop for marketing
        // Priority: Shops with recent orders but not featured in the last 7 days
        // For simplicity: Take a random active shop that hasn't been featured recently
        const stores = await prisma.store.findMany({
            where: {
                archived: false,
                // We could add more filters here, like order count > 0
            },
            include: {
                products: {
                    where: { active: true },
                    take: 5,
                    select: { name: true }
                }
            }
        });

        if (stores.length === 0) {
            return NextResponse.json({ message: 'No stores available for marketing' });
        }

        // Pick a random store
        const store = stores[Math.floor(Math.random() * stores.length)];
        const productNames = store.products.map(p => p.name);

        // 3. Generate content using AI
        const aiContent = await generateMarketingContent(
            store.name,
            productNames,
            store.category || 'General Store'
        );

        // 4. Persist the marketing post
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

        // 5. Update Store with AI summary if empty
        if (!store.aiDescription) {
            await prisma.store.update({
                where: { id: store.id },
                data: {
                    aiDescription: aiContent.headline,
                    isFeatured: true // Auto-feature if the AI has promoted it
                }
            });
        }

        return NextResponse.json({
            status: 'success',
            store: store.name,
            post: post.id
        });

    } catch (error) {
        console.error('Marketing Agent Error:', error);
        return NextResponse.json({ error: 'Failed to process marketing automation' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
