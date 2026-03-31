import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // First try the 'global' record
        let settings = await prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });

        // Fallback: If 'global' is missing or has NO QR, try to find ANY record in the table
        if (!settings || !settings.adminBankQrUrl) {
            const anySettings = await prisma.platformSettings.findFirst({
                where: { adminBankQrUrl: { not: null } },
                orderBy: { updatedAt: 'desc' }
            });
            if (anySettings) {
                settings = anySettings;
            }
        }

        // Final Fallback: Self-heal if NO records exist at all
        if (!settings) {
            settings = await prisma.platformSettings.upsert({
                where: { id: 'global' },
                update: {},
                create: { id: 'global' }
            });
        }

        return NextResponse.json({
            adminBankQrUrl: settings.adminBankQrUrl || null,
            _debug: { id: settings.id, updatedAt: settings.updatedAt }
        });
    } catch (error: any) {
        console.error('[PUBLIC_SETTINGS_GET_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
