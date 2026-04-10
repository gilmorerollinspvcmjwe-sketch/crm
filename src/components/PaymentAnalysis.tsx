/**
 * PaymentAnalysis Component
 * 多维度回款分析组件
 * 按状态、支付方式等多维度统计展示
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface PaymentStatusData {
  status: string;          // 状态 (如：已回款、未回款、逾期等)
  count: number;           // 数量
  amount: number;          // 金额
  percentage?: number;     // 占比 (%)
  color?: string;          // 颜色
}

export interface PaymentMethodData {
  method: string;          // 支付方式 (如：银行转账、支票、现金等)
  count: number;           // 数量
  amount: number;          // 金额
  percentage?: number;     // 占比 (%)
  color?: string;          // 颜色
}

interface PaymentAnalysisProps {
  statusData?: PaymentStatusData[];
  methodData?: PaymentMethodData[];
  className?: string;
  title?: string;
  defaultTab?: 'status' | 'method';
}

/**
 * 格式化金额为万元
 */
const formatAmount = (amount: number): string => {
  return (amount / 10000).toFixed(1);
};

/**
 * 默认状态颜色
 */
const STATUS_COLORS: Record<string, string> = {
  paid: '#52c41a',         // 已回款 - 绿色
  unpaid: '#1890ff',       // 未回款 - 蓝色
  overdue: '#f5222d',      // 逾期 - 红色
  partial: '#faad14',      // 部分回款 - 橙色
  cancelled: '#d9d9d9',    // 已取消 - 灰色
};

/**
 * 默认支付方式颜色
 */
const METHOD_COLORS: Record<string, string> = {
  bank_transfer: '#1890ff',  // 银行转账
  check: '#52c41a',          // 支票
  cash: '#faad14',           // 现金
  credit_card: '#722ed1',    // 信用卡
  online_payment: '#13c2c2', // 在线支付
  other: '#d9d9d9',          // 其他
};

/**
 * 状态标签映射
 */
const STATUS_LABELS: Record<string, string> = {
  paid: '已回款',
  unpaid: '未回款',
  overdue: '逾期',
  partial: '部分回款',
  cancelled: '已取消',
};

/**
 * 支付方式标签映射
 */
const METHOD_LABELS: Record<string, string> = {
  bank_transfer: '银行转账',
  check: '支票',
  cash: '现金',
  credit_card: '信用卡',
  online_payment: '在线支付',
  other: '其他',
};

/**
 * 自定义 Tooltip 组件
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground p-4 rounded-lg border shadow-lg text-sm">
        <p className="font-semibold mb-2">{data.name || data.method || data.status}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">金额:</span>
            <span className="font-medium">¥{formatAmount(data.amount)}万</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">数量:</span>
            <span className="font-medium">{data.count}笔</span>
          </div>
          {data.percentage !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">占比:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * 状态统计饼图
 */
const StatusPieChart = ({ data }: { data: PaymentStatusData[] }) => {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    status: item.status,
    amount: item.amount,
    count: item.count,
    percentage: item.percentage || ((item.amount / data.reduce((sum, i) => sum + i.amount, 0)) * 100),
    fill: item.color || STATUS_COLORS[item.status] || '#1890ff',
  }));

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="amount"
              label={({ name, value }) => {
                const percentage = typeof value === 'number' ? value : 0;
                return `${name}: ${percentage.toFixed(1)}%`;
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
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

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">总金额</p>
          <p className="text-2xl font-bold">¥{formatAmount(totalAmount)}万</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">总笔数</p>
          <p className="text-2xl font-bold">{totalCount}笔</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">金额</th>
              <th className="px-4 py-3 text-left font-medium">笔数</th>
              <th className="px-4 py-3 text-left font-medium">占比</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {chartData.map((row) => (
              <tr key={row.status} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: row.fill }}
                    />
                    <span className="font-medium">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-primary">
                  ¥{formatAmount(row.amount)}万
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.count}笔</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.percentage}%`,
                          backgroundColor: row.fill,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {row.percentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 支付方式统计图表
 */
const MethodBarChart = ({ data }: { data: PaymentMethodData[] }) => {
  const chartData = data.map((item) => ({
    name: METHOD_LABELS[item.method] || item.method,
    method: item.method,
    amount: item.amount,
    count: item.count,
    percentage: item.percentage || ((item.amount / data.reduce((sum, i) => sum + i.amount, 0)) * 100),
    fill: item.color || METHOD_COLORS[item.method] || '#1890ff',
  }));

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
              height={80}
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
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {chartData.map((item) => (
          <div
            key={item.method}
            className="rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <p className="text-lg font-bold">¥{formatAmount(item.amount)}万</p>
            <p className="text-xs text-muted-foreground">{item.count}笔</p>
            <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">支付方式</th>
              <th className="px-4 py-3 text-left font-medium">金额</th>
              <th className="px-4 py-3 text-left font-medium">笔数</th>
              <th className="px-4 py-3 text-left font-medium">占比</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {chartData.map((row) => (
              <tr key={row.method} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: row.fill }}
                    />
                    <span className="font-medium">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-primary">
                  ¥{formatAmount(row.amount)}万
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.count}笔</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.percentage}%`,
                          backgroundColor: row.fill,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {row.percentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PaymentAnalysis: React.FC<PaymentAnalysisProps> = ({
  statusData = [],
  methodData = [],
  className,
  title = '📊 多维度回款分析',
  defaultTab = 'status',
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'method'>(defaultTab);

  // 如果数据没有提供颜色，使用默认颜色
  const processedStatusData = statusData.map((item) => ({
    ...item,
    color: item.color || STATUS_COLORS[item.status] || '#1890ff',
    percentage: item.percentage || (
      (item.amount / statusData.reduce((sum, i) => sum + i.amount, 0)) * 100
    ),
  }));

  const processedMethodData = methodData.map((item) => ({
    ...item,
    color: item.color || METHOD_COLORS[item.method] || '#1890ff',
    percentage: item.percentage || (
      (item.amount / methodData.reduce((sum, i) => sum + i.amount, 0)) * 100
    ),
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'status' | 'method')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="status">按状态统计</TabsTrigger>
            <TabsTrigger value="method">按支付方式统计</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            {statusData.length > 0 ? (
              <StatusPieChart data={processedStatusData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                暂无状态数据
              </div>
            )}
          </TabsContent>

          <TabsContent value="method" className="space-y-4">
            {methodData.length > 0 ? (
              <MethodBarChart data={processedMethodData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                暂无支付方式数据
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentAnalysis;
