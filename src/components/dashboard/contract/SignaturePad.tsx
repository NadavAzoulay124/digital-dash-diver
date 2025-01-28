import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onClear: () => void;
  signaturePadRef: React.RefObject<SignatureCanvas>;
}

export const SignaturePad = ({ onClear, signaturePadRef }: SignaturePadProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">Digital Signature</Label>
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
    </div>
  );
};