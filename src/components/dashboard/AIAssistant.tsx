
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, TrendingUp, Target, DollarSign, Users, BarChart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlatformMetric {
  platform: string;
  metric: string;
  value: number;
  previousValue: number;
  changePercentage: number;
  accountId?: string;
  campaignId?: string;
}

interface KeywordPerformance {
  keyword: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  cpc: number;
  lastConversionDate: string;
}

interface SocialPost {
  platform: string;
  postId: string;
  content: string;
  engagement: number;
  reach: number;
  date: string;
  performanceScore: number;
}

// Enhanced mock data with more detailed metrics
const platformMetrics: PlatformMetric[] = [
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

const keywordPerformance: KeywordPerformance[] = [
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

const recentPosts: SocialPost[] = [
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

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const generateInsights = () => {
    const insights: string[] = [];

    // Check platform performance trends
    platformMetrics.forEach((metric) => {
      if (metric.changePercentage >= 20) {
        insights.push(
          `📈 ${metric.platform} ${metric.metric} has increased significantly by ${metric.changePercentage}%. This is a great achievement to share with the client and potentially replicate the successful strategy across other campaigns.`
        );
      } else if (metric.changePercentage <= -15) {
        insights.push(
          `📉 ${metric.platform} ${metric.metric} has decreased by ${Math.abs(metric.changePercentage)}%. Consider reviewing recent changes and adjusting the strategy accordingly.`
        );
      }
    });

    // Analyze keyword performance
    keywordPerformance.forEach((keyword) => {
      const today = new Date();
      const lastConversion = new Date(keyword.lastConversionDate);
      const daysSinceConversion = Math.floor((today.getTime() - lastConversion.getTime()) / (1000 * 60 * 60 * 24));

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

    // Analyze social post performance
    recentPosts.forEach((post) => {
      const engagementRate = (post.engagement / post.reach) * 100;
      if (engagementRate > 10) {
        insights.push(
          `🌟 High-performing ${post.platform} post: "${post.content}" achieved ${engagementRate.toFixed(1)}% engagement rate. Consider boosting this post and creating similar content.`
        );
      }
    });

    return insights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const insights = generateInsights();
    let aiResponse = `Based on the comprehensive analysis of your campaigns:\n\n`;
    
    insights.forEach((insight) => {
      aiResponse += `${insight}\n\n`;
    });

    // Add query-specific response
    if (query.toLowerCase().includes("performance")) {
      aiResponse += `\nRegarding your performance query: The best performing platform currently is ${
        platformMetrics.reduce((a, b) => a.changePercentage > b.changePercentage ? a : b).platform
      } with significant growth in key metrics.\n`;
    }

    if (query.toLowerCase().includes("recommendation") || query.toLowerCase().includes("suggest")) {
      aiResponse += `\nTop Recommendations:\n`;
      aiResponse += `1. Focus on high-performing content types identified from recent posts\n`;
      aiResponse += `2. Optimize or pause underperforming keywords\n`;
      aiResponse += `3. Scale successful campaigns with similar audience targeting\n`;
    }

    setResponse(aiResponse);
    
    toast({
      title: "AI Insights Generated",
      description: "Comprehensive analysis of campaign performance and recommendations are ready.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          AI Campaign Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about campaign performance, social media metrics, or get recommendations..."
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">Get AI Insights</Button>
          
          {response && (
            <div className="mt-4 space-y-4">
              {generateInsights().map((insight, index) => (
                <Alert key={index} variant={
                  insight.includes("⚠️") ? "destructive" : 
                  insight.includes("📉") ? "destructive" :
                  "default"
                }>
                  {insight.includes("⚠️") || insight.includes("📉") ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : insight.includes("💰") ? (
                    <DollarSign className="h-4 w-4" />
                  ) : insight.includes("🌟") ? (
                    <Target className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  <AlertDescription>{insight}</AlertDescription>
                </Alert>
              ))}
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">{response}</p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
