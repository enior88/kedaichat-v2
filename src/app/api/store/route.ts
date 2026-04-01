import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    const store = await prisma.store.findUnique({
        where: { slug },
        include: {
            products: {
                where: { active: true }
            },
            subscription: true
        }
    });

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    return NextResponse.json(store);
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const data = await req.json();

        const updatedStore = await prisma.store.update({
            where: { id: store.id },
            data: {
                name: data.businessName,
                whatsappNumber: data.whatsappNumber,
                slug: data.slug,
                logoUrl: data.storeLogo,
                paymentQrUrl: data.paymentQrUrl,
                // description: data.description // Removed due to DB migration failure
            }
        });

        return NextResponse.json({ success: true, store: updatedStore });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        // Hard delete the store and its relations (cascades should be handled by schema or manually)
        // For now, we perform a simple delete. Relations like Products, Orders, etc. should be deleted.
        // Prisma schema doesn't have explicit cascades yet, so we'll do a simple delete.
        // NOTE: If there are foreign key constraints, this might fail unless cascades are in place.
        await prisma.store.delete({ where: { id: store.id } });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
