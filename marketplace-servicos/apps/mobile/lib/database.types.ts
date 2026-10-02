/**
 * Tipos TypeScript gerados do schema Supabase.
 * Em produção, usar: npx supabase gen types typescript --linked > lib/database.types.ts
 */

export type UserRole = "client" | "provider" | "admin";
export type AvailabilityStatus = "available_now" | "available_today" | "unavailable";
export type RequestStatus =
  | "pending"
  | "matched"
  | "negotiating"
  | "in_progress"
  | "completed"
  | "cancelled";
export type MatchStatus = "pending" | "accepted" | "declined" | "expired";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  city: string | null;
  state: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  bio: string | null;
  avg_rating: number;
  total_reviews: number;
  location_point: unknown;
  address_text: string | null;
  service_radius_km: number;
  availability_status: AvailabilityStatus;
  response_time_avg_h: number | null;
  verified: boolean;
  portfolio_photos: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  created_at: string;
}

export interface ProviderService {
  id: string;
  provider_id: string;
  tag_id: string | null;
  custom_description: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  raw_input: string | null;
  matched_category_id: string | null;
  matched_tags: string[];
  status: RequestStatus;
  location_point: unknown;
  address_text: string | null;
  scheduled_for: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  request_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  photos: string[];
  created_at: string;
}

// Tipo retornado pela função find_providers_nearby
export interface ProviderNearby {
  provider_id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  avg_rating: number;
  total_reviews: number;
  availability_status: AvailabilityStatus;
  distance_km: number;
  portfolio_photos: string[];
  services: Array<{
    tag_id: string;
    tag_name: string;
    tag_slug: string;
    price_min: number | null;
    price_max: number | null;
  }>;
}

export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: Omit<User, "created_at" | "updated_at">; Update: Partial<User> };
      provider_profiles: { Row: ProviderProfile; Insert: Omit<ProviderProfile, "id" | "created_at" | "updated_at" | "avg_rating" | "total_reviews">; Update: Partial<ProviderProfile> };
      categories: { Row: Category; Insert: Omit<Category, "id" | "created_at">; Update: Partial<Category> };
      tags: { Row: Tag; Insert: Omit<Tag, "id" | "created_at">; Update: Partial<Tag> };
      service_requests: { Row: ServiceRequest; Insert: Omit<ServiceRequest, "id" | "created_at" | "updated_at">; Update: Partial<ServiceRequest> };
      messages: { Row: Message; Insert: Omit<Message, "id" | "created_at">; Update: Partial<Message> };
      reviews: { Row: Review; Insert: Omit<Review, "id" | "created_at">; Update: Partial<Review> };
    };
    Functions: {
      find_providers_nearby: {
        Args: { lat: number; lng: number; radius_km?: number; filter_status?: AvailabilityStatus | null; filter_category?: string | null; result_limit?: number };
        Returns: ProviderNearby[];
      };
    };
  };
};
