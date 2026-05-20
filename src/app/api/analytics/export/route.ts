import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
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

        const orders = await prisma.order.findMany({
            where: {
                storeId: store.id,
                paymentStatus: {
                    in: ['PAID', 'PREPARING', 'DELIVERING', 'COMPLETED']
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Generate CSV content
        const headers = ['Order Number', 'Date', 'Customer Name', 'Customer Phone', 'Items', 'Total (RM)', 'Payment Status'];
        const csvRows = [headers.join(',')];

        for (const order of orders) {
            const itemsSummary = order.items.map(item => `${item.product.name} (x${item.quantity})`).join('; ');
            const date = new Date(order.createdAt).toLocaleDateString();
            const row = [
                `"${order.orderNumber}"`,
                `"${date}"`,
                `"${order.customerName}"`,
                `"${order.customerPhone || ''}"`,
                `"${itemsSummary}"`,
                order.total.toFixed(2),
                `"${order.paymentStatus}"`
            ];
            csvRows.push(row.join(','));
        }

        const csvContent = csvRows.join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="sales_report_${store.slug}_${new Date().toISOString().split('T')[0]}.csv"`
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
