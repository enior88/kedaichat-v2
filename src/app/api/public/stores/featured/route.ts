import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const stores = await prisma.store.findMany({
            where: { archived: false },
            take: 6,
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' }
            ],
            select: {
                name: true,
                slug: true,
                category: true,
                logoUrl: true,
            }
        });

        return NextResponse.json(stores);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
    }
}
