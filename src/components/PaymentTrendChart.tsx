/**
 * PaymentTrendChart Component
 * 回款趋势图表组件
 * 展示月度回款趋势，计划 vs 实际对比
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface PaymentTrendData {
  month: string;           // 月份 (格式：YYYY-MM 或 MM)
  planned: number;         // 计划回款
  actual: number;          // 实际回款
  rate?: number;           // 完成率 (%)
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

interface PaymentTrendChartProps {
  data: PaymentTrendData[];
  className?: string;
  title?: string;
  showArea?: boolean;      // 是否使用面积图
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

/**
 * 格式化金额为万元
 */
const formatAmount = (amount: number): string => {
  return (amount / 10000).toFixed(0);
};

/**
 * 自定义 Tooltip 组件
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-4 rounded-lg border shadow-lg text-sm">
        <p className="font-semibold mb-3 text-base">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">¥{formatAmount(entry.value)}万</span>
              {entry.payload.rate && (
                <span className={cn(
                  'text-xs ml-2 px-2 py-0.5 rounded-full',
                  entry.payload.rate >= 90 ? 'bg-green-100 text-green-700' :
                  entry.payload.rate >= 75 ? 'bg-blue-100 text-blue-700' :
                  entry.payload.rate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                )}>
                  {entry.payload.rate.toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PaymentTrendChart: React.FC<PaymentTrendChartProps> = ({
  data,
  className,
  title = '📈 回款趋势分析',
  showArea = false,
  timeRange = 'month',
  onTimeRangeChange,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // 格式化图表数据
  const chartData = data.map((item) => ({
    ...item,
    month: item.month.length > 5 ? item.month.slice(5) : item.month, // 只显示 MM
    planned: item.planned,
    actual: item.actual,
  }));

  // 计算总计
  const totalPlanned = data.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
  const avgRate = data.length > 0
    ? data.reduce((sum, item) => sum + (item.rate || 0), 0) / data.length
    : 0;

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {onTimeRangeChange && (
          <Select value={timeRange} onValueChange={(v) => onTimeRangeChange(v as TimeRange)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">最近 7 天</SelectItem>
              <SelectItem value="month">月度</SelectItem>
              <SelectItem value="quarter">季度</SelectItem>
              <SelectItem value="year">年度</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">计划总额</p>
            <p className="text-lg font-bold text-blue-600">
              ¥{formatAmount(totalPlanned)}万
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">实际总额</p>
            <p className="text-lg font-bold text-green-600">
              ¥{formatAmount(totalActual)}万
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">平均完成率</p>
            <p className={cn(
              'text-lg font-bold',
              avgRate >= 90 ? 'text-green-600' :
              avgRate >= 75 ? 'text-blue-600' :
              avgRate >= 60 ? 'text-yellow-600' :
              'text-red-600'
            )}>
              {avgRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}月`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
                label={{
                  value: '金额',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#666', fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
              {showArea ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name="计划回款"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="实际回款"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="planned"
                    name="计划回款"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="实际回款"
                    stroke="#52c41a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">月份</th>
                <th className="px-4 py-3 text-left font-medium">计划回款</th>
                <th className="px-4 py-3 text-left font-medium">实际回款</th>
                <th className="px-4 py-3 text-left font-medium">差额</th>
                <th className="px-4 py-3 text-left font-medium">完成率</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {chartData.map((row, index) => {
                const diff = row.actual - row.planned;
                const rate = row.rate || ((row.actual / row.planned) * 100);
                return (
                  <tr
                    key={row.month}
                    className={cn(
                      'hover:bg-muted/50 cursor-pointer transition-colors',
                      hoveredMonth === row.month && 'bg-muted/50'
                    )}
                    onMouseEnter={() => setHoveredMonth(row.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <td className="px-4 py-3 font-medium">{row.month}月</td>
                    <td className="px-4 py-3 text-blue-600">
                      ¥{formatAmount(row.planned)}万
                    </td>
                    <td className="px-4 py-3 text-green-600">
                      ¥{formatAmount(row.actual)}万
                    </td>
                    <td className={cn(
                      'px-4 py-3 font-medium',
                      diff >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {diff >= 0 ? '+' : ''}¥{formatAmount(Math.abs(diff))}万
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              rate >= 90 ? 'bg-green-500' :
                              rate >= 75 ? 'bg-blue-500' :
                              rate >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            )}
                            style={{ width: `${Math.min(rate, 100)}%` }}
                          />
                        </div>
                        <span className={cn(
                          'text-xs font-medium w-12 text-right',
                          rate >= 90 ? 'text-green-600' :
                          rate >= 75 ? 'text-blue-600' :
                          rate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        )}>
                          {rate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTrendChart;
