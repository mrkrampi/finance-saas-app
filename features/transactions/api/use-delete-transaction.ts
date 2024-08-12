import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$delete']>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[':id'].$delete({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction deleted');
      void queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to delete an transaction');
    },
  });
};
