export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ role: 'GUEST' });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        return NextResponse.json({ role: user?.role || 'GUEST' });
    } catch (error) {
        return NextResponse.json({ role: 'GUEST' }, { status: 500 });
    }
}
