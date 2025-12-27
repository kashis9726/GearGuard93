const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true }
        });

        console.log(`Total Users: ${userCount}`);
        if (userCount > 0) {
            console.log('Users found:', users);
            console.log('REAL TIME DATA VERIFIED: Database is connected and holding data.');
        } else {
            console.log('No users found. Login might fail if seeding verification failed.');
        }
    } catch (e) {
        console.error('Database Verification Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
