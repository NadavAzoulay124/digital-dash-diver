
import { DollarSign, Target, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { calculatePercentageChange } from "@/utils/metricsUtils";

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
  const costPerResultChange = calculatePercentageChange(metrics.costPerResult, metrics.previousCostPerResult);
  const conversionChange = calculatePercentageChange(metrics.conversionRate, metrics.previousConversionRate);

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
        title="Cost per Result"
        value={`$${metrics.costPerResult.toFixed(2)}`}
        change={`${costPerResultChange.toFixed(1)}%`}
        isPositive={costPerResultChange <= 0}
        icon={TrendingUp}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(2)}%`}
        change={`${conversionChange.toFixed(1)}%`}
        isPositive={conversionChange >= 0}
        icon={Target}
      />
    </div>
  );
};
