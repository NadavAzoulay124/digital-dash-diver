
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, TrendingUp, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlatformMetric {
  platform: string;
  metric: string;
  value: number;
  previousValue: number;
  changePercentage: number;
}

interface KeywordPerformance {
  keyword: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  lastConversionDate: string;
}

// Mock data - in a real application, this would come from your analytics APIs
const platformMetrics: PlatformMetric[] = [
  {
    platform: "Instagram",
    metric: "Engagement Rate",
    value: 3.9,
    previousValue: 3.0,
    changePercentage: 30
  },
  {
    platform: "Facebook",
    metric: "Post Reach",
    value: 15000,
    previousValue: 12000,
    changePercentage: 25
  },
  {
    platform: "Google Ads",
    metric: "Conversion Rate",
    value: 2.1,
    previousValue: 2.5,
    changePercentage: -16
  }
];

const keywordPerformance: KeywordPerformance[] = [
  {
    keyword: "digital marketing services",
    platform: "Google Ads",
    impressions: 1200,
    clicks: 45,
    conversions: 0,
    lastConversionDate: "2023-11-15"
  },
  {
    keyword: "social media management",
    platform: "Google Ads",
    impressions: 2500,
    clicks: 120,
    conversions: 8,
    lastConversionDate: "2024-02-25"
  }
];

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const generateInsights = () => {
    const insights: string[] = [];

    // Check for significant engagement increases
    platformMetrics.forEach((metric) => {
      if (metric.changePercentage >= 20) {
        insights.push(
          `📈 ${metric.platform} ${metric.metric} has increased by ${metric.changePercentage}%. Consider sharing this positive trend with the client.`
        );
      }
    });

    // Check for underperforming keywords
    const today = new Date();
    keywordPerformance.forEach((keyword) => {
      const lastConversion = new Date(keyword.lastConversionDate);
      const daysSinceConversion = Math.floor((today.getTime() - lastConversion.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceConversion > 90 && keyword.impressions > 1000) {
        insights.push(
          `⚠️ The keyword "${keyword.keyword}" on ${keyword.platform} hasn't generated conversions for ${daysSinceConversion} days despite ${keyword.impressions} impressions. Consider pausing or optimizing this keyword.`
        );
      }
    });

    return insights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const insights = generateInsights();
    let aiResponse = `Based on the current campaign data:\n\n`;
    
    insights.forEach((insight) => {
      aiResponse += `${insight}\n\n`;
    });

    aiResponse += `Additionally, here's a response to your specific query: ${query}\n`;
    aiResponse += `I recommend reviewing these insights and taking appropriate action to optimize campaign performance.`;

    setResponse(aiResponse);
    
    toast({
      title: "AI Insights Generated",
      description: "Analysis of campaign performance and recommendations are ready.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Campaign Assistant</CardTitle>
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
          <Button type="submit">Get AI Insights</Button>
          
          {response && (
            <div className="mt-4 space-y-4">
              {generateInsights().map((insight, index) => (
                <Alert key={index} variant={insight.includes("⚠️") ? "destructive" : "default"}>
                  {insight.includes("⚠️") ? (
                    <AlertTriangle className="h-4 w-4" />
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
