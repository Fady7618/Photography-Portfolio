const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed local MongoDB (simple version)...');

  // Create gallery images without wedding relations first
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
      // No weddingId for now
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
    },
  });

  console.log('✅ MongoDB seeded successfully!');
  console.log('📊 Created 5 gallery images');
  console.log('🎯 You can now view the data in MongoDB Compass!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });