import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Helper to generate random alphanumeric invite code
function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// GET all active group sessions for the authenticated store owner
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const sessions = await prisma.groupOrder.findMany({
            where: { storeId: store.id },
            include: {
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format to calculate items
        const formatted = sessions.map(s => ({
            id: s.id,
            inviteCode: s.inviteCode,
            title: s.title,
            deadline: s.deadline,
            pickupTime: s.pickupTime,
            status: s.status,
            totalItems: s.items.reduce((acc, curr) => acc + curr.quantity, 0),
            createdAt: s.createdAt
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create a new group order session
export async function POST(req: Request) {
    try {
        const { title, deadline, pickupTime, storeId, hostToken } = await req.json();

        if (!storeId) return NextResponse.json({ error: 'storeId is required' }, { status: 400 });

        const inviteCode = generateInviteCode();

        const groupOrder = await prisma.groupOrder.create({
            data: {
                inviteCode,
                title,
                deadline: new Date(deadline),
                pickupTime,
                storeId,
                status: 'ACTIVE',
                // We'll store the hostToken in the db if we add a column later, 
                // for now we'll just return it so the client knows it's the host.
            }
        });

        return NextResponse.json(groupOrder);

        return NextResponse.json(groupOrder);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
