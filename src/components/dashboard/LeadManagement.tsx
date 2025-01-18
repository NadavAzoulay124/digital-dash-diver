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

export const LeadManagement = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
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
            {leads.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No leads added yet. Add your first lead using the form above.
              </p>
            ) : (
              leads.map((lead) => (
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};