
export interface PlatformMetric {
  platform: string;
  metric: string;
  value: number;
  previousValue: number;
  changePercentage: number;
  accountId?: string;
  campaignId?: string;
}

export interface KeywordPerformance {
  keyword: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  cpc: number;
  lastConversionDate: string;
}

export interface SocialPost {
  platform: string;
  postId: string;
  content: string;
  engagement: number;
  reach: number;
  date: string;
  performanceScore: number;
}

export interface LeadComment {
  leadId: string;
  clientId: string;
  comment: string;
  date: string;
  category?: "distance" | "scheduling" | "pricing" | "other";
  resolved?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  location: string;
  status: string;
  comments: LeadComment[];
}

