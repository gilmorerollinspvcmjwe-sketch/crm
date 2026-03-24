// 漏斗图组件 - 使用 Recharts 实现
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface FunnelChartProps {
  data?: any[];
  height?: number;
}

const FUNNEL_COLORS = [
  '#1890ff',
  '#40a9ff',
  '#69c0ff',
  '#91d5ff',
  '#bae7ff',
];

export const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], height = 300 }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999', height }}>
        {t('components.charts.noData')}
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => (a.stageOrder || 0) - (b.stageOrder || 0));

  const chartData = sortedData.map((item, index) => ({
    name: item.stage,
    value: item.opportunityCount,
    amount: item.totalAmount,
    winRate: item.winRate,
    fill: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '13px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1890ff' }}>{data.name}</p>
          <p style={{ margin: '4px 0', color: '#666' }}>{t('components.charts.opportunityCount')}：<span style={{ color: '#333', fontWeight: 500 }}>{data.value}</span></p>
          <p style={{ margin: '4px 0', color: '#666' }}>{t('components.charts.conversionRate')}：<span style={{ color: '#333', fontWeight: 500 }}>{data.winRate?.toFixed(1)}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" allowDecimals={false} label={{ value: t('components.charts.opportunityAmount'), position: 'insideBottom', offset: -10, style: { fill: '#999', fontSize: 12 } }} tick={{ fill: '#666', fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;