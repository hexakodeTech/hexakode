import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const requiredServerEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
];

const missingEnvVars = requiredServerEnvVars.filter(name => !process.env[name]);
if (missingEnvVars.length > 0) {
  throw new Error(`[CRITICAL] Missing required environment variables at database initialization: ${missingEnvVars.join(', ')}`);
}

const prismaClientSingleton = () => {
  const connStr = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const pool = new pg.Pool({
    connectionString: connStr,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
