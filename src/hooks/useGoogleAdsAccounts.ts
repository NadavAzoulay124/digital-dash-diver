
import { useState } from 'react';
import { GoogleAdsAccount } from '@/components/dashboard/google/types';

export const useGoogleAdsAccounts = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const getSelectedAccount = (): GoogleAdsAccount | undefined => {
    // This is a stub - normally you would fetch from your actual accounts list
    // For now, returning undefined since we don't have a working Google integration
    return undefined;
  };

  return {
    selectedAccountId,
    setSelectedAccountId,
    getSelectedAccount,
  };
};
