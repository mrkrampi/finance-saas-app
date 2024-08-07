import { TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
}

export const CategoryColumn = ({ category, categoryId, id }: Readonly<Props>) => {
  const { onOpen: onCategoryOpen } = useOpenCategory();
  const { onOpen: onTransactionOpen } = useOpenTransaction();

  const onClick = () => {
    if (!categoryId) {
      return onTransactionOpen(id);
    }

    onCategoryOpen(categoryId);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center cursor-pointer hover:underline',
        !category && 'text-rose-500',
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0"/>}
      {category || 'Uncategorized'}
    </div>
  );
};
