/**
 * FunnelChart Component
 * 漏斗图组件 - 用于报表页面
 * Adapted for Project A (shadcn/ui + Tailwind)
 */
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { SalesFunnelStats } from '@/components/Charts/SalesFunnel';

interface FunnelChartProps {
  data?: SalesFunnelStats[];
  height?: number;
}

const FUNNEL_COLORS = [
  '#1890ff',
  '#40a9ff',
  '#69c0ff',
  '#91d5ff',
  '#bae7ff',
  '#52c41a',
  '#ff4d4f',
];

const STAGE_LABELS: Record<string, string> = {
  lead_confirmation: '线索确认',
  initial_contact: '初步接触',
  requirement_confirmation: '需求确认',
  proposal_quotation: '方案报价',
  negotiation_approval: '谈判审批',
  closed_won: '成交',
  closed_lost: '输单',
};

export const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: '#999',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        暂无数据
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0));

  const chartData = sortedData.map((item, index) => ({
    name: STAGE_LABELS[item.stage] || item.stage,
    value: item.count,
    amount: item.totalAmount,
    winRate: item.probability,
    fill: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg border shadow-lg text-sm">
          <p className="font-semibold mb-2 text-primary">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">商机数:</span>
              <span className="font-medium">{data.value}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">金额:</span>
              <span className="font-medium">¥{(data.amount / 10000).toFixed(1)}万</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">转化率:</span>
              <span className="font-medium">{data.winRate?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          type="number"
          allowDecimals={false}
          label={{
            value: '商机数量',
            position: 'insideBottom',
            offset: -10,
            style: { fill: '#999', fontSize: 12 },
          }}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fill: '#666', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;
