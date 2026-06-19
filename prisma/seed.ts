import 'dotenv/config';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const roles = [
  {
    name: 'Super Admin',
    description: 'Full system access and administrator management.',
  },
  {
    name: 'Admin',
    description: 'Dashboard, enquiries, CMS, and settings access.',
  },
  {
    name: 'Operator',
    description: 'Dashboard and enquiry management access.',
  },
  {
    name: 'Viewer',
    description: 'View-only access to the dashboard.',
  },
];

async function main() {
  console.log('Seeding roles...');

  for (const role of roles) {
    const upserted = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
      },
    });
    console.log(`Upserted role: ${upserted.name} (${upserted.id})`);
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
