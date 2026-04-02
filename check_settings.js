const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const settings = await prisma.platformSettings.findUnique({ where: { id: 'global' } });
        console.log('--- GLOBAL SETTINGS ---');
        console.log(JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
