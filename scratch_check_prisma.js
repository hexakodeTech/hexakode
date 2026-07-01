const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.portfolioProject.findMany({
  where: { status: 'Published' },
  include: { technologies: true }
}).then(res => {
  console.log("SUCCESS:", JSON.stringify(res, null, 2));
  process.exit(0);
}).catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
