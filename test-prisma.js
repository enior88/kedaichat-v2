const { PrismaClient } = require('@prisma/client');

try {
    const prisma = new PrismaClient({ adapter: null });
    prisma.$connect().then(() => {
        console.log("Connected successfully");
        process.exit(0);
    }).catch(e => {
        console.error("Connection error:", e);
        process.exit(1);
    });
} catch (e) {
    console.error("Init error:", e);
    process.exit(1);
}
