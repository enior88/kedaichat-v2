import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { inviteCode: string } }) {
    try {
        const { inviteCode } = params;

        const groupOrder = await prisma.groupOrder.findUnique({
            where: { inviteCode },
            include: {
                store: {
                    include: {
                        products: {
                            where: { active: true }
                        }
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!groupOrder) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

        return NextResponse.json(groupOrder);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Participant pushing items into the pool
export async function POST(req: Request, { params }: { params: { inviteCode: string } }) {
    try {
        const { inviteCode } = params;
        const { participantName, items } = await req.json(); // items: [{ productId, quantity, price }]

        const groupOrder = await prisma.groupOrder.findUnique({
            where: { inviteCode }
        });

        if (!groupOrder) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        if (groupOrder.status !== 'ACTIVE') return NextResponse.json({ error: 'This session is no longer active' }, { status: 400 });

        // We could just add the items. 
        const createdItems = await prisma.$transaction(
            items.map((item: any) =>
                prisma.groupOrderItem.create({
                    data: {
                        participantName,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        groupOrderId: groupOrder.id
                    }
                })
            )
        );

        return NextResponse.json({ success: true, count: createdItems.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
