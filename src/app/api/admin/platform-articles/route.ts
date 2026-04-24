import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const articles = await prisma.platformArticle.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json({ success: true, articles });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
