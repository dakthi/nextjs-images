import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBrandInfo() {
  console.log('🔄 Updating brand information from documentation...\n');

  try {
    // Upsert Blazing Star
    await prisma.brand.upsert({
      where: { slug: 'blazing-star' },
      update: {
        description: `Professional-grade nail products focused on performance, safety, and ease of use. Made in the UK.

**Positioning:** Professional-grade, UK-made, performance & safety focused

**Tone:** Professional, technical, elegant yet approachable; education-first

**Target Audience:** Nail technicians and salon professionals

**Core Values:** Durable, Glossy, Simple, Hypoallergenic, Versatile

**Visual Identity:** Modern, clean, premium, trustworthy

**Origin:** Made in the UK

**Voice:** Education-first approach, prioritize salon owners, leverage professional credibility

**Product Lines:**
- 362+ gel polish colors across 10 palettes
- Builder gels (FlexiBuild X, StrongBuild)
- Acrylic sculpting system (Maxx Perform powders)
- Professional nail essentials
- Spa products`,
      },
      create: {
        name: 'Blazing Star',
        slug: 'blazing-star',
        description: `Professional-grade nail products focused on performance, safety, and ease of use. Made in the UK.

**Positioning:** Professional-grade, UK-made, performance & safety focused

**Tone:** Professional, technical, elegant yet approachable; education-first

**Target Audience:** Nail technicians and salon professionals

**Core Values:** Durable, Glossy, Simple, Hypoallergenic, Versatile

**Visual Identity:** Modern, clean, premium, trustworthy

**Origin:** Made in the UK

**Voice:** Education-first approach, prioritize salon owners, leverage professional credibility

**Product Lines:**
- 362+ gel polish colors across 10 palettes
- Builder gels (FlexiBuild X, StrongBuild)
- Acrylic sculpting system (Maxx Perform powders)
- Professional nail essentials
- Spa products`,
      },
    });
    console.log('✓ Updated Blazing Star');

    // Upsert Bold Berry
    await prisma.brand.upsert({
      where: { slug: 'bold-berry' },
      update: {
        description: `Affordable, trendy, playful nail products. UK-made quality at accessible prices.

**Positioning:** Affordable, trendy, playful, UK-made

**Tone:** Fun, vibrant, energetic

**Target Audience:** Value-conscious salons, trend-seekers

**Core Values:** Trendy, Fun, Accessible, Quality

**Visual Identity:** Vibrant, playful, energetic

**Origin:** Made in the UK

**Product Lines:**
- 432+ gel polish colors
- French Pearl CatEye collection (36 colors)
- Crystal Jelly collection
- Dipping & Ombré powders (240 colors)
- Special effects collections`,
      },
      create: {
        name: 'Bold Berry',
        slug: 'bold-berry',
        description: `Affordable, trendy, playful nail products. UK-made quality at accessible prices.

**Positioning:** Affordable, trendy, playful, UK-made

**Tone:** Fun, vibrant, energetic

**Target Audience:** Value-conscious salons, trend-seekers

**Core Values:** Trendy, Fun, Accessible, Quality

**Visual Identity:** Vibrant, playful, energetic

**Origin:** Made in the UK

**Product Lines:**
- 432+ gel polish colors
- French Pearl CatEye collection (36 colors)
- Crystal Jelly collection
- Dipping & Ombré powders (240 colors)
- Special effects collections`,
      },
    });
    console.log('✓ Updated Bold Berry');

    // Upsert M Berry
    await prisma.brand.upsert({
      where: { slug: 'mberry' },
      update: {
        name: 'M Berry',
        description: `Fashion-forward, sleek nail products for the new generation. Premium quality with precision application.

**Positioning:** Fashion-forward, sleek, new generation

**Tone:** Modern, trendy, professional

**Target Audience:** Upscale salons, nail artists

**Core Values:** Modern, Professional, Sleek, Innovative

**Visual Identity:** Sleek, modern, sophisticated

**Key Feature:** Ultra Smooth brush for precision application

**Product Lines:**
- 144 main gel polish colors
- Chrome effects collection
- Autumn collection
- Premium color palettes`,
      },
      create: {
        name: 'M Berry',
        slug: 'mberry',
        description: `Fashion-forward, sleek nail products for the new generation. Premium quality with precision application.

**Positioning:** Fashion-forward, sleek, new generation

**Tone:** Modern, trendy, professional

**Target Audience:** Upscale salons, nail artists

**Core Values:** Modern, Professional, Sleek, Innovative

**Visual Identity:** Sleek, modern, sophisticated

**Key Feature:** Ultra Smooth brush for precision application

**Product Lines:**
- 144 main gel polish colors
- Chrome effects collection
- Autumn collection
- Premium color palettes`,
      },
    });
    console.log('✓ Updated M Berry');

    // Upsert Pastel
    await prisma.brand.upsert({
      where: { slug: 'pastel' },
      update: {
        description: `Aesthetic, trendy, lifestyle-focused nail products. Perfect for Instagram-driven trends.

**Positioning:** Aesthetic, trendy, lifestyle-focused

**Tone:** Playful, stylish

**Target Audience:** Trendy salons, Instagram-driven customers

**Core Values:** Aesthetic, Trendy, Stylish, Creative

**Visual Identity:** Soft, aesthetic, trendy

**Collections:**
- Princess Collection
- French Tip Collection
- Coquette Collection`,
      },
      create: {
        name: 'Pastel',
        slug: 'pastel',
        description: `Aesthetic, trendy, lifestyle-focused nail products. Perfect for Instagram-driven trends.

**Positioning:** Aesthetic, trendy, lifestyle-focused

**Tone:** Playful, stylish

**Target Audience:** Trendy salons, Instagram-driven customers

**Core Values:** Aesthetic, Trendy, Stylish, Creative

**Visual Identity:** Soft, aesthetic, trendy

**Collections:**
- Princess Collection
- French Tip Collection
- Coquette Collection`,
      },
    });
    console.log('✓ Updated Pastel')

    // Summary
    console.log('\n📊 Summary:');
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    brands.forEach((brand) => {
      console.log(`  • ${brand.name}: ${brand._count.products} products`);
    });

    console.log('\n✅ Brand information updated successfully!\n');
  } catch (error) {
    console.error('❌ Error updating brands:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateBrandInfo();
