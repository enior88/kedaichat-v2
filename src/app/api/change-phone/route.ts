import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { newPhoneNumber } = body;

        if (!newPhoneNumber || newPhoneNumber.trim() === '') {
            return NextResponse.json({ error: 'Phone number missing' }, { status: 400 });
        }

        // Check if the new phone number is already registered to another user
        const existingUser = await prisma.user.findFirst({
            where: { whatsappNumber: newPhoneNumber }
        });

        if (existingUser && existingUser.id !== session.userId) {
            return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
        }

        // Update the user's login phone number
        await prisma.user.update({
            where: { id: session.userId },
            data: { whatsappNumber: newPhoneNumber }
        });

        return NextResponse.json({ success: true, message: 'Login phone number updated' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
