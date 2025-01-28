import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoUploaderProps {
  companyLogo: string | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LogoUploader = ({ companyLogo, onLogoUpload }: LogoUploaderProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="logo" className="text-sm font-semibold">Company Logo</Label>
      <Input
        id="logo"
        type="file"
        accept="image/*"
        onChange={onLogoUpload}
        className="border-gray-300 focus:border-primary focus:ring-primary"
      />
      {companyLogo && (
        <div className="mt-2">
          <img src={companyLogo} alt="Company logo" className="h-16 object-contain" />
        </div>
      )}
    </div>
  );
};