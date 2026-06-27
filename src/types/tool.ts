export interface Tool {
  id: number;
  name: string;
  official_url: string;
  category: string;
  primary_use_case: string;

  free_access_type: string;
  free_limit: string;
  watermark: string;
  audio_support: string;

  max_duration: number | null;

  quality_score: number | null;
  speed_score: number | null;
  ease_score: number | null;

  description_en: string;
  description_zh: string;

  best_for_en?: string;
  best_for_zh?: string;
  limitation_en?: string;
  limitation_zh?: string;

  last_verified: string;
  source_url: string;
}

export type SortField =
  | "quality_score"
  | "speed_score"
  | "ease_score"
  | "max_duration";

export interface FilterState {
  search: string;
  category: string;
  watermark: string;
  audio_support: string;
  free_access_type: string;
  sort_by: SortField;
  sort_order: "asc" | "desc";
}

export const CATEGORIES = [
  "Text-to-Video",
  "Image-to-Video",
  "Video-to-Video",
  "3D Generation",
  "Avatar & Talking Head",
  "Video Editing",
  "Long Video",
  "Character Animation",
];

export const FREE_ACCESS_TYPES = [
  "Free Forever",
  "Freemium",
  "Free Trial",
  "Paid Only",
];

export const WATERMARK_OPTIONS = ["No Watermark", "Has Watermark"];
export const AUDIO_OPTIONS = ["Audio Supported", "No Audio"];

// Submission type for user-submitted tools (pending review)
export interface ToolSubmission {
  id: number;
  name: string;
  official_url: string;
  category: string;
  free_access_type: string;
  description_en: string;
  description_zh: string;
  submitter_email: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
}

export const SUBMISSION_CATEGORIES = [
  "Text-to-Video",
  "Image-to-Video",
  "Video-to-Video",
  "3D Generation",
  "Avatar & Talking Head",
  "Video Editing",
  "Long Video",
  "Character Animation",
  "Other",
];
