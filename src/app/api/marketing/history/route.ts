import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const store = await prisma.store.findFirst({
            where: { ownerId: session.userId }
        });

        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const posts = await prisma.marketingPost.findMany({
            where: { storeId: store.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return NextResponse.json(posts);

    } catch (error) {
        console.error('History Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
