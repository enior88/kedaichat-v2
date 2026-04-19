require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "isDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryType" TEXT NOT NULL DEFAULT 'PICKUP';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryAddress" TEXT;`);
        fs.writeFileSync('out.txt', "Success executed raw sql", 'utf8');
    } catch (e) {
        fs.writeFileSync('out.txt', "Error: " + e.message, 'utf8');
    } finally {
        await prisma.$disconnect();
    }
}
main();
