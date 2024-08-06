import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { useConfirm } from '@/hooks/use-confirm';
import { insertTransactionSchema } from '@/db/schema';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'You are about to delete this transaction');

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = transactionQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = transactionQuery.data
    ? {
      name: '',
    }
    : {
      name: '',
    };

  return (
    <>
      <ConfirmDialog/>

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit an existing transaction
            </SheetDescription>
          </SheetHeader>

          {
            isLoading
              ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                </div>
              )
              : (
                <p>
                  TODO: Transaction form
                </p>
              )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
