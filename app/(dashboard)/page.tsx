'use client';

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { onOpen } = useNewAccount();
  const { data: accounts, isLoading } = useGetAccounts();

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => onOpen()}>
        Add an account
      </Button>

      <div>
        {
          accounts?.map(account => {
            return (
              <div key={account.id}>
                {account.name}
              </div>
            );
          })
        }
      </div>
    </>
  );
};

export default DashboardPage;
