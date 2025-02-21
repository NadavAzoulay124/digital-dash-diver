
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ABTest } from "./types";

interface TestResultsProps {
  test: ABTest;
  onStatusChange: (id: string, status: "running" | "completed") => void;
}

export const TestResults = ({ test, onStatusChange }: TestResultsProps) => {
  const getTestTypeLabel = (type: ABTest["testType"]) => {
    switch (type) {
      case "campaign":
        return "Campaign";
      case "ad_group":
        return "Ad Group";
      case "ad":
        return "Ad";
      case "budget":
        return "Budget";
      default:
        return type;
    }
  };

  const getClickThroughRate = (impressions: number, clicks: number) => {
    return ((clicks / impressions) * 100).toFixed(1) + "%";
  };

  const getConversionRate = (clicks: number, conversions: number) => {
    return ((conversions / clicks) * 100).toFixed(1) + "%";
  };

  const getChartData = (test: ABTest) => [
    {
      name: "Click-through Rate",
      "Variant A": parseFloat(getClickThroughRate(test.results.variantA.impressions, test.results.variantA.clicks)),
      "Variant B": parseFloat(getClickThroughRate(test.results.variantB.impressions, test.results.variantB.clicks)),
    },
    {
      name: "Conversion Rate",
      "Variant A": parseFloat(getConversionRate(test.results.variantA.clicks, test.results.variantA.conversions)),
      "Variant B": parseFloat(getConversionRate(test.results.variantB.clicks, test.results.variantB.conversions)),
    },
  ];

  return (
    <Card key={test.id}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>{test.campaignName}</span>
            <Badge variant="outline">{getTestTypeLabel(test.testType)}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>{test.variantA}</TableHead>
                  <TableHead>{test.variantB}</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Impressions</TableCell>
                  <TableCell>{test.results.variantA.impressions}</TableCell>
                  <TableCell>{test.results.variantB.impressions}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Clicks</TableCell>
                  <TableCell>{test.results.variantA.clicks}</TableCell>
                  <TableCell>{test.results.variantB.clicks}</TableCell>
                  <TableCell>
                    {((test.results.variantB.clicks - test.results.variantA.clicks) / test.results.variantA.clicks * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conversions</TableCell>
                  <TableCell>{test.results.variantA.conversions}</TableCell>
                  <TableCell>{test.results.variantB.conversions}</TableCell>
                  <TableCell>
                    {((test.results.variantB.conversions - test.results.variantA.conversions) / test.results.variantA.conversions * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Click-through Rate</TableCell>
                  <TableCell>
                    {getClickThroughRate(test.results.variantA.impressions, test.results.variantA.clicks)}
                  </TableCell>
                  <TableCell>
                    {getClickThroughRate(test.results.variantB.impressions, test.results.variantB.clicks)}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conversion Rate</TableCell>
                  <TableCell>
                    {getConversionRate(test.results.variantA.clicks, test.results.variantA.conversions)}
                  </TableCell>
                  <TableCell>
                    {getConversionRate(test.results.variantB.clicks, test.results.variantB.conversions)}
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData(test)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Variant A" fill="#0073ea" />
                <Bar dataKey="Variant B" fill="#00c875" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Select
            value={test.status}
            onValueChange={(value: "running" | "completed") => onStatusChange(test.id, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
