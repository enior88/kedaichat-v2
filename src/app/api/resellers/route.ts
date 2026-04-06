import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function generateRefCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// GET all resellers for this store
export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const resellers = await prisma.reseller.findMany({
            where: { storeId: store.id },
            include: { commissions: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(resellers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - generate a new reseller invite link
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const { name } = await req.json();

        // Generate unique refCode
        let refCode = generateRefCode();
        let exists = await prisma.reseller.findUnique({ where: { refCode } });
        while (exists) {
            refCode = generateRefCode();
            exists = await prisma.reseller.findUnique({ where: { refCode } });
        }

        const reseller = await prisma.reseller.create({
            data: {
                name,
                refCode,
                storeId: store.id
            }
        });

        return NextResponse.json(reseller);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
