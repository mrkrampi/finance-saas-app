import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.accounts.$post>['json'];
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account created');
      void queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
    },
    onError: () => {
      toast.error('Failed to create an account');
    }
  });
};
