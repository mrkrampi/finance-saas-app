import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OPTIONS = [
  'amount',
  'payee',
  'date',
];

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

export const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Readonly<Props>) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      onValueChange={(value) => onChange(columnIndex, value)}
      value={currentSelection || ''}
    >
      <SelectTrigger
        className={cn(
          'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
          currentSelection && 'text-blue-500',
        )}
      >
        <SelectValue placeholder="Skip"/>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>

        {
          OPTIONS.map((option, index) => {
            const disabled = Object.values(selectedColumns).includes(option)
              && selectedColumns[`columns_${columnIndex}`] !== option;

            return (
              <SelectItem
                key={index}
                value={option}
                disabled={disabled}
                className="capitalize"
              >
                {option}
              </SelectItem>
            );
          })
        }
      </SelectContent>
    </Select>
  );
};
