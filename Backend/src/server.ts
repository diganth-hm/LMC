import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 LastMile Carbon Backend running on port ${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);

  // Safely auto-push schema & seed if external DATABASE_URL is configured
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl) {
    try {
      const { execSync } = require('child_process');
      console.log('🔄 Syncing database schema and seeding demo data...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', timeout: 30000 });
      execSync('npx ts-node seed/seed.ts', { stdio: 'inherit', timeout: 30000 });
      console.log('✅ Production database synced and seeded successfully!');
    } catch (err) {
      console.warn('⚠️ Auto-db sync notice:', (err as Error).message);
    }
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
