
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, TrendingUp, Target, DollarSign, Users, BarChart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface LeadComment {
  leadId: string;
  clientId: string;
  comment: string;
  date: string;
  category?: "distance" | "scheduling" | "pricing" | "other";
  resolved?: boolean;
}

interface Lead {
  id: string;
  name: string;
  location: string;
  status: string;
  comments: LeadComment[];
}

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

const leadComments: LeadComment[] = [
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

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uniqueClients = Array.from(new Set([
    ...platformMetrics.map(m => m.accountId),
    ...platformMetrics.map(m => m.campaignId)
  ])).filter(Boolean) as string[];

  const generateInsights = () => {
    let insights: string[] = [];

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

    recentPosts.forEach((post) => {
      const engagementRate = (post.engagement / post.reach) * 100;
      if (engagementRate > 10) {
        insights.push(
          `🌟 High-performing ${post.platform} post: "${post.content}" achieved ${engagementRate.toFixed(1)}% engagement rate. Consider boosting this post and creating similar content.`
        );
      }
    });

    const analyzeLeadComments = () => {
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

      const recentComments = leadComments.filter(comment => {
        const commentDate = new Date(comment.date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - commentDate.getTime()) / (1000 * 60 * 60 * 24));
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
    };

    analyzeLeadComments();

    return insights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    const insights = generateInsights();

    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: JSON.stringify({
          query,
          insights,
          selectedClient
        })
      });

      if (error) {
        console.error('Error calling generate-insights:', error);
        toast({
          title: "Error",
          description: "Failed to generate AI insights. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.response) {
        setResponse(data.response);
        toast({
          title: "AI Insights Generated",
          description: "Analysis complete! Review the recommendations below.",
        });
      } else {
        toast({
          title: "Error",
          description: "No response received from the AI. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialInsights = generateInsights();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Client Insights
            </CardTitle>
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map((clientId) => (
                  <SelectItem key={clientId} value={clientId}>
                    Client {clientId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {initialInsights.map((insight, index) => (
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask specific questions about campaign performance, social media metrics, or get recommendations..."
                rows={4}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating Insights..." : "Get AI Insights"}
            </Button>
            
            {response && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">{response}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
