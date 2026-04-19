const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.store.findFirst().then(s => console.log(s ? s.slug : 'no store')).finally(() => prisma.$disconnect());
