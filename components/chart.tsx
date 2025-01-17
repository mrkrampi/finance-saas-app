import { useState } from 'react';
import { FileSearch, AreaChart, LineChart, BarChart3, Loader2 } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { BarVariant } from '@/components/bar-variant';
import { AreaVariant } from '@/components/area-variant';
import { LineVariant } from '@/components/line-variant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

enum ChartTypes {
  AREA = 'area',
  BAR = 'bar',
  LINE = 'line',
}

type Props = {
  data?: Array<{ date: string; income: number; expenses: number; }>;
}

export const Chart = ({ data = [] }: Readonly<Props>) => {
  const [chartType, setChartType] = useState<ChartTypes>(ChartTypes.AREA);

  const onTypeChange = (type: ChartTypes) => {
    // TODO: Add paywall
    setChartType(type);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transactions
        </CardTitle>

        <Select
          defaultValue={chartType}
          onValueChange={onTypeChange}
        >
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart type"/>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ChartTypes.AREA}>
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Area chart
                </p>
              </div>
            </SelectItem>

            <SelectItem value={ChartTypes.LINE}>
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Line chart
                </p>
              </div>
            </SelectItem>

            <SelectItem value={ChartTypes.BAR}>
              <div className="flex items-center">
                <BarChart3 className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Bar chart
                </p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {
          data.length === 0
            ? (
              <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                <FileSearch className="size-6 text-muted-foreground"/>
                <p className="text-muted-foreground text-sm">
                  No data for this period
                </p>
              </div>
            )
            : (
              <>
                {chartType === ChartTypes.AREA && <AreaVariant data={data}/>}
                {chartType === ChartTypes.BAR && <BarVariant data={data}/>}
                {chartType === ChartTypes.LINE && <LineVariant data={data}/>}
              </>
            )
        }
      </CardContent>
    </Card>
  );
};

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-full lg:w-[120px]" />
      </CardHeader>

      <CardContent>
        <div className="flex h-[350px] w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
};
