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

        // 3. Generate content using AI
        const aiContent = await generateMarketingContent(
            store.name,
            productNames,
            store.category || 'General Store'
        );

        // Determine the visual URL
        // Priority: 1. Store Logo, 2. Product Image, 3. Dynamic AI Generated Image, 4. Static Fallback
        let visualUrl = store.logoUrl || store.products.find((p: any) => p.imageUrl)?.imageUrl;

        if (!visualUrl && aiContent.imagePrompt) {
            // Generate a unique image using Pollinations.ai based on the AI prompt
            const encodedPrompt = encodeURIComponent(aiContent.imagePrompt);
            visualUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=1080&height=1080&seed=${Date.now()}`;
        }

        if (!visualUrl) {
            visualUrl = "https://kedaichat.online/images/growth-default.jpg";
        }

        const storeUrl = `https://kedaichat.online/shop/${store.slug}`;
        const fullMessage = `${aiContent.headline}\n\n${aiContent.caption}\n\n🛒 Shop here: ${storeUrl}\n\n${aiContent.hashtags.join(' ')}`;

        // 4. Post to Meta (Facebook & Instagram)
        console.log(`🤖 Marketing Agent: Posting for ${store.name}...`);

        const fbPromise = postToFacebookPage(fullMessage, visualUrl);
        const igPromise = postToInstagramFeed(fullMessage, visualUrl);

        const [fbResult, igResult] = await Promise.all([fbPromise, igPromise]);

        // 5. Persist the marketing post record
        const fbError = !fbResult.success ? fbResult.error : null;
        const igError = !igResult.success ? igResult.error : null;
        const totalError = [fbError, igError].filter(Boolean).join(' | ');

        const post = await prisma.marketingPost.create({
            data: {
                headline: aiContent.headline,
                caption: aiContent.caption,
                hashtags: aiContent.hashtags.join(' '),
                seoTitle: aiContent.seoTitle,
                seoDescription: aiContent.seoDescription,
                visualUrl: visualUrl,
                fbPostId: fbResult.success ? fbResult.id : null,
                igPostId: igResult.success ? igResult.id : null,
                status: (fbResult.success || igResult.success) ? 'SUCCESS' : 'FAILED',
                errorMessage: totalError || null,
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
            status: post.status,
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
