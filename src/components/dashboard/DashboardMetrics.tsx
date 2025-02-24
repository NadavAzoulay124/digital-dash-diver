
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
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const clicksChange = calculatePercentageChange(metrics.totalClicks, metrics.previousTotalClicks);
  const impressionsChange = calculatePercentageChange(metrics.totalImpressions, metrics.previousTotalImpressions);
  const leadsChange = calculatePercentageChange(metrics.totalLeads, metrics.previousTotalLeads);
  
  // Calculate cost per lead
  const costPerLead = metrics.totalLeads > 0 ? metrics.totalSpent / metrics.totalLeads : 0;
  const previousCostPerLead = metrics.previousTotalLeads > 0 ? metrics.previousTotalSpent / metrics.previousTotalLeads : 0;
  const costPerLeadChange = calculatePercentageChange(costPerLead, previousCostPerLead);

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
        title="Cost per Lead"
        value={`$${costPerLead.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        change={`${costPerLeadChange.toFixed(1)}%`}
        isPositive={costPerLeadChange <= 0}
        icon={Target}
      />
    </div>
  );
};
