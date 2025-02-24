
import { DollarSign, MousePointer, TrendingUp, Activity } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { calculatePercentageChange } from "@/utils/metricsUtils";

interface DashboardMetricsProps {
  metrics: {
    totalSpent: number;
    totalClicks: number;
    costPerClick: number;
    averageFrequency: number;
    previousTotalSpent: number;
    previousTotalClicks: number;
    previousCostPerClick: number;
    previousAverageFrequency: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const clicksChange = calculatePercentageChange(metrics.totalClicks, metrics.previousTotalClicks);
  const cpcChange = calculatePercentageChange(metrics.costPerClick, metrics.previousCostPerClick);
  const frequencyChange = calculatePercentageChange(metrics.averageFrequency, metrics.previousAverageFrequency);

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
        title="Total Clicks"
        value={metrics.totalClicks.toLocaleString()}
        change={`${clicksChange.toFixed(1)}%`}
        isPositive={clicksChange >= 0}
        icon={MousePointer}
      />
      <MetricCard
        title="Cost per Click"
        value={`$${metrics.costPerClick.toFixed(2)}`}
        change={`${cpcChange.toFixed(1)}%`}
        isPositive={cpcChange <= 0}
        icon={TrendingUp}
      />
      <MetricCard
        title="Avg. Frequency"
        value={metrics.averageFrequency.toFixed(2)}
        change={`${frequencyChange.toFixed(1)}%`}
        isPositive={frequencyChange >= 0}
        icon={Activity}
      />
    </div>
  );
};
