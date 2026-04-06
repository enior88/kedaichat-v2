// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' }
    });
    console.log('--- ADMIN USERS ---');
    console.log(adminUsers.map((u: any) => ({ id: u.id, email: u.email, role: u.role })));

    const allUsers = await prisma.user.findMany({ take: 5 });
    console.log('--- FIRST 5 USERS ---');
    console.log(allUsers.map((u: any) => ({ id: u.id, email: u.email, role: u.role })));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
