import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const subscription = await req.json();

        // Validate subscription object
        if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
            return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
        }

        // Save or update subscription
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                userId: session.userId,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                userId: session.userId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Push Subscription Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Optional: DELETE to unsubscribe a specific device
export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { endpoint } = await req.json();

        await prisma.pushSubscription.deleteMany({
            where: {
                endpoint,
                userId: session.userId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
