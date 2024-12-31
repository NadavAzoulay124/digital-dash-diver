import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, change, isPositive, icon: Icon }: MetricCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn(
          "p-3 rounded-full",
          "bg-primary/10"
        )}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <span className={cn(
          "text-sm font-medium",
          isPositive ? "text-success" : "text-red-500"
        )}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </Card>
  );
};