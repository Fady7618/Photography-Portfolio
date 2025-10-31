import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { GalleryFilters } from '@/app/types/image';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: GalleryFilters = {
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const skip = ((filters.page || 1) - 1) * (filters.limit || 20);

    // Build where clause for MongoDB
    const where: any = {};
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    // MongoDB supports array operations natively
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags // MongoDB array contains operation
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.galleryImage.count({ where });
    
    // Get images with pagination (without wedding relation for now)
    const images = await prisma.galleryImage.findMany({
      where,
      // Remove the include for now since wedding relation is commented out
      // include: {
      //   wedding: {
      //     select: {
      //       id: true,
      //       coupleName: true,
      //       weddingDate: true,
      //       location: true,
      //     },
      //   },
      // },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: filters.limit || 20,
    });

    const totalPages = Math.ceil(totalCount / (filters.limit || 20));
    const currentPage = filters.page || 1;

    return NextResponse.json({
      images,
      totalCount,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });
  } catch (error) {
    console.error('Gallery API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}