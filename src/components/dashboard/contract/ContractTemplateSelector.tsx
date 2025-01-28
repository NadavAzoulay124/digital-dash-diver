import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContractTemplate } from "./types";

interface ContractTemplateSelectorProps {
  selectedTemplate: string;
  templates: ContractTemplate[];
  onTemplateSelect: (templateId: string) => void;
}

export const ContractTemplateSelector = ({
  selectedTemplate,
  templates,
  onTemplateSelect,
}: ContractTemplateSelectorProps) => (
  <div className="space-y-2">
    <Label htmlFor="template" className="text-sm font-semibold text-primary">Contract Template</Label>
    <Select value={selectedTemplate} onValueChange={onTemplateSelect}>
      <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30">
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem
            key={template.id}
            value={template.id}
            className="hover:bg-primary/10 focus:bg-primary/20"
          >
            <div className="space-y-1">
              <div className="font-medium text-primary">{template.name}</div>
              <div className="text-xs text-primary/70">{template.description}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);