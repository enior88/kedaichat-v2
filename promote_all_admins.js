const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteAll() {
    try {
        console.log('Fetching all users...');
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            console.log(`Promoting ID: ${user.id} | Phone: ${user.whatsappNumber}`);
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
        }
        console.log('All users promoted to ADMIN.');
    } catch (error) {
        console.error('Promotion failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

promoteAll();
