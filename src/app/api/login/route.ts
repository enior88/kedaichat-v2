import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        // Find user by email or whatsapp
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { whatsappNumber: identifier }
                ]
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Verify password
        let isValid = false;
        try {
            isValid = user.password ? await bcrypt.compare(password, user.password) : false;
        } catch (e) {
            // Fallback for unhashed passwords (for existing users/admin)
            isValid = user.password === password;
        }

        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }

        await createSession(user.id);

        return NextResponse.json({ success: true, role: user.role });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
