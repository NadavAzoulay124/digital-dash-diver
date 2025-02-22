
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, DollarSign, Target, TrendingUp } from "lucide-react";

interface InsightsDisplayProps {
  insights: string[];
}

export const InsightsDisplay = ({ insights }: InsightsDisplayProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, index) => (
        <Alert
          key={index}
          variant={
            insight.includes("⚠️")
              ? "destructive"
              : insight.includes("📉")
              ? "destructive"
              : "default"
          }
        >
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
  );
};
