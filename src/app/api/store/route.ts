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
                category: data.description, // Repurposing unused category field for description
                isDeliveryEnabled: data.isDeliveryEnabled,
                deliveryFee: parseFloat(data.deliveryFee) || 0
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

        // Cascade delete all related records in the correct order before deleting the store.
        await prisma.$transaction(async (tx) => {
            const storeId = store.id;

            // 1. Get product IDs and group order IDs to delete their children first
            const products = await tx.product.findMany({ where: { storeId }, select: { id: true } });
            const productIds = products.map((p) => p.id);

            const groupOrders = await tx.groupOrder.findMany({ where: { storeId }, select: { id: true } });
            const groupOrderIds = groupOrders.map((g) => g.id);

            const resellers = await tx.reseller.findMany({ where: { storeId }, select: { id: true } });
            const resellerIds = resellers.map((r) => r.id);

            // 2. Delete leaf-level records
            if (productIds.length > 0) {
                await tx.groupOrderItem.deleteMany({ where: { productId: { in: productIds } } });
                await tx.orderItem.deleteMany({ where: { productId: { in: productIds } } });
            }
            if (groupOrderIds.length > 0) {
                await tx.groupOrderItem.deleteMany({ where: { groupOrderId: { in: groupOrderIds } } });
            }
            if (resellerIds.length > 0) {
                await tx.commission.deleteMany({ where: { resellerId: { in: resellerIds } } });
            }

            // 3. Delete store-level relations
            await tx.reseller.deleteMany({ where: { storeId } });
            await tx.groupOrder.deleteMany({ where: { storeId } });
            await tx.order.deleteMany({ where: { storeId } });
            await tx.product.deleteMany({ where: { storeId } });
            await tx.marketingPost.deleteMany({ where: { storeId } });
            await tx.subscription.deleteMany({ where: { storeId } });

            // 4. Finally delete the store itself
            await tx.store.delete({ where: { id: storeId } });
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
