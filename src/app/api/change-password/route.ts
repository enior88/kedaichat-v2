import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, error: 'Missing current or new password' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isValid = user.password ? await bcrypt.compare(currentPassword, user.password) : false;
        if (!isValid) {
            // Check for plain-text fallback (for existing users/admin)
            if (user.password !== currentPassword) {
                return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
            }
        }

        // Hash and update to new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
