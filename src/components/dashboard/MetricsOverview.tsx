
import { DollarSign, MousePointer, Eye } from "lucide-react";
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

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toLocaleString();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Spent"
        value={`$${metrics.totalSpent.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
        change={`${metrics.spentChange.toFixed(1)}%`}
        isPositive={metrics.spentChange <= 0} // For spend, lower is better
        icon={DollarSign}
      />
      <MetricCard
        title="Total Clicks"
        value={formatValue(metrics.totalClicks)}
        change={`${metrics.clicksChange.toFixed(1)}%`}
        isPositive={metrics.clicksChange > 0}
        icon={MousePointer}
      />
      <MetricCard
        title="Total Impressions"
        value={formatValue(metrics.totalImpressions)}
        change={`${metrics.impressionsChange.toFixed(1)}%`}
        isPositive={metrics.impressionsChange > 0}
        icon={Eye}
      />
    </div>
  );
};

