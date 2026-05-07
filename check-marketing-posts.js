const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const posts = await prisma.marketingPost.findMany({
        where: {
            createdAt: {
                gte: today
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${posts.length} marketing posts today.`);
    if (posts.length > 0) {
        posts.forEach(p => {
            console.log(`- Post: ${p.headline} (Store ID: ${p.storeId}) at ${p.createdAt}`);
        });
    }
}

checkPosts()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    });
