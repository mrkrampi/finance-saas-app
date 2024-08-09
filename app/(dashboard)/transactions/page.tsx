'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { transactions as transactionSchema } from '@/db/schema';
import { columns } from '@/app/(dashboard)/transactions/columns';
import { ImportCard } from '@/app/(dashboard)/transactions/import-card';
import { UploadButton } from '@/app/(dashboard)/transactions/upload-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { toast } from 'sonner';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

enum Variants {
  LIST = 'LIST',
  IMPORT = 'IMPORT'
}

const INITIAL_IMPORTS_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<Variants>(Variants.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORTS_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORTS_RESULTS) => {
    setImportResults(results);
    setVariant(Variants.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORTS_RESULTS);
    setVariant(Variants.LIST);
  };

  const newTransaction = useNewTransaction();
  const bulkCreateMutation = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (values: Array<typeof transactionSchema.$inferInsert>) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error('Please select an account to continue');
    }

    const data = values.map((value) => ({
      ...value,
      accountId,
    }));

    bulkCreateMutation.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48"/>
          </CardHeader>

          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin"/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === Variants.IMPORT) {
    return (
      <>
        <AccountDialog/>
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>

          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={newTransaction.onOpen}
            >
              <Plus className="size-4 mr-2"/>
              Add new
            </Button>

            <UploadButton onUpload={onUpload}/>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            filterKey="payee"
            data={transactions}
            columns={columns}
            onDelete={(rows) => {
              const ids = rows.map(row => row.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
