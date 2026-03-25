require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- VALID USERS ---');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            whatsappNumber: true,
            email: true,
            role: true
        }
    });
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
