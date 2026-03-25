import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const store = await prisma.store.findFirst({
            where: { ownerId: session.userId },
            include: {
                subscription: true,
                _count: {
                    select: { products: true, orders: true }
                },
                orders: {
                    where: { paymentStatus: 'PAID' } // Simple revenue calc MVP
                }
            }
        });

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        const revenueToday = store.orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const plan = store.subscription?.plan || 'FREE';

        return NextResponse.json({
            businessName: store.name,
            slug: store.slug,
            archived: store.archived,
            totalProducts: store._count.products,
            totalOrders: store._count.orders,
            revenueToday,
            plan,
            isAdmin: user?.role === 'ADMIN'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
