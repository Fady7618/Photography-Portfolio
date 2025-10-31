const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed MongoDB with real images...');

  // Clear existing data first
  try {
    await prisma.galleryImage.deleteMany({});
    console.log('🧹 Cleared existing images');
  } catch (error) {
    console.log('ℹ️ No existing data to clear');
  }

  // Create gallery images with your real Cloudinary images
  const image1 = await prisma.galleryImage.create({
    data: {
      title: 'Wedding Ceremony',
      description: 'Beautiful outdoor wedding ceremony',
      imageUrl: 'https://res.cloudinary.com/dz4rcp3mt/image/upload/v1761427040/wedding1_mdxcv8.jpg',
      publicId: 'wedding1_mdxcv8', // Extracted from the URL
      width: 1920,
      height: 1280,
      category: 'wedding',
      tags: ['ceremony', 'outdoor', 'romantic'],
      featured: true,
      sortOrder: 1,
    },
  });

  const image2 = await prisma.galleryImage.create({
    data: {
      title: 'Bride Getting Ready',
      description: 'Bride preparing for her special day',
      imageUrl: 'https://res.cloudinary.com/dz4rcp3mt/image/upload/v1761427032/wedding2_u54mkg.webp',
      publicId: 'wedding2_u54mkg', // Extracted from the URL
      width: 1920,
      height: 1280,
      category: 'portrait',
      tags: ['bride', 'preparation', 'beauty'],
      featured: true,
      sortOrder: 2,
    },
  });

  const image3 = await prisma.galleryImage.create({
    data: {
      title: 'Romantic Portrait',
      description: 'Beautiful couple portrait',
      imageUrl: 'https://res.cloudinary.com/dz4rcp3mt/image/upload/v1761427031/wedding3_mnesrw.webp',
      publicId: 'wedding3_mnesrw', // Extracted from the URL
      width: 1920,
      height: 1280,
      category: 'portrait',
      tags: ['couple', 'romantic', 'portrait'],
      featured: true,
      sortOrder: 3,
    },
  });

  // Add more images as needed...

  console.log('✅ MongoDB seeded successfully with real images!');
  console.log('📊 Created 5 gallery images');
  console.log('🎯 You can now view the real data in MongoDB Compass!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });