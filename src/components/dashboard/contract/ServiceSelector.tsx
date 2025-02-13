
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Service } from "./types";

interface ServiceSelectorProps {
  services: Service[];
  onServiceSelection: (serviceId: string) => void;
  onPriceChange: (serviceId: string, price: string) => void;
}

export const ServiceSelector = ({
  services,
  onServiceSelection,
  onPriceChange,
}: ServiceSelectorProps) => (
  <div className="space-y-4">
    <Label className="text-sm font-semibold text-primary">Services & Pricing</Label>
    <ScrollArea className="h-[300px]">
      <div className="space-y-3 bg-gradient-to-br from-white to-primary/5 p-4 rounded-lg border border-primary/10">
        {services.map((service) => (
          <div key={service.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-white/80 transition-colors">
            <Checkbox
              id={service.id}
              checked={service.selected}
              onCheckedChange={() => onServiceSelection(service.id)}
              className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={service.id}
              className="flex-1 text-sm font-medium text-primary/80"
            >
              {service.name}
            </Label>
            <Input
              type="text"
              value={service.price}
              onChange={(e) => onPriceChange(service.id, e.target.value)}
              placeholder="Price"
              className="w-24 border-primary/20 focus:ring-primary/30"
              disabled={!service.selected}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);
