import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { whatsappNumber } = await req.json();

        if (!whatsappNumber) {
            return NextResponse.json({ success: false, error: 'WhatsApp number is required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { whatsappNumber }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'No account found with this WhatsApp number' }, { status: 404 });
        }

        // Generate temporary password
        const tempPassword = 'KC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // In a real app, you would use a WhatsApp API here.
        // For this MVP, we return the password so the UI can show a "Notify via WhatsApp" button.
        const waMessage = `Your KedaiChat temporary password is: ${tempPassword}. Please login and change it in your settings.`;
        const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

        return NextResponse.json({
            success: true,
            tempPassword,
            waLink
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
