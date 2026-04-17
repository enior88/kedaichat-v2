import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET all orders for a store (for seller dashboard)
export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const orders = await prisma.order.findMany({
        where: { storeId: store.id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
}

// POST new order (from customer checkout)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { storeId, items, total, customerPhone, message, refCode } = body;

        // Subscription enforcement
        const subscription = await prisma.subscription.findFirst({
            where: { storeId }
        });

        const plan = subscription?.status === 'ACTIVE' ? subscription.plan : 'FREE';

        // Check if owner is an administrator (full access)
        const ownerStore = await prisma.store.findUnique({
            where: { id: storeId },
            select: { owner: { select: { role: true } } }
        });

        const isAdmin = ownerStore?.owner?.role === 'ADMIN';

        if (plan === 'FREE' && !isAdmin) {
            const storeOrders = await prisma.order.findMany({ where: { storeId } });
            if (storeOrders.length >= 30) {
                return NextResponse.json(
                    { error: 'Order limit reached for Free plan. Please ask the seller to upgrade.' },
                    { status: 403 }
                );
            }
        }

        const orderNumber = `KC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                storeId,
                total: parseFloat(total),
                paymentStatus: 'PAID',
                customerName: customerPhone || 'Walk-in Customer',
                customerPhone: customerPhone || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // If there is a referral code, create a Commission record
        if (refCode) {
            const reseller = await prisma.reseller.findUnique({ where: { refCode } });
            if (reseller) {
                const commissionAmount = parseFloat(total) * 0.10; // 10% commission
                await prisma.commission.create({
                    data: {
                        amount: commissionAmount,
                        orderId: newOrder.id,
                        resellerId: reseller.id
                    }
                });
                // Clear the ref after use so it doesn't double-count
            }
        }

        return NextResponse.json({ success: true, order: newOrder });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT to update order status (from seller dashboard)
export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const { id, paymentStatus } = await req.json();

        // Security check: ensure order belongs to this store
        const existingOrders = await prisma.order.findMany({ where: { storeId: store.id } });
        if (!existingOrders.find((o: any) => o.id === id)) {
            return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { paymentStatus }
        });

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
