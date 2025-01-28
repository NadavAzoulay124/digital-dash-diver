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
}: ContractTemplateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Contract Template</Label>
      <Select value={selectedTemplate} onValueChange={onTemplateSelect}>
        <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTemplate && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{templates.find(t => t.id === selectedTemplate)?.name}</CardTitle>
            <CardDescription>
              {templates.find(t => t.id === selectedTemplate)?.description}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};