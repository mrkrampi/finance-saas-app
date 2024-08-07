import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.accounts[':id']['$patch']>['json'];
type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$patch']>;

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[':id'].$patch({
        json,
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account updated');
      void queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['transaction'] });
      // TODO: invalidate summary
    },
    onError: () => {
      toast.error('Failed to edit an account');
    },
  });
};
