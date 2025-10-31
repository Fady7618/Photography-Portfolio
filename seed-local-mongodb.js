const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed local MongoDB...');

  // Clear existing data first (optional)
  try {
    await prisma.galleryImage.deleteMany({});
    await prisma.wedding.deleteMany({});
    console.log('🧹 Cleared existing data');
  } catch (error) {
    console.log('ℹ️ No existing data to clear');
  }

  // Create sample weddings one by one
  const wedding1 = await prisma.wedding.create({
    data: {
      coupleName: 'John & Jane Smith',
      weddingDate: new Date('2024-06-15'),
      location: 'Central Park, New York',
      description: 'A beautiful outdoor wedding ceremony',
      isPublic: true,
    },
  });

  const wedding2 = await prisma.wedding.create({
    data: {
      coupleName: 'Mike & Sarah Johnson',
      weddingDate: new Date('2024-08-20'),
      location: 'Malibu Beach, California',
      description: 'Sunset beach wedding with ocean views',
      isPublic: true,
    },
  });

  console.log('✅ Created weddings');

  // Create gallery images one by one (instead of createMany)
  const image1 = await prisma.galleryImage.create({
    data: {
      title: 'First Dance',
      description: 'The couple\'s magical first dance',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400/couple.jpg',
      publicId: 'demo/couple',
      width: 1920,
      height: 1280,
      category: 'wedding',
      tags: ['dance', 'romantic', 'evening'],
      featured: true,
      sortOrder: 1,
      weddingId: wedding1.id,
    },
  });

  const image2 = await prisma.galleryImage.create({
    data: {
      title: 'Bride Portrait',
      description: 'Beautiful bride getting ready',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400/woman.jpg',
      publicId: 'demo/woman',
      width: 1920,
      height: 1280,
      category: 'portrait',
      tags: ['bride', 'preparation', 'beauty'],
      featured: true,
      sortOrder: 2,
      weddingId: wedding1.id,
    },
  });

  const image3 = await prisma.galleryImage.create({
    data: {
      title: 'Beach Ceremony',
      description: 'Oceanside wedding ceremony',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400/beach.jpg',
      publicId: 'demo/beach',
      width: 1920,
      height: 1280,
      category: 'wedding',
      tags: ['ceremony', 'beach', 'outdoor'],
      featured: false,
      sortOrder: 3,
      weddingId: wedding2.id,
    },
  });

  const image4 = await prisma.galleryImage.create({
    data: {
      title: 'Wedding Rings',
      description: 'Beautiful wedding rings close-up',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400/accessories.jpg',
      publicId: 'demo/accessories',
      width: 1920,
      height: 1280,
      category: 'detail',
      tags: ['rings', 'detail', 'jewelry'],
      featured: true,
      sortOrder: 4,
      weddingId: wedding1.id,
    },
  });

  const image5 = await prisma.galleryImage.create({
    data: {
      title: 'Bouquet Toss',
      description: 'The traditional bouquet toss moment',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400/flowers.jpg',
      publicId: 'demo/flowers',
      width: 1920,
      height: 1280,
      category: 'event',
      tags: ['bouquet', 'tradition', 'celebration'],
      featured: false,
      sortOrder: 5,
      weddingId: wedding2.id,
    },
  });

  console.log('✅ Local MongoDB seeded successfully!');
  console.log('📊 Created:');
  console.log('- 2 weddings');
  console.log('- 5 gallery images');
  console.log('🎯 You can now view the data in MongoDB Compass!');
  console.log(`📝 Wedding 1 ID: ${wedding1.id}`);
  console.log(`📝 Wedding 2 ID: ${wedding2.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });