
import { DollarSign, Target, ShoppingCart, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { calculatePercentageChange } from "@/utils/metricsUtils";
import type { Campaign } from "@/components/dashboard/types";

interface DashboardMetricsProps {
  metrics: {
    totalSpent: number;
    totalResults: number;
    conversionRate: number;
    costPerResult: number;
    previousTotalSpent: number;
    previousTotalResults: number;
    previousConversionRate: number;
    previousCostPerResult: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const resultsChange = calculatePercentageChange(metrics.totalResults, metrics.previousTotalResults);
  const conversionChange = calculatePercentageChange(metrics.conversionRate, metrics.previousConversionRate);
  const costPerResultChange = calculatePercentageChange(metrics.costPerResult, metrics.previousCostPerResult);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Spent"
        value={`$${metrics.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={`${spentChange.toFixed(1)}%`}
        isPositive={spentChange >= 0}
        icon={DollarSign}
      />
      <MetricCard
        title="Total Results"
        value={metrics.totalResults.toString()}
        change={`${resultsChange.toFixed(1)}%`}
        isPositive={resultsChange >= 0}
        icon={ShoppingCart}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(2)}%`}
        change={`${conversionChange.toFixed(1)}%`}
        isPositive={conversionChange >= 0}
        icon={Target}
      />
      <MetricCard
        title="Cost per Result"
        value={`$${metrics.costPerResult.toFixed(2)}`}
        change={`${costPerResultChange.toFixed(1)}%`}
        isPositive={costPerResultChange <= 0}
        icon={TrendingUp}
      />
    </div>
  );
};
