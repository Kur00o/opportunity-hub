export type OpportunityCategory = 'hackathon' | 'internship' | 'opensource' | 'fellowship';
export type OpportunityMode = 'online' | 'offline' | 'hybrid';
export type OpportunityLevel = 'beginner' | 'intermediate' | 'advanced';
export type OpportunityStatus = 'upcoming' | 'ongoing' | 'past';

export interface Opportunity {
  id: string;
  name: string;
  organizer: string;
  description: string;
  category: OpportunityCategory;
  mode: OpportunityMode;
  level: OpportunityLevel;
  
  // Dates
  applicationStart: Date;
  applicationEnd: Date;
  eventStart: Date;
  eventEnd: Date;
  
  // Location
  location?: string;
  country: string;
  isIndiaFocused: boolean;
  
  // Details
  eligibility: string[];
  techStack: string[];
  domains: string[];
  stipend?: string;
  prizes?: string;
  selectionCriteria?: string;
  
  // Links
  officialLink: string;
  applicationLink?: string;
  
  // Meta
  logoUrl?: string;
  bannerUrl?: string;
  featured: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityFilters {
  category?: OpportunityCategory[];
  mode?: OpportunityMode[];
  level?: OpportunityLevel[];
  status?: OpportunityStatus;
  domains?: string[];
  indiaOnly?: boolean;
  hasStipend?: boolean;
  search?: string;
}

export const DOMAINS = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'Data Science',
  'IoT',
  'Game Development',
  'DevOps',
  'Systems Programming',
  'Open Source',
] as const;

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  hackathon: 'Hackathon',
  internship: 'Internship',
  opensource: 'Open Source Program',
  fellowship: 'Fellowship',
};

export const MODE_LABELS: Record<OpportunityMode, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};

export const LEVEL_LABELS: Record<OpportunityLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
