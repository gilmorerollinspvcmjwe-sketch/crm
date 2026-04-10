/**
 * ReceivablesAging Component
 * 应收账款账龄分析组件
 * 展示不同账龄区间的应收款项分布
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export interface AgingRangeData {
  range: string;           // 账龄区间 (如：0-30 天)
  amount: number;          // 金额
  percentage: number;      // 占比 (%)
  risk?: 'low' | 'medium' | 'high' | 'critical';  // 风险等级
  count?: number;          // 单据数量
}

interface ReceivablesAgingProps {
  data: AgingRangeData[];
  className?: string;
  title?: string;
  showChart?: 'bar' | 'pie' | 'both';
  showTable?: boolean;
}

/**
 * 格式化金额为万元
 */
const formatAmount = (amount: number): string => {
  return (amount / 10000).toFixed(1);
};

/**
 * 获取风险等级的配置
 */
const getRiskConfig = (risk?: string) => {
  const config = {
    low: {
      text: '低风险',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500',
      barColor: '#52c41a',
    },
    medium: {
      text: '中风险',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500',
      barColor: '#faad14',
    },
    high: {
      text: '高风险',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      barColor: '#f5222d',
    },
    critical: {
      text: '严重风险',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-500',
      barColor: '#722ed1',
    },
  };
  return config[(risk as keyof typeof config) || 'low'];
};

/**
 * 自定义 Tooltip 组件
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const riskConfig = getRiskConfig(data.risk);
    return (
      <div className="bg-popover text-popover-foreground p-4 rounded-lg border shadow-lg text-sm">
        <p className="font-semibold mb-2">{data.range}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">金额:</span>
            <span className="font-medium">¥{formatAmount(data.amount)}万</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">占比:</span>
            <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </div>
          {data.risk && (
            <div className="flex justify-between gap-4 items-center">
              <span className="text-muted-foreground">风险:</span>
              <Badge className={cn('text-xs', riskConfig.bgColor, riskConfig.color)}>
                {riskConfig.text}
              </Badge>
            </div>
          )}
          {data.count !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">单据数:</span>
              <span className="font-medium">{data.count}笔</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const ReceivablesAging: React.FC<ReceivablesAgingProps> = ({
  data,
  className,
  title = '📊 应收账款账龄分析',
  showChart = 'both',
  showTable = true,
}) => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  // 计算总计
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // 准备图表数据
  const chartData = data.map((item) => ({
    ...item,
    fill: getRiskConfig(item.risk).barColor,
  }));

  // 准备饼图数据
  const pieData = data.map((item) => ({
    name: item.range,
    value: item.amount,
    percentage: item.percentage,
    risk: item.risk,
    fill: getRiskConfig(item.risk).barColor,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => {
            const riskConfig = getRiskConfig(item.risk);
            return (
              <div
                key={item.range}
                className={cn(
                  'rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md',
                  riskConfig.borderColor,
                  selectedRange === item.range && 'ring-2 ring-primary'
                )}
                onClick={() => setSelectedRange(item.range)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{item.range}</span>
                  <Badge className={cn('text-xs', riskConfig.bgColor, riskConfig.color)}>
                    {riskConfig.text}
                  </Badge>
                </div>
                <div className="text-lg font-bold">{formatAmount(item.amount)}万</div>
                <Progress value={item.percentage} className="h-2 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {(showChart === 'both' || showChart === 'bar') && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12 }}
                  angle={-10}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">金额</span>
                  )}
                />
                <Bar
                  dataKey="amount"
                  name="金额"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: 'top' as const,
                    fontSize: 12,
                    fill: '#666',
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      opacity={selectedRange && selectedRange !== entry.range ? 0.5 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {showChart === 'both' && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => {
                    const percentage = typeof value === 'number' ? value : 0;
                    return `${name}: ${percentage.toFixed(1)}%`;
                  }}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      opacity={selectedRange && selectedRange !== entry.name ? 0.5 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Risk Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">正常账龄</p>
                <p className="text-xl font-bold text-green-600">
                  {formatAmount(
                    data.filter(i => i.risk === 'low').reduce((sum, i) => sum + i.amount, 0)
                  )}万
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">关注账龄</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatAmount(
                    data.filter(i => i.risk === 'medium').reduce((sum, i) => sum + i.amount, 0)
                  )}万
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">风险账龄</p>
                <p className="text-xl font-bold text-red-600">
                  {formatAmount(
                    data.filter(i => i.risk === 'high' || i.risk === 'critical')
                      .reduce((sum, i) => sum + i.amount, 0)
                  )}万
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {showTable && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">账龄区间</th>
                  <th className="px-4 py-3 text-left font-medium">金额</th>
                  <th className="px-4 py-3 text-left font-medium">占比</th>
                  <th className="px-4 py-3 text-left font-medium">风险等级</th>
                  {data[0].count !== undefined && (
                    <th className="px-4 py-3 text-left font-medium">单据数</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {chartData.map((row) => {
                  const riskConfig = getRiskConfig(row.risk);
                  return (
                    <tr
                      key={row.range}
                      className={cn(
                        'hover:bg-muted/50 cursor-pointer transition-colors',
                        selectedRange === row.range && 'bg-muted/50'
                      )}
                      onClick={() => setSelectedRange(row.range)}
                    >
                      <td className="px-4 py-3 font-medium">{row.range}</td>
                      <td className="px-4 py-3 font-bold">
                        ¥{formatAmount(row.amount)}万
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={row.percentage} className="h-2 w-24" />
                          <span className="text-muted-foreground w-12">
                            {row.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs', riskConfig.bgColor, riskConfig.color)}>
                          {riskConfig.text}
                        </Badge>
                      </td>
                      {row.count !== undefined && (
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.count}笔
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceivablesAging;
