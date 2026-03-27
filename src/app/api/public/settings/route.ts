import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });

        // If no settings exist yet, return null for URL
        if (!settings) {
            return NextResponse.json({ adminBankQrUrl: null });
        }

        return NextResponse.json({ adminBankQrUrl: settings.adminBankQrUrl });
    } catch (error: any) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
