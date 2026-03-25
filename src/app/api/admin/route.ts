import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany();
        const stores = await prisma.store.findMany();
        const orders = await prisma.order.findMany();
        const products = await prisma.product.findMany();
        const subscriptionsList = await prisma.subscription.findMany();

        let data: any = { users, stores, orders, products, subscriptions: subscriptionsList };

        // Overview stats
        const totalStores = data.stores.length;
        const totalUsers = data.users.length;
        const totalOrders = data.orders.length;
        const totalProducts = data.products.length;
        const totalRevenue = data.orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

        // Stores section
        const allStores = data.stores.map((store: any) => {
            const owner = data.users.find((u: any) => u.id === store.ownerId);
            const orders = data.orders.filter((o: any) => o.storeId === store.id);
            const products = data.products.filter((p: any) => p.storeId === store.id);
            const sub = (data.subscriptions || []).find((s: any) => s.storeId === store.id);
            const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
            return {
                id: store.id,
                name: store.name,
                slug: store.slug,
                whatsappNumber: store.whatsappNumber,
                ownerEmail: owner?.email || owner?.whatsappNumber || '—',
                orderCount: orders.length,
                productCount: products.length,
                revenue,
                plan: sub?.plan || 'Free',
                status: sub?.status || 'Active',
                archived: store.archived,
                createdAt: store.createdAt,
            };
        });

        const recentStores = [...allStores].reverse().slice(0, 10);

        // Subscriptions section
        const subscriptions = data.stores.map((store: any) => {
            const owner = data.users.find((u: any) => u.id === store.ownerId);
            const sub = (data.subscriptions || []).find((s: any) => s.storeId === store.id);
            return {
                id: store.id,
                ownerEmail: owner?.email || owner?.whatsappNumber || '—',
                storeName: store.name,
                plan: sub?.plan || 'Free',
                status: sub?.status || 'Active',
                archived: store.archived,
                paymentReceiptUrl: sub?.paymentReceiptUrl || null,
                renewalDate: sub?.expiresAt || null,
                createdAt: store.createdAt,
            };
        });

        // Payments section
        const payments = data.orders.map((order: any) => {
            const store = data.stores.find((s: any) => s.id === order.storeId);
            return {
                id: order.id,
                storeName: store?.name || 'Unknown Store',
                storeSlug: store?.slug || '',
                customerName: order.customerName || 'Customer',
                total: order.total || 0,
                paymentStatus: order.paymentStatus || 'PENDING',
                createdAt: order.createdAt,
            };
        }).reverse();

        return NextResponse.json({
            totalStores,
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            recentStores,
            allStores,
            subscriptions,
            payments,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, archived } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        const store = await prisma.store.update({
            where: { id },
            data: { archived }
        });

        return NextResponse.json({ success: true, archived: store.archived });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const idsParam = searchParams.get('ids');

        const idsToDelete = idsParam ? idsParam.split(',') : (id ? [id] : []);

        if (idsToDelete.length === 0) {
            return NextResponse.json({ error: 'Store ID(s) required' }, { status: 400 });
        }

        // Delete all related data first (Manual Cascade for SQLite/Prisma safety)
        await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { order: { storeId: { in: idsToDelete } } } }),
            prisma.order.deleteMany({ where: { storeId: { in: idsToDelete } } }),
            prisma.product.deleteMany({ where: { storeId: { in: idsToDelete } } }),
            prisma.subscription.deleteMany({ where: { storeId: { in: idsToDelete } } }),
            prisma.groupOrder.deleteMany({ where: { storeId: { in: idsToDelete } } }),
            prisma.reseller.deleteMany({ where: { storeId: { in: idsToDelete } } }),
            prisma.store.deleteMany({ where: { id: { in: idsToDelete } } }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { storeId } = await req.json();
        if (!storeId) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: { owner: true }
        });

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const tempPassword = 'ADM-' + Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: store.ownerId },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true, tempPassword });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
