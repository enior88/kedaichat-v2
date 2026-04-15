export const dynamic = 'force-dynamic';
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
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        items: true
                    }
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

        const revenueToday = store.orders
            .filter((o: any) => o.paymentStatus === 'PAID')
            .reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const plan = store.subscription?.status === 'ACTIVE' ? store.subscription.plan : 'FREE';

        return NextResponse.json({
            businessName: store.name,
            slug: store.slug,
            archived: store.archived,
            description: store.category, // Fetch from the repurposed field
            totalProducts: store._count.products,
            totalOrders: store._count.orders,
            revenueToday,
            plan,
            isAdmin: user?.role === 'ADMIN',
            recentOrders: store.orders.map((o: any) => ({
                id: o.id,
                customerName: o.customerName,
                total: o.total,
                paymentStatus: o.paymentStatus,
                createdAt: o.createdAt
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
