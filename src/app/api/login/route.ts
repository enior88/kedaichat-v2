import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();
        const identStr = identifier?.toString() || '';
        const digitsOnly = identStr.replace(/\D/g, '');

        // Build phone variants to cover common formats (with/without country code)
        const last9 = digitsOnly.slice(-9); // e.g. '128556781'

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identStr },
                    { whatsappNumber: identStr },
                    // Match regardless of stored country code format (60xxx, 0xxx, +60xxx, etc.)
                    ...(last9.length >= 8 ? [{ whatsappNumber: { contains: last9 } }] : []),
                ]
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Verify password using bcrypt only (no plain-text fallback)
        const isValid = user.password ? await bcrypt.compare(password, user.password) : false;

        if (!isValid) return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });

        await createSession(user.id);
        return NextResponse.json({ success: true, role: user.role });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
