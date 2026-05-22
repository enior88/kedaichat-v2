const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "isDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false;`);
        console.log("Added isDeliveryEnabled");
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;`);
        console.log("Added deliveryFee");
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "lastNudgeAt" TIMESTAMP WITH TIME ZONE;`);
        console.log("Added lastNudgeAt to Store");

        // MarketingPost - Exhaustive Sync
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "headline" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "caption" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "hashtags" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "visualUrl" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "fbPostId" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "igPostId" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PENDING';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "MarketingPost" ADD COLUMN IF NOT EXISTS "errorMessage" TEXT;`);
        console.log("Exhaustive sync for MarketingPost completed");

        // PlatformArticle - Exhaustive Sync
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "content" TEXT NOT NULL DEFAULT '';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Marketing';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'DRAFT';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "metaStatus" TEXT NOT NULL DEFAULT 'PENDING';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "metaError" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "fbPostId" TEXT;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "PlatformArticle" ADD COLUMN IF NOT EXISTS "igPostId" TEXT;`);
        console.log("Exhaustive sync for PlatformArticle completed");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
