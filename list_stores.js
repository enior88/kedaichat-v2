const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findFirst();
    if (store) {
        console.log('STORE_SLUG: ' + store.slug);
    } else {
        console.log('No stores found.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
