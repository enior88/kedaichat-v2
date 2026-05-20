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

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true, whatsappNumber: true }
        });

        if (!store) {
            // Admin has no store — return role so frontend can redirect to /admin
            if (user?.role === 'ADMIN') {
                return NextResponse.json({ error: 'Store not found', isAdmin: true, role: 'ADMIN' }, { status: 404 });
            }
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Calculate revenue for today in Malaysia time (UTC+8)
        const now = new Date();
        const myTime = new Date(now.getTime() + 8 * 3600000);
        const startOfMyDay = new Date(Date.UTC(myTime.getUTCFullYear(), myTime.getUTCMonth(), myTime.getUTCDate()));
        const startOfTodayUTC = new Date(startOfMyDay.getTime() - 8 * 3600000);

        const todayOrders = await prisma.order.findMany({
            where: {
                storeId: store.id,
                paymentStatus: {
                    in: ['PAID', 'PREPARING', 'DELIVERING', 'COMPLETED']
                },
                createdAt: {
                    gte: startOfTodayUTC
                }
            },
            select: {
                total: true
            }
        });

        const revenueToday = todayOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const plan = store.subscription?.status === 'ACTIVE' ? store.subscription.plan : 'FREE';

        // Calculate revenue for the last 7 days including today
        const weeklyRevenue = [];
        for (let i = 6; i >= 0; i--) {
            const startOfPastDayUTC = new Date(startOfTodayUTC.getTime() - i * 24 * 3600000);
            const endOfPastDayUTC = new Date(startOfPastDayUTC.getTime() + 24 * 3600000);

            const dayOrders = await prisma.order.findMany({
                where: {
                    storeId: store.id,
                    paymentStatus: {
                        in: ['PAID', 'PREPARING', 'DELIVERING', 'COMPLETED']
                    },
                    createdAt: {
                        gte: startOfPastDayUTC,
                        lt: endOfPastDayUTC
                    }
                },
                select: { total: true }
            });
            const total = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            weeklyRevenue.push({
                date: startOfPastDayUTC.toISOString(),
                total
            });
        }

        return NextResponse.json({
            businessName: store.name,
            slug: store.slug,
            archived: store.archived,
            description: store.category, // Fetch from the repurposed field
            whatsappNumber: store.whatsappNumber,
            storeLogo: store.logoUrl,
            paymentQrUrl: store.paymentQrUrl || '',
            loginPhone: user?.whatsappNumber || '',
            totalProducts: store._count.products,
            totalOrders: store._count.orders,
            revenueToday,
            weeklyRevenue, // New field
            plan,
            isDeliveryEnabled: store.isDeliveryEnabled,
            deliveryFee: store.deliveryFee,
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
