import { useState } from 'react';
import { format, parse } from 'date-fns';

import { Button } from '@/components/ui/button';
import { convertAmountToMiliunits } from '@/lib/utils';
import { ImportTable } from '@/app/(dashboard)/transactions/import-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const OUTPUT_FORMAT = 'yyyy-MM-dd';

const REQUIRED_OPTIONS = [
  'amount',
  'date',
  'payee',
];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: Array<Array<string>>;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export const ImportCard = ({ onSubmit, onCancel, data }: Readonly<Props>) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const [headers] = data;
  const body = data.slice(1);

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => column.split('_').at(1);

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          const columnIndex = getColumnIndex(`column_${index}`);
          return selectedColumns[`column_${columnIndex}`] ? cell : null;
        });

        return transformedRow.every(item => item === null)
          ? []
          : transformedRow;
      }).filter(row => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: Record<string, any>, cell, index) => {
        const header = mappedData.headers.at(index);

        if (header !== null) {
          acc[header!] = cell;
        }

        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, DATE_FORMAT, new Date()), OUTPUT_FORMAT),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>

          <div className="flex items-center gap-x-2 flex-col lg:flex-row gap-y-2">
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="w-full lg:w-auto"
              disabled={progress < REQUIRED_OPTIONS.length}
              onClick={handleContinue}
            >
              Continue ({progress} / {REQUIRED_OPTIONS.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
