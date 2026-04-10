/**
 * SalesFunnel Component
 * 销售漏斗图组件
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

export type OpportunityStageType = 
  | 'lead_confirmation'
  | 'initial_contact'
  | 'requirement_confirmation'
  | 'proposal_quotation'
  | 'negotiation_approval'
  | 'closed_won'
  | 'closed_lost';

export interface SalesFunnelStats {
  stage: OpportunityStageType | string;
  count: number;
  totalAmount: number;
  probability: number;
  stageOrder?: number;
}

interface SalesFunnelProps {
  data: SalesFunnelStats[];
  onStageClick?: (stage: string) => void;
  className?: string;
}

// Stage labels
const STAGE_LABELS: Record<string, string> = {
  lead_confirmation: '线索确认',
  initial_contact: '初步接触',
  requirement_confirmation: '需求确认',
  proposal_quotation: '方案报价',
  negotiation_approval: '谈判审批',
  closed_won: '成交',
  closed_lost: '输单',
};

// Stage colors
const STAGE_COLORS: Record<string, string> = {
  lead_confirmation: '#1890ff',
  initial_contact: '#40a9ff',
  requirement_confirmation: '#69c0ff',
  proposal_quotation: '#91d5ff',
  negotiation_approval: '#bae7ff',
  closed_won: '#52c41a',
  closed_lost: '#ff4d4f',
};

export const SalesFunnel: React.FC<SalesFunnelProps> = ({ data, onStageClick, className }) => {
  // Format amount to 万元
  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0);
  };

  // Prepare chart data
  const chartData = data.map((item) => ({
    name: STAGE_LABELS[item.stage] || item.stage,
    stage: item.stage,
    count: item.count,
    amount: item.totalAmount,
    probability: item.probability,
    fill: STAGE_COLORS[item.stage] || '#1890ff',
  }));

  // Calculate totals
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const avgProbability =
    data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.probability, 0) / data.length) : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg border shadow-lg text-sm">
          <p className="font-semibold mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">商机数:</span>
              <span className="font-medium">{data.count}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">金额:</span>
              <span className="font-medium">¥{formatAmount(data.amount)}万</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">成功率:</span>
              <span className="font-medium">{data.probability}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>销售漏斗</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总商机数</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总金额</p>
                <p className="text-2xl font-bold">¥{formatAmount(totalAmount)}万</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">平均成功率</p>
                <p className="text-2xl font-bold">{avgProbability}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#1890ff"
                label={{ value: '商机数', angle: -90, position: 'insideLeft', style: { fill: '#1890ff' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#52c41a"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                label={{ value: '金额', angle: 90, position: 'insideRight', style: { fill: '#52c41a' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="商机数"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-count-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Bar
                yAxisId="right"
                dataKey="amount"
                name="金额"
                fill="#52c41a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">阶段</th>
                <th className="px-4 py-3 text-left font-medium">商机数</th>
                <th className="px-4 py-3 text-left font-medium">金额</th>
                <th className="px-4 py-3 text-left font-medium">成功率</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {chartData.map((row) => (
                <tr
                  key={row.stage}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => onStageClick?.(row.stage)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: row.fill }}
                      />
                      <span className="font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.count}</td>
                  <td className="px-4 py-3 text-primary">¥{formatAmount(row.amount)}万</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={row.probability} className="h-2 w-24" />
                      <span className="text-muted-foreground w-10">{row.probability}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;
