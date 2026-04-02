const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true }
        });
        console.log('--- USERS ---');
        console.table(users);

        const settings = await prisma.platformSettings.findUnique({ where: { id: 'global' } });
        console.log('--- SETTINGS ---', settings);
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
