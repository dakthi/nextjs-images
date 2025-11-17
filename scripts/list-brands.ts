import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listBrands() {
  const brands = await prisma.brand.findMany();
  console.log('Existing brands:');
  brands.forEach(b => console.log(`  - ${b.name} (slug: ${b.slug})`));
  await prisma.$disconnect();
}

listBrands();
