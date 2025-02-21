
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Spent"
        value="$124.5K"
        change="+15.2%"
        isPositive={false}
        icon={DollarSign}
      />
      <MetricCard
        title="Active Clients"
        value="48"
        change="+4"
        isPositive={true}
        icon={Users}
      />
      <MetricCard
        title="New Leads"
        value="156"
        change="+12"
        isPositive={true}
        icon={Target}
      />
      <MetricCard
        title="Open Tasks"
        value="24"
        change="+2"
        isPositive={false}
        icon={ListChecks}
      />
    </div>
  );
};
