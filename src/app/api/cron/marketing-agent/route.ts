import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMarketingContent } from '@/lib/gemini';
import { postToFacebookPage, postToInstagramFeed } from '@/lib/meta';

export async function GET(req: NextRequest) {
    // 1. Verify Cron Secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Select a target shop for marketing
        const stores = await prisma.store.findMany({
            where: {
                archived: false,
            },
            include: {
                products: {
                    where: { active: true },
                    take: 5,
                    select: { name: true, imageUrl: true }
                }
            }
        });

        if (stores.length === 0) {
            return NextResponse.json({ message: 'No stores available for marketing' });
        }

        // Pick a random store
        const store = stores[Math.floor(Math.random() * stores.length)];
        const productNames = store.products.map((p: any) => p.name);
        // Use store logo or first product image as visual
        const visualUrl = store.logoUrl || store.products.find((p: any) => p.imageUrl)?.imageUrl || "https://kedaichat.online/images/growth-default.jpg";

        // 3. Generate content using AI
        const aiContent = await generateMarketingContent(
            store.name,
            productNames,
            store.category || 'General Store'
        );

        const storeUrl = `https://kedaichat.online/shop/${store.slug}`;
        const fullMessage = `${aiContent.headline}\n\n${aiContent.caption}\n\n🛒 Shop here: ${storeUrl}\n\n${aiContent.hashtags.join(' ')}`;

        // 4. Post to Meta (Facebook & Instagram)
        console.log(`🤖 Marketing Agent: Posting for ${store.name}...`);

        const fbPromise = postToFacebookPage(fullMessage, visualUrl);
        const igPromise = postToInstagramFeed(fullMessage, visualUrl);

        const [fbResult, igResult] = await Promise.all([fbPromise, igPromise]);

        // 5. Persist the marketing post record
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

        // 6. Update Store with AI summary if empty
        if (!store.aiDescription) {
            await prisma.store.update({
                where: { id: store.id },
                data: {
                    aiDescription: aiContent.headline,
                    isFeatured: true
                }
            });
        }

        return NextResponse.json({
            status: 'success',
            store: store.name,
            facebook: fbResult.success ? 'ok' : fbResult.error,
            instagram: igResult.success ? 'ok' : igResult.error,
            post: post.id
        });

    } catch (error) {
        console.error('Marketing Agent Error:', error);
        return NextResponse.json({ error: 'Failed to process marketing automation' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
