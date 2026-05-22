const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "isDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false;`);
        console.log("Added isDeliveryEnabled");
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;`);
        console.log("Added deliveryFee");
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "lastNudgeAt" TIMESTAMP WITH TIME ZONE;`);
        console.log("Added lastNudgeAt");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
