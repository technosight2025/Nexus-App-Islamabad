export type ListingStatus = "draft" | "pending_review" | "approved" | "rejected";
export type ListingSort = "recommended" | "price_asc" | "price_desc" | "rating_desc" | "newest";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  parentId?: string;
  listingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  professionalName: string;
  professionalAvatarUrl?: string;
  title: string;
  description: string;
  category: Category;
  city: string;
  basePrice: number;
  currency: "PKR";
  coverImageUrl?: string;
  averageRating: number;
  reviewCount: number;
  completedBookingsCount: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  categorySlug?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  pageSize?: number;
  sort?: ListingSort;
}

export interface MarketplaceSearchResult {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
