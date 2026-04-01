import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { storeId, plan, status, expiresAt } = body;

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        // Upsert the subscription linking it to the storeId
        // Upsert is safer in case a store doesn't have a subscription row correctly created yet
        const subscription = await prisma.subscription.upsert({
            where: { storeId },
            update: {
                plan: plan || undefined,
                status: status || undefined,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
            create: {
                storeId,
                plan: plan || 'FREE',
                status: status || 'ACTIVE',
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });

        return NextResponse.json({ success: true, subscription });
    } catch (error: any) {
        console.error('Subscription update error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
