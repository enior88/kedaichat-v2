import { NextResponse } from 'next/server';
import { generatePlatformArticle } from '@/lib/platform-agent';
import { postToFacebookPage, postToInstagramFeed } from '@/lib/meta';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Daily Platform Marketing Agent
 * Runs at 08:00 MYT to grow kedaichat.online
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const authHeader = request.headers.get('authorization');

    // Security check: Accept either Bearer token or ?key=
    const isAuthorized =
        (authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
        (key === process.env.CRON_SECRET);

    if (!isAuthorized && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("🚀 Starting Platform Growth Cycle...");

        // 1. Generate Content
        const generation = await generatePlatformArticle();
        if (!generation.success || !generation.article) {
            throw new Error("Content generation failed: " + generation.error);
        }

        const { article, visualIdea } = generation;

        // 2. Visual Generation
        // Using Pollinations.ai to generate a 1:1 visual based on the article's visualIdea
        // This ensures Instagram compatibility (must be within aspect ratio limits, 1:1 is safe)
        const promptParams = encodeURIComponent(visualIdea || "High-quality conceptual art representing KedaiChat online ecommerce platform growth");
        const dynamicImageUrl = `https://image.pollinations.ai/prompt/${promptParams}?nologo=true&width=1080&height=1080&seed=${Date.now()}`;

        // 3. Auto-Post to Facebook & Instagram
        const fullMessage = `${article.title}\n\n${article.content}\n\nJoin us: https://kedaichat.online`;

        const fbPromise = postToFacebookPage(fullMessage, dynamicImageUrl);
        const igPromise = postToInstagramFeed(fullMessage, dynamicImageUrl);

        const [fbPost, igPost] = await Promise.all([fbPromise, igPromise]);

        const fbError = !fbPost.success ? fbPost.error : null;
        const igError = !igPost.success ? igPost.error : null;
        const totalError = [fbError, igError].filter(Boolean).join(' | ');

        // Update Article with post results and the dynamic image
        await prisma.platformArticle.update({
            where: { id: article.id },
            data: {
                imageUrl: dynamicImageUrl,
                metaStatus: (fbPost.success || igPost.success) ? 'SUCCESS' : 'FAILED',
                metaError: totalError || null,
                fbPostId: fbPost.success ? fbPost.id : null,
                igPostId: igPost.success ? igPost.id : null,
                status: 'PUBLISHED'
            }
        });

        return NextResponse.json({
            success: true,
            message: "Platform Marketing Cycle Complete",
            articleId: article.id,
            facebook: fbPost.success ? 'ok' : fbPost.error,
            instagram: igPost.success ? 'ok' : igPost.error
        });

    } catch (error: any) {
        console.error("Cron Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
