const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany();
    console.log(JSON.stringify(users, null, 2));

    console.log('\n--- STORES ---');
    const stores = await prisma.store.findMany({
        include: {
            owner: true
        }
    });
    console.log(JSON.stringify(stores, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
