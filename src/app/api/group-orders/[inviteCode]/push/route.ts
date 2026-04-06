import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Generate random order number e.g. ORD-8F2A
function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export async function POST(req: Request, { params }: { params: { inviteCode: string } }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { inviteCode } = params;

        const groupOrder = await prisma.groupOrder.findUnique({
            where: { inviteCode },
            include: {
                items: true
            }
        });

        if (!groupOrder) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        if (groupOrder.status !== 'ACTIVE') return NextResponse.json({ error: 'Session already finalized' }, { status: 400 });

        // Consolidate the items to build a standard Order
        // For standard order, we map GroupOrderItem -> OrderItem
        // We aggregate identical products:

        let total = 0;
        const consolidatedItems = new Map();

        for (const item of groupOrder.items) {
            total += item.price * item.quantity;
            if (consolidatedItems.has(item.productId)) {
                consolidatedItems.get(item.productId).quantity += item.quantity;
            } else {
                consolidatedItems.set(item.productId, {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                });
            }
        }

        const itemsArray = Array.from(consolidatedItems.values());
        const orderNumber = generateOrderNumber();

        // Transaction to lock it in and mark GroupOrder as closed
        const result = await prisma.$transaction(async (tx) => {
            const realOrder = await tx.order.create({
                data: {
                    orderNumber,
                    customerName: `Group Order: ${groupOrder.title}`,
                    customerPhone: 'Group Order',
                    total,
                    status: 'PENDING',
                    paymentStatus: 'UNPAID',
                    storeId: groupOrder.storeId,
                    items: {
                        create: itemsArray.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            await tx.groupOrder.update({
                where: { id: groupOrder.id },
                data: { status: 'CLOSED' }
            });

            return realOrder;
        });

        return NextResponse.json({ success: true, order: result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
