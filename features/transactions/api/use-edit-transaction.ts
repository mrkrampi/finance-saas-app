import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.transactions[':id']['$patch']>['json'];
type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$patch']>;

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[':id'].$patch({
        json,
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction updated');
      void queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to edit an transaction');
    },
  });
};
