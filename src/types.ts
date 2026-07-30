export type PlatformId = 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'threads';

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  file?: File;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  handleExample: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  maxChars: number;
  requiresMedia: boolean;
  minMediaCount?: number;
  maxMediaCount: number;
  supportsFormatting: boolean;
  maxHashtags?: number;
  description: string;
  tips: string;
}

export interface PlatformValidation {
  platformId: PlatformId;
  enabled: boolean;
  charCount: number;
  maxChars: number;
  mediaCount: number;
  isCharValid: boolean;
  isMediaValid: boolean;
  isValid: boolean;
  status: 'pass' | 'warning' | 'error' | 'disabled';
  errors: string[];
  warnings: string[];
}

export interface PostPreset {
  id: string;
  title: string;
  category: string;
  content: string;
  suggestedHashtags: string[];
  sampleMedia?: MediaFile[];
}

export interface SavedDraft {
  id: string;
  title: string;
  content: string;
  media: MediaFile[];
  enabledPlatforms: PlatformId[];
  createdAt: string;
  updatedAt: string;
  scheduledTime?: string;
  isScheduled?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
