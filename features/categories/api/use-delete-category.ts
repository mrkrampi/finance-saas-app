import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.categories[':id']['$delete']>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[':id'].$delete({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category deleted');
      void queryClient.invalidateQueries({ queryKey: ['category', { id }] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // TODO: invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to delete an category');
    },
  });
};
