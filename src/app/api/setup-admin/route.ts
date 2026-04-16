import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ONE-TIME setup route — secured with a secret key from env
// Call: POST /api/setup-admin
// Body: { "secret": "<SETUP_SECRET>", "password": "<new-password>" }

export async function POST(req: Request) {
    try {
        const { secret, password } = await req.json();

        const SETUP_SECRET = process.env.SETUP_SECRET;

        if (!SETUP_SECRET) {
            return NextResponse.json({ error: 'SETUP_SECRET env var not configured' }, { status: 500 });
        }

        if (secret !== SETUP_SECRET) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
        }

        if (!password || password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const email = 'kedaichat@gmail.com';
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.upsert({
            where: { email },
            update: { role: 'ADMIN', password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                name: 'KedaiChat Admin',
                role: 'ADMIN',
            },
        });

        return NextResponse.json({ success: true, message: `Admin password updated for ${admin.email}` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
