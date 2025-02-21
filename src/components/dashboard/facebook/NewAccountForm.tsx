
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormErrors } from "./types";

interface NewAccountFormProps {
  accountName: string;
  adAccountId: string;
  accessToken: string;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onAccountNameChange: (value: string) => void;
  onAdAccountIdChange: (value: string) => void;
  onAccessTokenChange: (value: string) => void;
}

export const NewAccountForm = ({
  accountName,
  adAccountId,
  accessToken,
  formErrors,
  isSubmitting,
  onSubmit,
  onCancel,
  onAccountNameChange,
  onAdAccountIdChange,
  onAccessTokenChange,
}: NewAccountFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
          Account Name*
        </label>
        <div className="mt-1">
          <Input
            id="accountName"
            value={accountName}
            onChange={(e) => onAccountNameChange(e.target.value)}
            placeholder="Enter a name for this account"
            className={formErrors.accountName ? "border-red-500" : ""}
          />
          {formErrors.accountName && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.accountName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="adAccountId" className="block text-sm font-medium text-gray-700">
          Ad Account ID*
        </label>
        <div className="mt-1">
          <Input
            id="adAccountId"
            value={adAccountId}
            onChange={(e) => onAdAccountIdChange(e.target.value)}
            placeholder="Enter your Ad Account ID"
            className={formErrors.adAccountId ? "border-red-500" : ""}
          />
          {formErrors.adAccountId && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.adAccountId}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
          Access Token*
        </label>
        <div className="mt-1">
          <Input
            id="accessToken"
            type="password"
            value={accessToken}
            onChange={(e) => onAccessTokenChange(e.target.value)}
            placeholder="Enter your Access Token"
            className={formErrors.accessToken ? "border-red-500" : ""}
          />
          {formErrors.accessToken && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.accessToken}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Connecting..." : "Connect Account"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
