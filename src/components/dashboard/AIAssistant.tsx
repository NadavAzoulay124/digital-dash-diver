
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsightsDisplay } from "./components/InsightsDisplay";
import { generateInsights } from "./utils/insightsGenerator";
import {
  platformMetrics,
  keywordPerformance,
  recentPosts,
  leadComments,
} from "./data/mockData";

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uniqueClients = Array.from(
    new Set([
      ...platformMetrics.map((m) => m.accountId),
      ...platformMetrics.map((m) => m.campaignId),
    ])
  ).filter(Boolean) as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    const insights = generateInsights(
      platformMetrics,
      keywordPerformance,
      recentPosts,
      leadComments,
      selectedClient
    );

    try {
      const { data, error } = await supabase.functions.invoke("generate-insights", {
        body: JSON.stringify({
          query,
          insights,
          selectedClient,
        }),
      });

      if (error) {
        console.error("Error calling generate-insights:", error);
        toast({
          title: "Error",
          description: "Failed to generate AI insights. Please try again.",
          variant: "destructive",
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
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialInsights = generateInsights(
    platformMetrics,
    keywordPerformance,
    recentPosts,
    leadComments,
    selectedClient
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Client Insights
            </CardTitle>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
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
        <CardContent>
          <InsightsDisplay insights={initialInsights} />
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
