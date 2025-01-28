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
    <Card className="h-full bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <CardHeader className="border-b bg-white bg-opacity-70">
        <CardTitle className="text-xl font-bold text-primary">Contract Preview</CardTitle>
        <CardDescription className="text-primary/80">
          {template?.description || "Select a template to see preview"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="whitespace-pre-wrap font-mono text-sm bg-white/90 p-8 border rounded-lg shadow-lg">
            {companyLogo && (
              <div className="flex justify-center mb-8">
                <img src={companyLogo} alt="Company logo" className="h-20 object-contain" />
              </div>
            )}
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-bold text-primary mb-2 text-center">
                  {template?.name || "Professional Services Agreement"}
                </h1>
                <p className="text-sm text-primary/70 text-center">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-6 text-gray-700">
                {template?.preview.split('\n').map((line, index) => (
                  <div 
                    key={index} 
                    className={`${
                      line.startsWith('•') ? 'pl-4 text-primary/80' :
                      line.includes('BETWEEN:') || line.includes('SERVICES INCLUDED:') || line.includes('Terms & Conditions') ? 
                        'font-bold text-lg text-primary' : ''
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};