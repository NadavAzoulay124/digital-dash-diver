
import { PlatformMetric, KeywordPerformance, SocialPost, LeadComment } from "../types/ai-assistant";

export const generateInsights = (
  platformMetrics: PlatformMetric[],
  keywordPerformance: KeywordPerformance[],
  recentPosts: SocialPost[],
  leadComments: LeadComment[],
  selectedClient: string
): string[] => {
  let insights: string[] = [];

  // Platform Metrics Analysis
  platformMetrics.forEach((metric) => {
    if (
      selectedClient === "all" ||
      metric.accountId === selectedClient ||
      metric.campaignId === selectedClient
    ) {
      if (metric.changePercentage >= 20) {
        insights.push(
          `📈 ${metric.platform} ${metric.metric} has increased significantly by ${metric.changePercentage}%. This is a great achievement to share with the client and potentially replicate the successful strategy across other campaigns.`
        );
      } else if (metric.changePercentage <= -15) {
        insights.push(
          `📉 ${metric.platform} ${metric.metric} has decreased by ${Math.abs(metric.changePercentage)}%. Consider reviewing recent changes and adjusting the strategy accordingly.`
        );
      }
    }
  });

  // Keyword Performance Analysis
  keywordPerformance.forEach((keyword) => {
    const today = new Date();
    const lastConversion = new Date(keyword.lastConversionDate);
    const daysSinceConversion = Math.floor(
      (today.getTime() - lastConversion.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceConversion > 90 && keyword.impressions > 1000) {
      insights.push(
        `⚠️ The keyword "${keyword.keyword}" on ${keyword.platform} hasn't generated conversions for ${daysSinceConversion} days despite ${keyword.impressions} impressions and $${keyword.cost.toFixed(2)} spent. Recommend pausing this keyword and reallocating budget to better-performing keywords.`
      );
    }

    if (keyword.cpc > 5 && keyword.conversions === 0) {
      insights.push(
        `💰 High CPC Alert: "${keyword.keyword}" has a CPC of $${keyword.cpc.toFixed(2)} with no conversions. Consider adjusting bid strategy or reviewing targeting settings.`
      );
    }
  });

  // Social Posts Analysis
  recentPosts.forEach((post) => {
    const engagementRate = (post.engagement / post.reach) * 100;
    if (engagementRate > 10) {
      insights.push(
        `🌟 High-performing ${post.platform} post: "${post.content}" achieved ${engagementRate.toFixed(1)}% engagement rate. Consider boosting this post and creating similar content.`
      );
    }
  });

  // Lead Comments Analysis
  const commentsByCategory = leadComments.reduce((acc, comment) => {
    if (selectedClient === "all" || comment.clientId === selectedClient) {
      acc[comment.category || "other"] = (acc[comment.category || "other"] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  if (commentsByCategory["distance"] >= 2) {
    insights.push(
      `⚠️ Multiple leads have reported distance issues (${commentsByCategory["distance"]} comments). Consider adjusting your targeting radius or discussing service area expansion with the client.`
    );
  }

  if (commentsByCategory["scheduling"] >= 2) {
    insights.push(
      `⚠️ There are ${commentsByCategory["scheduling"]} comments about scheduling difficulties. Recommend reviewing the call coordination process and possibly implementing an automated scheduling system.`
    );
  }

  const recentComments = leadComments.filter((comment) => {
    const commentDate = new Date(comment.date);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - commentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 7 && (selectedClient === "all" || comment.clientId === selectedClient);
  });

  if (recentComments.length > 0) {
    const urgentCategories = recentComments.reduce((acc, comment) => {
      acc[comment.category || "other"] = (acc[comment.category || "other"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(urgentCategories).forEach(([category, count]) => {
      if (count >= 2) {
        insights.push(
          `🚨 Urgent: ${count} ${category} issues reported in the last 7 days. Immediate attention required.`
        );
      }
    });
  }

  return insights;
};
