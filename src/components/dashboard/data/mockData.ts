import { PlatformMetric, KeywordPerformance, SocialPost, LeadComment } from "../types/ai-assistant";

export const platformMetrics: PlatformMetric[] = [
  {
    platform: "Instagram",
    metric: "Engagement Rate",
    value: 3.9,
    previousValue: 3.0,
    changePercentage: 30,
    accountId: "ig_12345"
  },
  {
    platform: "Instagram",
    metric: "Story Views",
    value: 2500,
    previousValue: 1800,
    changePercentage: 38,
    accountId: "ig_12345"
  },
  {
    platform: "Facebook",
    metric: "Post Reach",
    value: 15000,
    previousValue: 12000,
    changePercentage: 25,
    accountId: "fb_67890"
  },
  {
    platform: "Facebook",
    metric: "Page Likes",
    value: 5000,
    previousValue: 4500,
    changePercentage: 11,
    accountId: "fb_67890"
  },
  {
    platform: "Google Ads",
    metric: "Conversion Rate",
    value: 2.1,
    previousValue: 2.5,
    changePercentage: -16,
    campaignId: "ga_123456"
  },
  {
    platform: "Google Ads",
    metric: "Cost per Conversion",
    value: 45.2,
    previousValue: 52.8,
    changePercentage: -14,
    campaignId: "ga_123456"
  }
];

export const keywordPerformance: KeywordPerformance[] = [
  {
    keyword: "digital marketing services",
    platform: "Google Ads",
    impressions: 1200,
    clicks: 45,
    conversions: 0,
    cost: 250.50,
    cpc: 5.57,
    lastConversionDate: "2023-11-15"
  },
  {
    keyword: "social media management",
    platform: "Google Ads",
    impressions: 2500,
    clicks: 120,
    conversions: 8,
    cost: 480.00,
    cpc: 4.00,
    lastConversionDate: "2024-02-25"
  },
  {
    keyword: "content marketing agency",
    platform: "Google Ads",
    impressions: 800,
    clicks: 28,
    conversions: 0,
    cost: 168.00,
    cpc: 6.00,
    lastConversionDate: "2023-12-10"
  }
];

export const recentPosts: SocialPost[] = [
  {
    platform: "Instagram",
    postId: "ig_post_1",
    content: "Latest digital marketing trends for 2024",
    engagement: 450,
    reach: 2800,
    date: "2024-02-28",
    performanceScore: 8.5
  },
  {
    platform: "Facebook",
    postId: "fb_post_1",
    content: "Client success story: 200% ROI increase",
    engagement: 280,
    reach: 3500,
    date: "2024-02-27",
    performanceScore: 7.8
  }
];

export const leadComments: LeadComment[] = [
  {
    leadId: "lead1",
    clientId: "ig_12345",
    comment: "Lead is too far, over 50 miles away",
    date: "2024-02-25",
    category: "distance",
    resolved: false
  },
  {
    leadId: "lead2",
    clientId: "ig_12345",
    comment: "Couldn't coordinate meeting time, busy schedule",
    date: "2024-02-26",
    category: "scheduling",
    resolved: false
  },
  {
    leadId: "lead3",
    clientId: "fb_67890",
    comment: "Another lead too far from our service area",
    date: "2024-02-27",
    category: "distance",
    resolved: false
  },
  {
    leadId: "lead4",
    clientId: "fb_67890",
    comment: "Third missed call attempt, no response",
    date: "2024-02-28",
    category: "scheduling",
    resolved: false
  }
];
