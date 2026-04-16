const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'kedaichat@gmail.com';
    const password = process.argv[2]; // Pass password as CLI arg

    if (!password) {
        console.error('❌ Usage: node seed-admin.js <password>');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            password: hashedPassword,
        },
        create: {
            email,
            password: hashedPassword,
            name: 'KedaiChat Admin',
            role: 'ADMIN',
        },
    });

    console.log(`✅ Admin user set: ${admin.email} (role: ${admin.role})`);
}

main()
    .catch(e => {
        console.error('❌ Error:', e.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
