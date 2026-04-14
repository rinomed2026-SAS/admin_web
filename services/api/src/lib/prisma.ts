import { PrismaClient } from '@prisma/client';

// Singleton pattern — avoids leaking connections on hot reload in dev.
// In Railway the default Prisma pool is ~5 (num_cpus × 2 + 1).
// We raise connection_limit to 20 and add a 30 s statement timeout
// so no single rogue query can hold a connection indefinitely.
const DATABASE_URL = process.env.DATABASE_URL ?? '';
const url = DATABASE_URL.includes('connection_limit')
  ? DATABASE_URL
  : DATABASE_URL.includes('?')
    ? `${DATABASE_URL}&connection_limit=20&pool_timeout=10&statement_timeout=30000`
    : `${DATABASE_URL}?connection_limit=20&pool_timeout=10&statement_timeout=30000`;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url } },
    log:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
