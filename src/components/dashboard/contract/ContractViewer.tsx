
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Contract } from "./types";
import { formatDistanceToNow } from "date-fns";
import { FileSignature, Mail } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContractViewerProps {
  contract: Contract & { contract_services: any[] };
  isOpen: boolean;
  onClose: () => void;
  recipientEmail?: string; // New optional prop for pre-populated email
}

export const ContractViewer = ({ 
  contract, 
  isOpen, 
  onClose,
  recipientEmail = "" // Default to empty string if not provided
}: ContractViewerProps) => {
  const [email, setEmail] = useState(recipientEmail); // Initialize with provided email
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter a recipient email address");
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-contract", {
        body: {
          recipientEmail: email,
          contractDetails: {
            client_company: contract.client_company,
            total_value: contract.total_value,
            services: contract.contract_services.map(service => ({
              service_name: service.service_name,
              price: service.price,
            })),
          },
        },
      });

      if (error) throw error;

      toast.success("Contract details sent successfully!");
      setEmail(""); // Clear the email field after successful send
    } catch (error) {
      console.error("Error sending contract email:", error);
      toast.error("Failed to send contract details. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Reset email state when recipientEmail prop changes
  useState(() => {
    setEmail(recipientEmail);
  }, [recipientEmail]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-primary" />
            Contract for {contract.client_company}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full">
          <div className="space-y-6 p-4">
            {/* Contract Header */}
            <div className="text-center space-y-4 mb-8">
              {contract.company_logo && (
                <img 
                  src={contract.company_logo} 
                  alt="Company Logo" 
                  className="h-20 mx-auto object-contain"
                />
              )}
              <h2 className="text-2xl font-semibold text-primary">
                Professional Services Agreement
              </h2>
              <div className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(contract.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Email Section */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Send Contract Details</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendEmail}
                    disabled={isSending || !email}
                  >
                    {isSending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Contract Value</h3>
                <p className="text-2xl font-bold text-primary">
                  ${contract.total_value.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Included Services</h3>
                <div className="grid gap-2">
                  {contract.contract_services.map((service) => (
                    <div 
                      key={service.id}
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                    >
                      <span>{service.service_name}</span>
                      <span className="font-medium">${service.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Section */}
              {contract.status === 'signed' && (
                <div className="border-t pt-6 mt-8">
                  <h3 className="font-semibold mb-4">Signature</h3>
                  {contract.manual_signature ? (
                    <div className="bg-white p-4 border rounded-lg max-w-md mx-auto">
                      <img 
                        src={contract.signature_data} 
                        alt="Contract Signature" 
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      Electronically signed
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
