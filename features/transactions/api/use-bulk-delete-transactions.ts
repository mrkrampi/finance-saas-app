import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.transactions['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<typeof client.api.transactions['bulk-delete']['$post']>;

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions['bulk-delete'].$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transactions deleted');
      void queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to delete transactions');
    },
  });
};
