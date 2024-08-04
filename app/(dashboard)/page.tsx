'use client';

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';

const DashboardPage = () => {
  const { data: accounts, isLoading } = useGetAccounts();

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
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
  );
};

export default DashboardPage;
