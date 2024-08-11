import { useState } from 'react';
import { FileSearch, Loader2, PieChart, Radar, Target } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { PieVariant } from '@/components/pie-variant';
import { RadarVariant } from '@/components/radar-variant';
import { RadialVariant } from '@/components/radial-variant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

enum ChartTypes {
  PIE = 'pie',
  RADAR = 'radar',
  RADIAL = 'radial',
}

type Props = {
  data?: Array<{ name: string; value: number; }>;
}

export const SpendingPie = ({ data = [] }: Readonly<Props>) => {
  const [chartType, setChartType] = useState<ChartTypes>(ChartTypes.PIE);

  const onTypeChange = (type: ChartTypes) => {
    // TODO: Add paywall
    setChartType(type);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Categories
        </CardTitle>

        <Select
          defaultValue={chartType}
          onValueChange={onTypeChange}
        >
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart type"/>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ChartTypes.PIE}>
              <div className="flex items-center">
                <PieChart className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Pie chart
                </p>
              </div>
            </SelectItem>

            <SelectItem value={ChartTypes.RADAR}>
              <div className="flex items-center">
                <Radar className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Radar chart
                </p>
              </div>
            </SelectItem>

            <SelectItem value={ChartTypes.RADIAL}>
              <div className="flex items-center">
                <Target className="size-4 mr-2 shrink-0"/>

                <p className="line-clamp-1">
                  Radial chart
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
                {chartType === ChartTypes.PIE && <PieVariant data={data}/>}
                {chartType === ChartTypes.RADAR && <RadarVariant data={data}/>}
                {chartType === ChartTypes.RADIAL && <RadialVariant data={data}/>}
              </>
            )
        }
      </CardContent>
    </Card>
  );
};

export const SpendingPieLoading = () => {
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
