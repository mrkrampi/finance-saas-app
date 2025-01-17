import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<typeof client.api.categories['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<typeof client.api.categories['bulk-delete']['$post']>;

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories['bulk-delete'].$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Categories deleted');
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to delete categories');
    },
  });
};
