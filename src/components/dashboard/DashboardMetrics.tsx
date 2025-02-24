
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { calculatePercentageChange } from "@/utils/metricsUtils";
import type { Campaign } from "@/components/dashboard/types";

interface DashboardMetricsProps {
  metrics: {
    totalSpent: number;
    totalLeads: number;
    roas: number;
    conversionRate: number;
    previousTotalSpent: number;
    previousTotalLeads: number;
    previousRoas: number;
    previousConversionRate: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const spentChange = calculatePercentageChange(metrics.totalSpent, metrics.previousTotalSpent);
  const leadsChange = calculatePercentageChange(metrics.totalLeads, metrics.previousTotalLeads);
  const roasChange = calculatePercentageChange(metrics.roas, metrics.previousRoas);
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
        title="ROAS"
        value={`${metrics.roas.toFixed(1)}x`}
        change={`${roasChange.toFixed(1)}%`}
        isPositive={roasChange >= 0}
        icon={TrendingUp}
      />
      <MetricCard
        title="Total Leads"
        value={metrics.totalLeads.toString()}
        change={`${leadsChange.toFixed(1)}%`}
        isPositive={leadsChange >= 0}
        icon={Users}
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
