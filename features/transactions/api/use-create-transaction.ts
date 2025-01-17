import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.transactions.$post>['json'];
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction created');
      void queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
    onError: () => {
      toast.error('Failed to create an transaction');
    }
  });
};
