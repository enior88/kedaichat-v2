import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNudgeEmail } from '@/lib/email';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // Basic security using a secret key
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Find stores created more than 24 hours ago
        // that have 0 products and haven't been nudged yet
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const inactiveStores = await prisma.store.findMany({
            where: {
                createdAt: { lt: twentyFourHoursAgo },
                lastNudgeAt: null,
                products: {
                    none: {}
                }
            },
            include: {
                owner: true
            }
        });

        const results = [];

        for (const store of inactiveStores) {
            if (store.owner.email) {
                const res = await sendNudgeEmail(
                    store.owner.email,
                    store.owner.name || store.name,
                    store.slug
                );

                if (res.success) {
                    // Mark as nudged so we don't send it again
                    await prisma.store.update({
                        where: { id: store.id },
                        data: { lastNudgeAt: new Date() }
                    });
                    results.push({ store: store.slug, email: store.owner.email, status: 'sent' });
                } else {
                    results.push({ store: store.slug, email: store.owner.email, status: 'failed', error: res.error });
                }
            }
        }

        return NextResponse.json({
            success: true,
            processedCount: results.length,
            details: results
        });

    } catch (error: any) {
        console.error('CRON Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
