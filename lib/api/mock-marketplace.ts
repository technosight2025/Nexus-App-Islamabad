import { ApiError, type ApiResponse } from "@/lib/api/types";

interface MockCategory {
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

interface MockListing {
  id: string;
  ownerId: string;
  professionalName: string;
  professionalAvatarUrl?: string;
  title: string;
  description: string;
  category: MockCategory;
  city: string;
  basePrice: number;
  currency: "PKR";
  coverImageUrl?: string;
  averageRating: number;
  reviewCount: number;
  completedBookingsCount: number;
  status: "draft" | "pending_review" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface MockSearchResult {
  listings: MockListing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const now = "2026-06-16T00:00:00.000Z";

const categories: MockCategory[] = [
  {
    id: "cat-photography",
    name: "Photography",
    slug: "photography",
    description: "Wedding, fashion, product, and event photographers.",
    listingCount: 18,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-videography",
    name: "Videography",
    slug: "videography",
    description: "Cinematic event films, reels, and commercial video teams.",
    listingCount: 14,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-design",
    name: "Design",
    slug: "design",
    description: "Brand, social media, motion, and campaign designers.",
    listingCount: 11,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-event-production",
    name: "Event Production",
    slug: "event-production",
    description: "Creative directors, planners, decor, staging, and production crews.",
    listingCount: 9,
    createdAt: now,
    updatedAt: now,
  },
];

const listings: MockListing[] = [
  {
    id: "lst-001",
    ownerId: "usr-101",
    professionalName: "FrameHaus Studio",
    title: "Wedding photography with same-day highlight edits",
    description: "Editorial wedding coverage for Islamabad and Rawalpindi events with curated galleries.",
    category: categories[0],
    city: "Islamabad",
    basePrice: 85000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552",
    averageRating: 4.9,
    reviewCount: 86,
    completedBookingsCount: 142,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lst-002",
    ownerId: "usr-102",
    professionalName: "North Films Co.",
    title: "Cinematic event film crew for premium gatherings",
    description: "Multi-camera film production, drone coverage, reels, and delivery-ready edits.",
    category: categories[1],
    city: "Lahore",
    basePrice: 140000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    averageRating: 4.8,
    reviewCount: 64,
    completedBookingsCount: 97,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lst-003",
    ownerId: "usr-103",
    professionalName: "Pixel Bazaar",
    title: "Brand launch visuals and social media design kit",
    description: "Campaign-ready identity assets, social templates, and art direction for launches.",
    category: categories[2],
    city: "Karachi",
    basePrice: 45000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd",
    averageRating: 4.7,
    reviewCount: 52,
    completedBookingsCount: 73,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lst-004",
    ownerId: "usr-104",
    professionalName: "Mehfil Makers",
    title: "Full-service mehndi and engagement production",
    description: "Concept, decor, lighting, vendor coordination, and on-ground production management.",
    category: categories[3],
    city: "Islamabad",
    basePrice: 220000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    averageRating: 4.9,
    reviewCount: 41,
    completedBookingsCount: 58,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lst-005",
    ownerId: "usr-105",
    professionalName: "Studio Saffron",
    title: "Product photography for ecommerce catalogs",
    description: "Clean catalog photography, lifestyle sets, retouching, and marketplace-ready exports.",
    category: categories[0],
    city: "Karachi",
    basePrice: 30000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    averageRating: 4.6,
    reviewCount: 38,
    completedBookingsCount: 65,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lst-006",
    ownerId: "usr-106",
    professionalName: "ReelCraft Pakistan",
    title: "Short-form reels team for corporate events",
    description: "Fast social-first event coverage with vertical edits, captions, and delivery within 48 hours.",
    category: categories[1],
    city: "Islamabad",
    basePrice: 65000,
    currency: "PKR",
    coverImageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    averageRating: 4.5,
    reviewCount: 29,
    completedBookingsCount: 44,
    status: "approved",
    createdAt: now,
    updatedAt: now,
  },
];

export async function resolveMockMarketplaceRequest<TData>(
  path: string,
  method = "GET",
): Promise<ApiResponse<TData> | undefined> {
  if (method !== "GET") {
    return undefined;
  }

  const url = new URL(path, "https://nexus.local");
  const pathname = url.pathname;

  if (pathname === "/api/marketplace/categories") {
    return asResponse(categories);
  }

  if (pathname === "/api/marketplace/listings") {
    return asResponse(searchMockListings(url.searchParams));
  }

  if (pathname.startsWith("/api/marketplace/listings/")) {
    const listingId = decodeURIComponent(pathname.replace("/api/marketplace/listings/", ""));
    const listing = listings.find((item) => item.id === listingId);

    if (!listing) {
      throw new ApiError("Listing not found.", 404, {
        message: "Listing not found.",
        code: "MARKETPLACE_LISTING_NOT_FOUND",
      });
    }

    return asResponse(listing);
  }

  return undefined;
}

function searchMockListings(params: URLSearchParams): MockSearchResult {
  const query = normalizeText(params.get("query"));
  const categorySlug = normalizeText(params.get("categorySlug"));
  const city = normalizeText(params.get("city"));
  const minPrice = normalizeNumber(params.get("minPrice"));
  const maxPrice = normalizeNumber(params.get("maxPrice"));
  const minRating = normalizeNumber(params.get("minRating"));
  const page = normalizePositiveInteger(params.get("page")) ?? 1;
  const pageSize = normalizePositiveInteger(params.get("pageSize")) ?? 24;
  const sort = normalizeText(params.get("sort"));

  const filteredListings = listings
    .filter((listing) => listing.status === "approved")
    .filter((listing) => {
      if (!query) {
        return true;
      }

      const searchableText = [
        listing.title,
        listing.description,
        listing.professionalName,
        listing.category.name,
        listing.city,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query.toLowerCase());
    })
    .filter((listing) => (categorySlug ? listing.category.slug === categorySlug : true))
    .filter((listing) => (city ? listing.city.toLowerCase() === city.toLowerCase() : true))
    .filter((listing) => (minPrice === undefined ? true : listing.basePrice >= minPrice))
    .filter((listing) => (maxPrice === undefined ? true : listing.basePrice <= maxPrice))
    .filter((listing) => (minRating === undefined ? true : listing.averageRating >= minRating));

  const sortedListings = [...filteredListings].sort((left, right) => {
    if (sort === "price_asc") {
      return left.basePrice - right.basePrice;
    }

    if (sort === "price_desc") {
      return right.basePrice - left.basePrice;
    }

    if (sort === "rating_desc") {
      return right.averageRating - left.averageRating;
    }

    if (sort === "newest") {
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    }

    return right.completedBookingsCount - left.completedBookingsCount;
  });

  const start = (page - 1) * pageSize;
  const paginatedListings = sortedListings.slice(start, start + pageSize);

  return {
    listings: paginatedListings,
    total: sortedListings.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(sortedListings.length / pageSize)),
  };
}

function asResponse<TData>(data: TData): ApiResponse<TData> {
  return { data };
}

function normalizeText(value: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function normalizeNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function normalizePositiveInteger(value: string | null) {
  const parsedValue = normalizeNumber(value);

  if (parsedValue === undefined || !Number.isInteger(parsedValue) || parsedValue < 1) {
    return undefined;
  }

  return parsedValue;
}
