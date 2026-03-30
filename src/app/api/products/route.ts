import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const products = await prisma.product.findMany({
        where: { storeId: store.id },
    });

    return NextResponse.json(products);
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const { name, price, description, category } = await req.json();

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description: description || null,
                category: category || null,
                storeId: store.id
            }
        });

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const { id, name, price, description, category, active } = await req.json();

        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(price && { price: parseFloat(price) }),
                ...(description !== undefined && { description }),
                ...(category !== undefined && { category }),
                ...(active !== undefined && { active }),
            }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { ownerId: session.userId } });
        if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const deleted = await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json(deleted);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
