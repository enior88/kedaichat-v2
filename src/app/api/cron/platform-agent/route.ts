import { NextResponse } from 'next/server';
import { generatePlatformArticle } from '@/lib/platform-agent';
import { postToFacebookPage, postToInstagramFeed } from '@/lib/meta';

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

        const { article } = generation;

        // 2. Visual Generation (Simulated for now, would integrate with an AI Image logic)
        // For now, we use a high-quality commerce-related visual
        const sampleImageUrl = "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000";

        // 3. Auto-Post to Facebook & Instagram
        const fullMessage = `${article.title}\n\n${article.content}\n\nJoin us: https://kedaichat.online`;

        const fbPromise = postToFacebookPage(fullMessage, sampleImageUrl);
        const igPromise = postToInstagramFeed(fullMessage, sampleImageUrl);

        const [fbPost, igPost] = await Promise.all([fbPromise, igPromise]);

        return NextResponse.json({
            success: true,
            message: "Platform Marketing Post Created & Shared!",
            articleId: article.id,
            facebook: fbPost.success ? 'ok' : fbPost.error,
            instagram: igPost.success ? 'ok' : igPost.error
        });

    } catch (error: any) {
        console.error("Cron Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
