import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Copy } from "lucide-react";

export const CampaignInsights = () => {
  // This would typically come from an API
  const insights = {
    topPerformingAd: {
      name: "Summer Sale Banner",
      platform: "Meta",
      leads: 145,
      conversionRate: "3.2%"
    },
    bestCopy: {
      text: "Limited Time Offer: 50% Off Premium Services",
      clicks: 2800,
      conversions: 89
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Ad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Campaign</span>
              <span className="font-semibold">{insights.topPerformingAd.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform</span>
              <span>{insights.topPerformingAd.platform}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Leads</span>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{insights.topPerformingAd.leads}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-green-600">{insights.topPerformingAd.conversionRate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Best Performing Copy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium">Ad Copy</span>
              <p className="mt-1 text-sm">{insights.bestCopy.text}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Clicks</span>
              <span>{insights.bestCopy.clicks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversions</span>
              <span>{insights.bestCopy.conversions}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};