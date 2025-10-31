export interface GalleryImage {
  id: string; // MongoDB ObjectId as string
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  weddingId?: string;
  // Remove wedding relation for now
  // wedding?: {
  //   id: string;
  //   coupleName: string;
  //   weddingDate: string;
  //   location: string;
  // };
}

export interface PaginationData {
  images: GalleryImage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GalleryFilters {
  category?: string;
  featured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
}