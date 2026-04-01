import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role.toUpperCase() !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });

        return NextResponse.json({ adminBankQrUrl: settings?.adminBankQrUrl || null });
    } catch (error: any) {
        console.error('[ADMIN_SETTINGS_GET_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;
        if (!user || user.role.toUpperCase() !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { adminBankQrUrl } = body;

        if (adminBankQrUrl === undefined) {
            return NextResponse.json({ error: 'adminBankQrUrl is required' }, { status: 400 });
        }

        // Upsert the global setting
        const settings = await prisma.platformSettings.upsert({
            where: { id: 'global' },
            update: { adminBankQrUrl },
            create: {
                id: 'global',
                adminBankQrUrl,
            },
        });

        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        console.error('[ADMIN_SETTINGS_PUT_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
