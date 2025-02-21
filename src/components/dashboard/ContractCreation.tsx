
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignaturePad from 'react-signature-canvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ContractTemplateSelector } from "./contract/ContractTemplateSelector";
import { ServiceSelector } from "./contract/ServiceSelector";
import { LogoUploader } from "./contract/LogoUploader";
import { SignaturePad as SignaturePadComponent } from "./contract/SignaturePad";
import { ContractPreview } from "./contract/ContractPreview";
import { Service, ContractTemplate } from "./contract/types";
import { supabase } from "@/integrations/supabase/client";

const contractTemplates: ContractTemplate[] = [
  {
    id: "starter",
    name: "Modern Starter Package",
    description: "A sleek, contemporary template for small businesses",
    services: [
      { id: "seo", name: "SEO Services", price: "500", selected: true },
      { id: "social", name: "Social Pages Managing", price: "300", selected: true },
    ],
    preview: `
[Company Logo]

DIGITAL MARKETING SERVICES AGREEMENT
_________________________________

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
_________________

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
_________________
• Initial contract term: 3 months
• Monthly billing on the 1st of each month
• 30-day notice required for cancellation
• All prices in USD

[Digital Signature Block]

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
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const signaturePadRef = useRef<SignaturePad>(null);
  const [manualSignature, setManualSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([
    { id: "seo", name: "SEO Services", price: "", selected: false },
    { id: "meta", name: "PPC for Meta", price: "", selected: false },
    { id: "google", name: "PPC for Google", price: "", selected: false },
    { id: "social", name: "Social Pages Managing", price: "", selected: false },
    { id: "content", name: "Content Creation", price: "", selected: false },
  ]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };

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

  const validateForm = () => {
    if (!userId) {
      toast.error("You must be logged in to create contracts");
      return false;
    }

    if (!clientCompany) {
      toast.error("Please enter the client company name");
      return false;
    }

    const selectedServices = services.filter(service => service.selected);
    
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return false;
    }

    if (selectedServices.some(service => !service.price)) {
      toast.error("Please set prices for all selected services");
      return false;
    }

    if (!selectedTemplate) {
      toast.error("Please select a contract template");
      return false;
    }

    return true;
  };

  const handleSendContract = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const selectedServices = services.filter(service => service.selected);
    const totalValue = selectedServices.reduce((sum, service) => sum + Number(service.price), 0);
    
    try {
      let signatureData = null;
      if (!manualSignature && signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        signatureData = signaturePadRef.current.getTrimmedCanvas().toDataURL();
      }

      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert({
          client_company: clientCompany,
          template_id: selectedTemplate,
          company_logo: companyLogo,
          status: manualSignature ? 'pending' : 'signed',
          total_value: totalValue,
          signature_data: signatureData,
          manual_signature: manualSignature,
          created_by: userId!
        })
        .select()
        .single();

      if (contractError) throw contractError;

      const contractServices = selectedServices.map(service => ({
        contract_id: contract.id,
        service_id: service.id,
        service_name: service.name,
        price: Number(service.price),
      }));

      const { error: servicesError } = await supabase
        .from('contract_services')
        .insert(contractServices);

      if (servicesError) throw servicesError;

      toast.success(
        manualSignature 
          ? 'Contract sent for manual signature' 
          : 'Contract created successfully'
      );

      // Reset form
      setClientCompany("");
      setSelectedTemplate("");
      setCompanyLogo(null);
      setManualSignature(false);
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
      setServices(services.map(service => ({ ...service, selected: false, price: "" })));

    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Failed to create contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-primary hover:bg-primary-hover text-white">
          Create New Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Create Professional Contract</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a template and customize services for your client contract
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8 h-[calc(90vh-100px)] overflow-hidden">
          <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm overflow-y-auto">
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

            <LogoUploader 
              companyLogo={companyLogo}
              onLogoUpload={handleLogoUpload}
            />

            <ContractTemplateSelector
              selectedTemplate={selectedTemplate}
              templates={contractTemplates}
              onTemplateSelect={handleTemplateSelection}
            />

            <ServiceSelector
              services={services}
              onServiceSelection={handleServiceSelection}
              onPriceChange={handlePriceChange}
            />

            <SignaturePadComponent
              onClear={clearSignature}
              signaturePadRef={signaturePadRef}
              manualSignature={manualSignature}
              onManualSignatureChange={setManualSignature}
            />

            <Button 
              onClick={handleSendContract} 
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Creating Contract...' 
                : manualSignature 
                  ? 'Send for Manual Signature' 
                  : 'Generate & Send Contract'
              }
            </Button>
          </div>

          <div className="border-l pl-6 overflow-y-auto h-full">
            <ContractPreview
              selectedTemplate={selectedTemplate}
              templates={contractTemplates}
              companyLogo={companyLogo}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
