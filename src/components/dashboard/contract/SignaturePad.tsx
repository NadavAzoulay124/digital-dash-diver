
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onClear: () => void;
  signaturePadRef: React.RefObject<SignatureCanvas>;
  manualSignature: boolean;
  onManualSignatureChange: (checked: boolean) => void;
}

export const SignaturePad = ({ 
  onClear, 
  signaturePadRef, 
  manualSignature, 
  onManualSignatureChange 
}: SignaturePadProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Digital Signature</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="manual-signature"
            checked={manualSignature}
            onCheckedChange={onManualSignatureChange}
          />
          <Label htmlFor="manual-signature" className="text-sm text-gray-600">
            Allow manual signature
          </Label>
        </div>
      </div>
      
      {!manualSignature && (
        <div className="border rounded-lg p-4 bg-white">
          <SignatureCanvas
            ref={signaturePadRef}
            canvasProps={{
              className: "border rounded-lg w-full h-40 cursor-crosshair",
              style: { backgroundColor: '#f8fafc' }
            }}
          />
          <Button 
            onClick={onClear}
            variant="outline" 
            className="mt-2"
          >
            Clear Signature
          </Button>
        </div>
      )}

      {manualSignature && (
        <div className="border rounded-lg p-4 bg-white/50 text-center text-gray-600">
          <p>Contract will be sent for manual signature</p>
        </div>
      )}
    </div>
  );
};
