
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        title="Active Clients"
        value={metrics.activeClients.toString()}
        change={`+${metrics.clientsChange}`}
        isPositive={true}
        icon={Users}
      />
      <MetricCard
        title="New Leads"
        value={metrics.totalLeads.toString()}
        change={`+${metrics.leadsChange}`}
        isPositive={true}
        icon={Target}
      />
      <MetricCard
        title="Open Tasks"
        value={metrics.openTasks.toString()}
        change={`+${metrics.tasksChange}`}
        isPositive={false}
        icon={ListChecks}
      />
    </div>
  );
};
