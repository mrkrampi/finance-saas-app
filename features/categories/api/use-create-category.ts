import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.categories.$post>['json'];
type ResponseType = InferResponseType<typeof client.api.categories.$post>;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category created');
      void queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Failed to create an category');
    }
  });
};
