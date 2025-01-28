import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}: ServiceSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">Select Services</Label>
      {services.map((service) => (
        <div key={service.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Checkbox
            id={service.id}
            checked={service.selected}
            onCheckedChange={() => onServiceSelection(service.id)}
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
              onChange={(e) => onPriceChange(service.id, e.target.value)}
              className="w-32 border-gray-300 focus:border-primary focus:ring-primary"
            />
          )}
        </div>
      ))}
    </div>
  );
};