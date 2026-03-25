const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promote() {
    try {
        console.log('Searching for users by phone...');
        const users = await prisma.user.findMany({
            where: { whatsappNumber: { contains: '60123456789' } }
        });

        if (users.length === 0) {
            console.log('No users found matching that number.');
            return;
        }

        for (const user of users) {
            console.log(`Promoting user: ${user.whatsappNumber} (ID: ${user.id})`);
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
            console.log('Promoted successfully.');
        }
    } catch (error) {
        console.error('Promotion failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

promote();
