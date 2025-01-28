import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContractTemplate } from "./types";

interface ContractPreviewProps {
  selectedTemplate: string;
  templates: ContractTemplate[];
  companyLogo: string | null;
}

export const ContractPreview = ({
  selectedTemplate,
  templates,
  companyLogo,
}: ContractPreviewProps) => {
  const template = templates.find(t => t.id === selectedTemplate);

  return (
    <Card className="h-full bg-gradient-to-br from-white to-gray-50 shadow-lg">
      <CardHeader className="border-b bg-white bg-opacity-70">
        <CardTitle className="text-xl font-bold text-primary">Contract Preview</CardTitle>
        <CardDescription>
          {template?.description || "Select a template to see preview"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="whitespace-pre-wrap font-mono text-sm bg-white p-8 border rounded-lg shadow-sm">
            {companyLogo && (
              <img src={companyLogo} alt="Company logo" className="h-16 object-contain mb-4" />
            )}
            {template?.preview || "No template selected"}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};