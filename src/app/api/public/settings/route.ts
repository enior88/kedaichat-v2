import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // Use upsert to ensure the record exists, or findFirst as a fallback
        let settings = await prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });

        if (!settings) {
            // Self-heal: create the global record if missing
            settings = await prisma.platformSettings.create({
                data: { id: 'global' }
            });
        }

        return NextResponse.json({
            adminBankQrUrl: settings.adminBankQrUrl || null,
            _debug: { id: settings.id, updatedAt: settings.updatedAt }
        });
    } catch (error: any) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
