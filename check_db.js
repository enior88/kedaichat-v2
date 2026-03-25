const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.umgfakdlzfcgqknppevf:Kedaichat880203@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
        }
    }
});

async function main() {
    try {
        console.log('Checking database connection...');
        const users = await prisma.user.findMany();
        console.log('Success! Connection verified.');
        console.log('User count:', users.length);
    } catch (e) {
        if (e.code === 'P2021') {
            console.log('Table not found. Schema migration has not been pushed yet.');
        } else {
            console.error('Error connecting to DB:', e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
