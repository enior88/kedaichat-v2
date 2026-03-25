require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Password123', 10);
    const user = await prisma.user.upsert({
        where: { whatsappNumber: '60123456789' },
        update: { password },
        create: {
            whatsappNumber: '60123456789',
            name: 'Test Admin',
            password,
            role: 'ADMIN'
        }
    });
    console.log('User synced:', user);
}

main().finally(() => prisma.$disconnect());
