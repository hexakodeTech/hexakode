const prisma = require('./src/lib/prisma').default;
console.log("Prisma keys:", Object.keys(prisma));
console.log("Prisma coupon:", prisma.coupon);
process.exit(0);
