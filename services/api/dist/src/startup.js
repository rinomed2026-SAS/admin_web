import { PrismaClient } from '@prisma/client';
async function fixAndStart() {
    const prisma = new PrismaClient();
    try {
        console.log('[startup] Deleting failed migration record...');
        const deleted = await prisma.$executeRawUnsafe(`DELETE FROM _prisma_migrations WHERE migration_name = '20260412000000_expand_roles'`);
        console.log(`[startup] Removed ${deleted} failed migration record(s).`);
    }
    catch (err) {
        console.log('[startup] No failed migration to remove (OK).');
    }
    await prisma.$disconnect();
    console.log('[startup] Starting server...');
    await import('./index.js');
}
fixAndStart().catch((err) => {
    console.error('[startup] Fatal:', err);
    process.exit(1);
});
