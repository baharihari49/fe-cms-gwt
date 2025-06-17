// types/hero.ts
export interface HeroSection {
  id: string;
  welcomeText: string;
  mainTitle: string;
  highlightText: string;
  description: string;
  logo: string | null;
  image: string | null;
  altText: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroData {
  heroSection: HeroSection | null;
  socialMedia: SocialMedia[];
}

// Request types
export interface CreateHeroSectionRequest {
  welcomeText: string;
  mainTitle: string;
  highlightText: string;
  description: string;
  logo?: string;
  image?: string;
  altText?: string;
  isActive?: boolean;
}

export interface UpdateHeroSectionRequest extends Partial<CreateHeroSectionRequest> {
  id: string;
}

export interface CreateSocialMediaRequest {
  name: string;
  url: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateSocialMediaRequest extends Partial<CreateSocialMediaRequest> {
  id: string;
}

// Response types
export interface HeroResponse {
  success: boolean;
  data: HeroData;
  message?: string;
}

export interface HeroSectionResponse {
  success: boolean;
  data: HeroSection;
  message?: string;
}

export interface HeroSectionsResponse {
  success: boolean;
  data: HeroSection[];
  message?: string;
}

export interface SocialMediaResponse {
  success: boolean;
  data: SocialMedia[];
  message?: string;
}

export interface SocialMediaItemResponse {
  success: boolean;
  data: SocialMedia;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface PaginatedSocialMediaResponse {
  success: boolean;
  data: SocialMedia[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}