import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const stores = await prisma.store.findMany();
    console.log('Stores in database:', JSON.stringify(stores, null, 2));
    const ali = await prisma.store.findUnique({ where: { slug: 'ali-nasi-lemak' } });
    console.log('Ali Nasi Lemak:', JSON.stringify(ali, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
