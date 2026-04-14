import { app } from './app.js';
import { config } from './lib/config.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(config.port, () => {
  console.log(`RINOMED API listening on ${config.port}`);
});

// 30-second server-level timeout — prevents hung requests from clogging the event loop
server.timeout = 30_000;
server.keepAliveTimeout = 65_000; // slightly above typical LB idle timeout (60 s)

// Graceful shutdown — close DB pool before process exits
const shutdown = async () => {
  console.log('Shutting down…');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
