import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
}

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    status: "new",
    source: "website"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    status: "closed",
    source: "referral"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "(555) 345-6789",
    status: "price-offer",
    source: "social"
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "(555) 456-7890",
    status: "not-interested",
    source: "email"
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "(555) 567-8901",
    status: "new",
    source: "website"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "l.anderson@email.com",
    phone: "(555) 678-9012",
    status: "price-offer",
    source: "referral"
  },
  {
    id: "7",
    name: "James Taylor",
    email: "j.taylor@email.com",
    phone: "(555) 789-0123",
    status: "closed",
    source: "social"
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "m.garcia@email.com",
    phone: "(555) 890-1234",
    status: "new",
    source: "email"
  },
  {
    id: "9",
    name: "Robert Martinez",
    email: "r.martinez@email.com",
    phone: "(555) 901-2345",
    status: "not-interested",
    source: "website"
  },
  {
    id: "10",
    name: "Jennifer White",
    email: "j.white@email.com",
    phone: "(555) 012-3456",
    status: "price-offer",
    source: "referral"
  }
];

export const LeadManagement = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "new",
    source: "website",
  });

  const handleAddLead = () => {
    const lead: Lead = {
      id: Date.now().toString(),
      ...newLead,
    };
    setLeads([lead, ...leads]);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      status: "new",
      source: "website",
    });
    toast({
      title: "Lead Added",
      description: "New lead has been successfully added to the system.",
    });
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    toast({
      title: "Status Updated",
      description: "Lead status has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({ ...newLead, name: e.target.value })
                }
                placeholder="Enter lead name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Select
                value={newLead.source}
                onValueChange={(value) =>
                  setNewLead({ ...newLead, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddLead} className="mt-4">
            Add Lead
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {lead.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{lead.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="not-interested">Not Interested</SelectItem>
                          <SelectItem value="price-offer">Got a Price Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="capitalize">{lead.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};