
import { Users, DollarSign, MousePointer, Eye } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFacebookMetrics } from "@/hooks/useFacebookMetrics";
import { calculateMetrics } from "@/utils/metricsCalculator";
import { LoadingMetrics } from "@/components/dashboard/LoadingMetrics";

export const MetricsOverview = () => {
  const { data: facebookData, isError: isFacebookError, isLoading: isFacebookLoading } = useFacebookMetrics();

  if (isFacebookLoading) {
    return <LoadingMetrics />;
  }

  if (isFacebookError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load campaign metrics. Please check your Facebook connection.
        </AlertDescription>
      </Alert>
    );
  }

  const metrics = calculateMetrics(facebookData?.data || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Spent"
        value={`$${metrics.totalSpent.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
        change={`${metrics.spentChange.toFixed(1)}%`}
        isPositive={false}
        icon={DollarSign}
      />
      <MetricCard
        title="Total Clicks"
        value={metrics.totalClicks?.toString() || "0"}
        change={`${metrics.clicksChange || 0}%`}
        isPositive={true}
        icon={MousePointer}
      />
      <MetricCard
        title="Total Impressions"
        value={metrics.totalImpressions?.toString() || "0"}
        change={`${metrics.impressionsChange || 0}%`}
        isPositive={true}
        icon={Eye}
      />
    </div>
  );
};

