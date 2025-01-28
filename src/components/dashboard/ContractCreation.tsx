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
[Your Agency Logo]

DIGITAL MARKETING SERVICES AGREEMENT

This Professional Services Agreement (the "Agreement") is made on [Date]

BETWEEN:
[Your Agency Name]
[Your Agency Address]
("Agency")

AND:
[Client Company]
[Client Address]
("Client")

SERVICES INCLUDED:

1. Search Engine Optimization (SEO) Services
   Investment: $500/month
   • Comprehensive Keyword Research
   • On-page SEO Optimization
   • Monthly Performance Reports
   • Search Ranking Monitoring
   • Content Optimization

2. Social Media Management
   Investment: $300/month
   • Strategic Content Calendar
   • Daily Platform Management
   • Community Engagement
   • Performance Analytics
   • Monthly Strategy Review

Total Monthly Investment: $800

Terms & Conditions
• Initial contract term: 3 months
• Monthly billing on the 1st of each month
• 30-day notice required for cancellation
• All prices in USD

[Signature Block]
_____________________
For [Agency Name]

_____________________
For [Client Company]

Contact: [Your Email] | [Your Phone]
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
[Your Agency Logo]

COMPREHENSIVE DIGITAL MARKETING AGREEMENT

MASTER SERVICE AGREEMENT
Date: [Current Date]

PARTIES:
[Your Agency Name] ("Agency")
[Client Company Name] ("Client")

SERVICE SCOPE & INVESTMENT

1. Advanced SEO Services
   Monthly Investment: $800
   • Technical SEO Audit & Implementation
   • Content Strategy Development
   • Keyword Research & Mapping
   • Competitor Analysis
   • Monthly Performance Reports
   • Search Console Optimization

2. Meta Advertising Management
   Monthly Investment: $500
   • Campaign Strategy & Setup
   • Custom Audience Creation
   • Ad Creative Development
   • A/B Testing
   • Performance Optimization
   • ROI Tracking & Reporting

3. Professional Social Media Management
   Monthly Investment: $400
   • Multi-Platform Strategy
   • Content Calendar & Creation
   • Community Management
   • Engagement Monitoring
   • Crisis Management
   • Analytics & Reporting

Total Monthly Investment: $1,700

Terms of Service
• 6-month initial commitment
• Monthly billing in advance
• 45-day cancellation notice
• Performance reviews every 90 days

By signing below, both parties agree to the terms and conditions outlined in this agreement.

[Signature Block]
_____________________
Agency Representative

_____________________
Client Representative

[Your Agency Contact Details]
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
[Your Agency Logo]

ENTERPRISE DIGITAL MARKETING PARTNERSHIP

STRATEGIC PARTNERSHIP AGREEMENT
Effective Date: [Date]

BETWEEN:
[Your Agency Name]
A leading digital marketing agency
[Your Address]

AND:
[Client Company]
[Client Address]

COMPREHENSIVE SERVICE SUITE

1. Enterprise SEO & Content Strategy
   Monthly Investment: $1,200
   • Advanced Technical SEO
   • Content Strategy & Creation
   • Link Building Campaign
   • Competitive Analysis
   • Monthly Executive Reports
   • Dedicated SEO Specialist

2. Paid Advertising Management
   Total Monthly Investment: $1,600
   
   a) Meta Advertising ($800)
   • Campaign Strategy
   • Custom Audience Development
   • Creative A/B Testing
   • Performance Optimization
   
   b) Google Ads ($800)
   • Search Campaign Management
   • Display Network Optimization
   • Conversion Tracking
   • ROI Maximization

3. Premium Social Media Management
   Monthly Investment: $600
   • Strategic Planning
   • Content Creation
   • Community Management
   • Crisis Management
   • Performance Analytics

4. Professional Content Creation
   Monthly Investment: $500
   • Blog Articles
   • Social Media Content
   • Email Newsletters
   • Infographics
   • Video Scripts

Total Monthly Investment: $3,900

Partnership Terms
• 12-month strategic partnership
• Quarterly strategy reviews
• Dedicated account manager
• Priority support
• Monthly executive reports

This agreement represents a partnership commitment to achieving measurable digital marketing success.

[Signature Block]
________________________
[Your Agency Name]
By: [Name]
Title: [Title]
Date: [Date]

________________________
[Client Company]
By: [Name]
Title: [Title]
Date: [Date]

Contact Information
[Your Agency Name]
Email: [Email]
Phone: [Phone]
Website: [Website]
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
        <Button variant="default" className="bg-primary hover:bg-primary-hover text-white">
          Create New Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Create Professional Contract</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a template and customize services for your client contract
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">Client Company Name</Label>
              <Input
                id="company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Enter client company name"
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Contract Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelection}>
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
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
              <Label className="text-sm font-semibold">Select Services</Label>
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                  <Checkbox
                    id={service.id}
                    checked={service.selected}
                    onCheckedChange={() => handleServiceSelection(service.id)}
                    className="text-primary focus:ring-primary"
                  />
                  <Label htmlFor={service.id} className="flex-1 font-medium">
                    {service.name}
                  </Label>
                  {service.selected && (
                    <Input
                      type="number"
                      placeholder="Price"
                      value={service.price}
                      onChange={(e) => handlePriceChange(service.id, e.target.value)}
                      className="w-32 border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button 
              onClick={handleSendContract} 
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
            >
              Generate & Send Contract
            </Button>
          </div>

          <div className="border-l pl-6">
            <Card className="h-full bg-white shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold text-primary">Contract Preview</CardTitle>
                <CardDescription>
                  {selectedTemplate 
                    ? contractTemplates.find(t => t.id === selectedTemplate)?.description 
                    : "Select a template to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] w-full rounded-md">
                  <div className="whitespace-pre-wrap font-mono text-sm bg-white p-8 border rounded-lg">
                    {selectedTemplate
                      ? contractTemplates.find(t => t.id === selectedTemplate)?.preview
                      : "No template selected"}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};