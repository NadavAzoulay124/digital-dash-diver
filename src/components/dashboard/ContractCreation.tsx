import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Service {
  id: string;
  name: string;
  price: string;
  selected: boolean;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  services: Service[];
  preview: string;
}

const contractTemplates: ContractTemplate[] = [
  {
    id: "starter",
    name: "Starter Package",
    description: "A simple, clean template perfect for small businesses",
    services: [
      { id: "seo", name: "SEO Services", price: "500", selected: true },
      { id: "social", name: "Social Pages Managing", price: "300", selected: true },
    ],
    preview: `
Digital Marketing Services Agreement

This agreement is made between [Agency Name] and [Client Company]

Services Included:
1. SEO Services ($500/month)
   - Keyword Research
   - On-page Optimization
   - Monthly Reports

2. Social Media Management ($300/month)
   - Content Calendar
   - Daily Posts
   - Engagement Monitoring

Total Monthly Investment: $800
    `
  },
  {
    id: "professional",
    name: "Professional Package",
    description: "Comprehensive template with detailed service breakdowns",
    services: [
      { id: "seo", name: "SEO Services", price: "800", selected: true },
      { id: "meta", name: "PPC for Meta", price: "500", selected: true },
      { id: "social", name: "Social Pages Managing", price: "400", selected: true },
    ],
    preview: `
Digital Marketing Service Contract

AGREEMENT between [Agency Name] ("Agency") and [Client Company] ("Client")

1. SCOPE OF SERVICES
   a) SEO Services ($800/month)
      - Advanced Keyword Research
      - Technical SEO
      - Content Strategy
      - Monthly Performance Reports

   b) Meta Advertising ($500/month)
      - Campaign Setup
      - Ad Creation
      - Audience Targeting
      - Performance Optimization

   c) Social Media Management ($400/month)
      - Content Strategy
      - Daily Posts
      - Community Management
      - Analytics Reports

Total Monthly Investment: $1,700
    `
  },
  {
    id: "enterprise",
    name: "Enterprise Package",
    description: "Premium template with full-service digital marketing suite",
    services: [
      { id: "seo", name: "SEO Services", price: "1200", selected: true },
      { id: "meta", name: "PPC for Meta", price: "800", selected: true },
      { id: "google", name: "PPC for Google", price: "800", selected: true },
      { id: "social", name: "Social Pages Managing", price: "600", selected: true },
      { id: "content", name: "Content Creation", price: "500", selected: true },
    ],
    preview: `
Enterprise Digital Marketing Agreement

MASTER SERVICE AGREEMENT

Between [Agency Name] and [Client Company]

COMPREHENSIVE DIGITAL MARKETING SERVICES:

1. Enterprise SEO Package ($1,200/month)
   - Advanced Technical SEO
   - Content Strategy & Creation
   - Link Building
   - Weekly Reports

2. PPC Management
   a) Meta Advertising ($800/month)
   b) Google Ads ($800/month)
   - Campaign Strategy
   - Ad Creation & Testing
   - Conversion Tracking
   - ROI Optimization

3. Social Media Management ($600/month)
   - Multi-platform Management
   - Content Calendar
   - Community Engagement
   - Crisis Management

4. Content Creation ($500/month)
   - Blog Posts
   - Social Media Content
   - Email Newsletters
   - Infographics

Total Monthly Investment: $3,900
    `
  },
];

export const ContractCreation = () => {
  const [clientCompany, setClientCompany] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [services, setServices] = useState<Service[]>([
    { id: "seo", name: "SEO Services", price: "", selected: false },
    { id: "meta", name: "PPC for Meta", price: "", selected: false },
    { id: "google", name: "PPC for Google", price: "", selected: false },
    { id: "social", name: "Social Pages Managing", price: "", selected: false },
    { id: "content", name: "Content Creation", price: "", selected: false },
  ]);

  const handleServiceSelection = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, selected: !service.selected }
        : service
    ));
  };

  const handlePriceChange = (serviceId: string, price: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, price }
        : service
    ));
  };

  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = contractTemplates.find(t => t.id === templateId);
    if (template) {
      const updatedServices = services.map(service => {
        const templateService = template.services.find(ts => ts.id === service.id);
        if (templateService) {
          return { ...service, selected: true, price: templateService.price };
        }
        return { ...service, selected: false, price: "" };
      });
      setServices(updatedServices);
      toast.success(`Applied ${template.name} template`);
    }
  };

  const handleSendContract = () => {
    const selectedServices = services.filter(service => service.selected);
    
    if (!clientCompany) {
      toast.error("Please enter the client company name");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (selectedServices.some(service => !service.price)) {
      toast.error("Please set prices for all selected services");
      return;
    }

    toast.success(`Contract created for ${clientCompany}`);
    console.log({
      clientCompany,
      services: selectedServices,
      totalValue: selectedServices.reduce((sum, service) => sum + Number(service.price), 0),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create New Contract</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create Contract</DialogTitle>
          <DialogDescription>
            Select a template and customize services for your contract
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 h-full">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Client Company Name</Label>
              <Input
                id="company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Enter client company name"
              />
            </div>

            <div className="space-y-2">
              <Label>Contract Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {contractTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Select Services</Label>
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-4">
                  <Checkbox
                    id={service.id}
                    checked={service.selected}
                    onCheckedChange={() => handleServiceSelection(service.id)}
                  />
                  <Label htmlFor={service.id} className="flex-1">
                    {service.name}
                  </Label>
                  {service.selected && (
                    <Input
                      type="number"
                      placeholder="Price"
                      value={service.price}
                      onChange={(e) => handlePriceChange(service.id, e.target.value)}
                      className="w-32"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button onClick={handleSendContract} className="w-full">
              Send Contract
            </Button>
          </div>

          <div className="border-l pl-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>
                  {selectedTemplate 
                    ? contractTemplates.find(t => t.id === selectedTemplate)?.description 
                    : "Select a template to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {selectedTemplate
                      ? contractTemplates.find(t => t.id === selectedTemplate)?.preview
                      : "No template selected"}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};