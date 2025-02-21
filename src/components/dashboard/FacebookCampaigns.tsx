
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FacebookCampaignsProps {
  campaigns: any[];
}

export const FacebookCampaigns = ({ campaigns }: FacebookCampaignsProps) => {
  return (
    <div className="space-y-6">
      {campaigns.map((campaign: any) => (
        <Card key={campaign.id}>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>{campaign.name}</span>
                <Badge variant="outline">{campaign.objective}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                </TableRow>
                {campaign.insights && campaign.insights.data[0] && (
                  <>
                    <TableRow>
                      <TableCell>Impressions</TableCell>
                      <TableCell>{campaign.insights.data[0].impressions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Clicks</TableCell>
                      <TableCell>{campaign.insights.data[0].clicks}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Conversions</TableCell>
                      <TableCell>{campaign.insights.data[0].conversions}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
