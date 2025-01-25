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

interface Service {
  id: string;
  name: string;
  price: string;
  selected: boolean;
}

interface ContractTemplate {
  id: string;
  name: string;
  services: Service[];
}

const contractTemplates: ContractTemplate[] = [
  {
    id: "starter",
    name: "Starter Package",
    services: [
      { id: "seo", name: "SEO Services", price: "500", selected: true },
      { id: "social", name: "Social Pages Managing", price: "300", selected: true },
    ],
  },
  {
    id: "professional",
    name: "Professional Package",
    services: [
      { id: "seo", name: "SEO Services", price: "800", selected: true },
      { id: "meta", name: "PPC for Meta", price: "500", selected: true },
      { id: "social", name: "Social Pages Managing", price: "400", selected: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Package",
    services: [
      { id: "seo", name: "SEO Services", price: "1200", selected: true },
      { id: "meta", name: "PPC for Meta", price: "800", selected: true },
      { id: "google", name: "PPC for Google", price: "800", selected: true },
      { id: "social", name: "Social Pages Managing", price: "600", selected: true },
      { id: "content", name: "Content Creation", price: "500", selected: true },
    ],
  },
];

export const ContractCreation = () => {
  const [clientCompany, setClientCompany] = useState("");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Contract</DialogTitle>
          <DialogDescription>
            Select services and set prices for the contract
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
            <Select onValueChange={handleTemplateSelection}>
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
      </DialogContent>
    </Dialog>
  );
};