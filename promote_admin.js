const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promote() {
    try {
        console.log('Searching for user with phone: 60123456789');
        const user = await prisma.user.update({
            where: { id: 'cmmvjxrgq000012abo4o57aod' },
            data: { role: 'ADMIN' }
        });
        console.log('Successfully promoted user to ADMIN:', user.whatsappNumber);
    } catch (error) {
        console.error('Promotion failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

promote();
