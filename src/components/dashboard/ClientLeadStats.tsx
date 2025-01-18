import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const ClientLeadStats = () => {
  const leadStats = [
    { status: "New", count: 45 },
    { status: "Price Offer", count: 32 },
    { status: "Closed", count: 58 },
    { status: "Not Interested", count: 10 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leadStats.map((stat) => (
            <div key={stat.status} className="flex items-center justify-between">
              <span className="text-sm font-medium">{stat.status}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-primary rounded-full" style={{ width: `${(stat.count / 145) * 100}px` }} />
                <span className="text-sm font-medium">{stat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};