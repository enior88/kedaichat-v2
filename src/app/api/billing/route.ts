import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const store = await prisma.store.findFirst({
            where: { ownerId: session.userId }
        });

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const body = await req.json();
        const { planId, receiptUrl } = body; // 'BASIC' or 'PRO'

        if (!['FREE', 'BASIC', 'PRO'].includes(planId)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Upsert the subscription (create if it doesn't exist, update if it does)
        const updatedSubscription = await prisma.subscription.upsert({
            where: { storeId: store.id },
            update: {
                plan: planId,
                status: 'ACTIVE',
                paymentReceiptUrl: receiptUrl,
            },
            create: {
                storeId: store.id,
                plan: planId,
                status: 'ACTIVE',
                paymentReceiptUrl: receiptUrl,
            }
        });

        return NextResponse.json({ success: true, subscription: updatedSubscription });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
