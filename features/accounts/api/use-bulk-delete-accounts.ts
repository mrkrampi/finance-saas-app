import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.accounts['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<typeof client.api.accounts['bulk-delete']['$post']>;

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts['bulk-delete'].$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Accounts deleted');
      void queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to delete accounts');
    },
  });
};
