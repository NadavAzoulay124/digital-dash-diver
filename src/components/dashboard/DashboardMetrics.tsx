
import { DollarSign, MousePointer, Eye, Target } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { calculatePercentageChange } from "@/utils/metricsUtils";

interface DashboardMetricsProps {
  metrics: {
    totalSpent: number;
    totalClicks: number;
    totalImpressions: number;
    previousTotalSpent: number;
    previousTotalClicks: number;
    previousTotalImpressions: number;
    totalLeads: number;
    previousTotalLeads: number;
    costPerResult: number;
    previousCostPerResult: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const clicksChange = calculatePercentageChange(metrics.totalClicks, metrics.previousTotalClicks);
  const impressionsChange = calculatePercentageChange(metrics.totalImpressions, metrics.previousTotalImpressions);
  const costPerResultChange = calculatePercentageChange(metrics.costPerResult, metrics.previousCostPerResult);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        title="Total Impressions"
        value={metrics.totalImpressions.toLocaleString()}
        change={`${impressionsChange.toFixed(1)}%`}
        isPositive={impressionsChange >= 0}
        icon={Eye}
      />
      <MetricCard
        title="Cost per Result"
        value={`$${metrics.costPerResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={`${costPerResultChange.toFixed(1)}%`}
        isPositive={costPerResultChange <= 0}
        icon={Target}
      />
    </div>
  );
};
