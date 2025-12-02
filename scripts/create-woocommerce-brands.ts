import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newBrands = [
  {
    name: 'Chisel',
    slug: 'chisel',
    description: 'Chisel nail products - professional acrylic and dip powder systems',
  },
  {
    name: 'SNS',
    slug: 'sns',
    description: 'SNS (Signature Nail Systems) - premium dipping powder',
  },
  {
    name: 'HAT',
    slug: 'hat',
    description: 'HAT nail products - professional nail care solutions',
  },
];

async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes('--confirm');

  if (!confirm) {
    console.log('❌ This script requires --confirm flag to execute');
    console.log('');
    console.log('The following brands will be created:');
    newBrands.forEach((brand) => {
      console.log(`  - ${brand.name} (slug: ${brand.slug})`);
      console.log(`    ${brand.description}`);
    });
    console.log('');
    console.log('Run with --confirm to proceed:');
    console.log('  npx ts-node scripts/create-woocommerce-brands.ts --confirm');
    process.exit(0);
  }

  console.log('Creating WooCommerce brands...\n');

  let created = 0;
  let existing = 0;

  for (const brandData of newBrands) {
    try {
      const result = await prisma.brand.upsert({
        where: { slug: brandData.slug },
        update: {
          description: brandData.description,
        },
        create: brandData,
      });

      const isNew = result.createdAt.getTime() === result.updatedAt.getTime();

      if (isNew) {
        console.log(`✅ Created brand: ${brandData.name} (${brandData.slug})`);
        created++;
      } else {
        console.log(`ℹ️  Updated existing brand: ${brandData.name} (${brandData.slug})`);
        existing++;
      }
    } catch (error) {
      console.error(`❌ Failed to create/update brand ${brandData.name}:`);
      console.error(error);
      process.exit(1);
    }
  }

  console.log('');
  console.log(`🎉 Brand creation complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${existing}`);
  console.log(`   Total: ${created + existing}`);

  // Verify all brands exist
  console.log('');
  console.log('Verifying all required brands exist...');

  const requiredSlugs = [
    'blazingstar',
    'bold-berry',
    'mberry',
    'lapalm',
    'kds',
    'vl-london',
    'cnd',
    'dnd',
    'opi',
    'chisel',
    'sns',
    'hat',
  ];

  const brands = await prisma.brand.findMany({
    where: {
      slug: { in: requiredSlugs },
    },
    select: {
      name: true,
      slug: true,
    },
  });

  console.log(`\nFound ${brands.length} / ${requiredSlugs.length} required brands:`);
  brands.forEach((brand) => {
    console.log(`  ✓ ${brand.name} (${brand.slug})`);
  });

  if (brands.length < requiredSlugs.length) {
    console.log('');
    console.log('⚠️  Warning: Some required brands are missing!');
    const foundSlugs = brands.map((b) => b.slug);
    const missing = requiredSlugs.filter((s) => !foundSlugs.includes(s));
    console.log('Missing:', missing.join(', '));
  }
}

main()
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
