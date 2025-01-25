import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, Users } from "lucide-react";

interface ClientInsight {
  id: string;
  message: string;
  type: "warning" | "improvement";
  timestamp: string;
}

interface Client {
  id: string;
  name: string;
  insights: ClientInsight[];
}

// Mock data - replace with real data in production
const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    insights: [
      {
        id: "1",
        message: "Cost per lead increased by 50% in the last week (from $10 to $15)",
        type: "warning",
        timestamp: "2024-02-25",
      },
      {
        id: "2",
        message: "Ad 'Summer Sale' frequency reached 12 - consider expanding audience",
        type: "warning",
        timestamp: "2024-02-24",
      },
    ],
  },
  {
    id: "2",
    name: "TechStart Inc",
    insights: [
      {
        id: "3",
        message: "Conversion rate improved by 25% after copy changes",
        type: "improvement",
        timestamp: "2024-02-25",
      },
    ],
  },
];

export const ClientInsights = () => {
  const [selectedClient, setSelectedClient] = useState<string>("");

  const selectedClientData = mockClients.find(
    (client) => client.id === selectedClient
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClientData && (
          <div className="space-y-4">
            {selectedClientData.insights.map((insight) => (
              <Alert
                key={insight.id}
                variant={insight.type === "warning" ? "destructive" : "default"}
              >
                {insight.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <AlertDescription>{insight.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};