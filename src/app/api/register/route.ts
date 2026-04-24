import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { generateWelcomePost } from '@/lib/platform-agent';

export async function POST(req: Request) {
    try {
        const { businessName, category, whatsappNumber, email, password, planId, receiptUrl } = await req.json();

        if (!businessName || !whatsappNumber || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists by WhatsApp
        const existingByPhone = await prisma.user.findFirst({
            where: { whatsappNumber }
        });

        if (existingByPhone) {
            return NextResponse.json({ success: false, error: 'User with this WhatsApp number already exists' }, { status: 400 });
        }

        // Check if user exists by Email (if provided)
        if (email) {
            const existingByEmail = await prisma.user.findFirst({
                where: { email }
            });
            if (existingByEmail) {
                return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
            }
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                whatsappNumber,
                email: email || null,
                password: hashedPassword,
                name: businessName,
                role: 'SELLER'
            }
        });

        // Generate slug from business name
        const slug = businessName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // Create store for user
        const store = await prisma.store.create({
            data: {
                name: businessName,
                slug,
                category,
                whatsappNumber,
                ownerId: user.id
            }
        });

        // If a premium plan was selected, create the subscription immediately
        if (planId && planId !== 'FREE') {
            await prisma.subscription.create({
                data: {
                    storeId: store.id,
                    plan: planId,
                    status: 'ACTIVE',
                    paymentReceiptUrl: receiptUrl,
                }
            });
        }

        // Set session
        await createSession(user.id);

        // Async welcome post generation (does not block registration response)
        generateWelcomePost(businessName, category, slug);

        return NextResponse.json({ success: true, user: { id: user.id, role: user.role } });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
