// 饼图组件 - 使用 Recharts 实现
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { useTranslation } from 'react-i18next';

interface PieChartProps {
  data?: any[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: any) => string;
}

const PIE_COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#597ef7', '#ffa940', '#ff7a45'];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.8} />
    </g>
  );
};

export const PieChart: React.FC<PieChartProps> = ({ data = [], height = 300, innerRadius, outerRadius, valueFormatter }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999', height }}>
        {t('components.charts.noData')}
      </div>
    );
  }

  const isIndustryData = data.some((item) => 'industry' in item);
  const isLevelData = data.some((item) => 'level' in item && 'label' in item);

  const chartData = data.map((item, index) => {
    const name = item.industry || item.level || item.name || item.stage || t('components.charts.unknown');
    const value = item.count || item.percentage || item.value || item.opportunityCount || 0;
    const percentage = item.percentage;
    return { name, value, percentage, label: item.label, fill: PIE_COLORS[index % PIE_COLORS.length] };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '13px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1890ff' }}>{data.label || data.name}</p>
          <p style={{ margin: '4px 0', color: '#666' }}>{t('components.charts.count')}：<span style={{ color: '#333', fontWeight: 500 }}>{valueFormatter ? valueFormatter(data.value) : data.value}</span></p>
          {data.percentage !== undefined && <p style={{ margin: '4px 0', color: '#666' }}>{t('components.charts.percentage')}：<span style={{ color: '#333', fontWeight: 500 }}>{data.percentage}%</span></p>}
        </div>
      );
    }
    return null;
  };

  const defaultInnerRadius = innerRadius !== undefined ? innerRadius : 0;
  const defaultOuterRadius = outerRadius !== undefined ? outerRadius : Math.min(height / 2 - 40, 120);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, percent, name }: any) => {
    const radius = ir + (or - ir) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={defaultInnerRadius} outerRadius={defaultOuterRadius} fill="#8884d8" paddingAngle={2} dataKey="value" label={renderCustomizedLabel} labelLine={false} animationDuration={1000} activeShape={renderActiveShape}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} formatter={(value, entry, index) => {
          const item = chartData[index];
          return <span style={{ color: '#666', fontSize: 13 }}>{item.label || value} {item.percentage !== undefined ? `(${item.percentage}%)` : ''}</span>;
        }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;