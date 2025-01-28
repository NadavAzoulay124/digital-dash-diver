import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Phone, Megaphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  date: string;
  phone: string;
  source: "Google Ads" | "Meta" | "Organic" | "Other";
  campaign: string;
  adSet: string;
  ad: string;
  status: "New" | "Appointment Scheduled" | "Closed" | "Not Interested";
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    date: "2024-02-20",
    phone: "+1 234-567-8900",
    source: "Google Ads",
    campaign: "Summer Sale 2024",
    adSet: "Main Cities",
    ad: "50% Discount Banner",
    status: "New",
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2024-02-19",
    phone: "+1 234-567-8901",
    source: "Meta",
    campaign: "Spring Collection",
    adSet: "Young Adults",
    ad: "New Arrivals Video",
    status: "Appointment Scheduled",
  },
  {
    id: "3",
    name: "Robert Johnson",
    date: "2024-02-18",
    phone: "+1 234-567-8902",
    source: "Organic",
    campaign: "Website Traffic",
    adSet: "Blog Readers",
    ad: "Content Marketing",
    status: "Closed",
  },
  {
    id: "4",
    name: "Emily Brown",
    date: "2024-02-17",
    phone: "+1 234-567-8903",
    source: "Google Ads",
    campaign: "Winter Promotion",
    adSet: "Cold Weather",
    ad: "Cozy Collection",
    status: "Not Interested",
  },
  {
    id: "5",
    name: "Michael Wilson",
    date: "2024-02-16",
    phone: "+1 234-567-8904",
    source: "Meta",
    campaign: "Brand Awareness",
    adSet: "Lookalike Audience",
    ad: "Brand Story Video",
    status: "New",
  },
  {
    id: "6",
    name: "Sarah Davis",
    date: "2024-02-15",
    phone: "+1 234-567-8905",
    source: "Other",
    campaign: "Referral Program",
    adSet: "Existing Customers",
    ad: "Refer a Friend",
    status: "Appointment Scheduled",
  },
  {
    id: "7",
    name: "James Miller",
    date: "2024-02-14",
    phone: "+1 234-567-8906",
    source: "Google Ads",
    campaign: "End of Season",
    adSet: "Clearance",
    ad: "Last Chance Banner",
    status: "Closed",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    date: "2024-02-13",
    phone: "+1 234-567-8907",
    source: "Meta",
    campaign: "New Collection",
    adSet: "Fashion Enthusiasts",
    ad: "Lifestyle Photos",
    status: "New",
  },
  {
    id: "9",
    name: "William Taylor",
    date: "2024-02-12",
    phone: "+1 234-567-8908",
    source: "Organic",
    campaign: "SEO Traffic",
    adSet: "Search Results",
    ad: "Organic Listing",
    status: "Appointment Scheduled",
  },
  {
    id: "10",
    name: "Emma Thomas",
    date: "2024-02-11",
    phone: "+1 234-567-8909",
    source: "Other",
    campaign: "Partner Program",
    adSet: "Partner Network",
    ad: "Co-branded Content",
    status: "Not Interested",
  },
];

const getStatusBadge = (status: Lead["status"]) => {
  switch (status) {
    case "New":
      return <Badge className="bg-primary">{status}</Badge>;
    case "Appointment Scheduled":
      return <Badge className="bg-warning">{status}</Badge>;
    case "Closed":
      return <Badge className="bg-success">{status}</Badge>;
    case "Not Interested":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const LeadsBoard = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const { toast } = useToast();

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    toast({
      title: "Status Updated",
      description: `Lead status has been changed to ${newStatus}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Campaign Leads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Set</TableHead>
                <TableHead>Ad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {lead.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {lead.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(value: Lead["status"]) => handleStatusChange(lead.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{getStatusBadge(lead.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Appointment Scheduled">Appointment Scheduled</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Not Interested">Not Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      {lead.source}
                    </div>
                  </TableCell>
                  <TableCell>{lead.campaign}</TableCell>
                  <TableCell>{lead.adSet}</TableCell>
                  <TableCell>{lead.ad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};