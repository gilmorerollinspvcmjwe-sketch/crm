// 折线图组件 - 使用 Recharts 实现
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslation } from 'react-i18next';

interface LineChartProps {
  data?: any[];
  dataKeys?: any[];
  height?: number;
  yAxisFormatter?: (value: any) => string;
}

const LINE_COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

export const LineChart: React.FC<LineChartProps> = ({ data = [], dataKeys, height = 300, yAxisFormatter }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#999', height }}>{t('components.charts.noData')}</div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '13px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1890ff' }}>{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', color: '#666' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: p.color, marginRight: '8px' }} />
              {p.name}: <span style={{ color: '#333', fontWeight: 500 }}>{yAxisFormatter ? yAxisFormatter(p.value) : p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isMonthlyTrend = data.some((item) => 'month' in item && 'target' in item && 'actual' in item);
  const isGrowthData = data.some((item) => 'month' in item && 'newCustomers' in item);

  if (dataKeys && dataKeys.length > 0) {
    const nameKey = dataKeys.find((k) => typeof k === 'string' && k !== 'id') || 'name';
    const valueKeys = dataKeys.filter((k) => typeof k === 'string' && k !== nameKey && k !== 'id');
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={nameKey} tick={{ fill: '#666', fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
          <YAxis tickFormatter={(value) => yAxisFormatter ? yAxisFormatter(value) : value} tick={{ fill: '#666', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {valueKeys.map((key: string, index: number) => (
            <Line key={key} type="monotone" dataKey={key} name={key} stroke={LINE_COLORS[index % LINE_COLORS.length]} strokeWidth={2} dot={{ r: 4, fill: LINE_COLORS[index % LINE_COLORS.length], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  if (isMonthlyTrend) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
          <YAxis tickFormatter={(value) => yAxisFormatter ? yAxisFormatter(value) : value} tick={{ fill: '#666', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="target" name={t('components.charts.target')} stroke="#1890ff" strokeWidth={2} dot={{ r: 4, fill: '#1890ff', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
          <Line type="monotone" dataKey="actual" name={t('components.charts.actual')} stroke="#52c41a" strokeWidth={2} dot={{ r: 4, fill: '#52c41a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
          <ReferenceLine y={data.reduce((sum, item) => sum + (item.actual || 0), 0) / data.length} stroke="#faad14" strokeDasharray="3 3" label={{ value: t('components.charts.average'), fill: '#faad14', fontSize: 12 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  if (isGrowthData) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
          <YAxis yAxisId="left" tickFormatter={(value) => yAxisFormatter ? yAxisFormatter(value) : value} tick={{ fill: '#666', fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} tick={{ fill: '#666', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="newCustomers" name={t('components.charts.newCustomers')} stroke="#1890ff" strokeWidth={2} dot={{ r: 4, fill: '#1890ff', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
          <Line yAxisId="left" type="monotone" dataKey="totalCustomers" name={t('components.charts.totalCustomers')} stroke="#722ed1" strokeWidth={2} dot={{ r: 4, fill: '#722ed1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
          <Line yAxisId="right" type="monotone" dataKey="growthRate" name={t('components.charts.growthRate')} stroke="#faad14" strokeWidth={2} dot={{ r: 4, fill: '#faad14', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  const numericKeys = Object.keys(data[0]).filter((key) => typeof data[0][key] === 'number' && key !== 'id');
  const nameKey = Object.keys(data[0]).find((key) => typeof data[0][key] === 'string') || 'name';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={nameKey} tick={{ fill: '#666', fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
        <YAxis tickFormatter={(value) => yAxisFormatter ? yAxisFormatter(value) : value} tick={{ fill: '#666', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {numericKeys.slice(0, 6).map((key, index) => (
          <Line key={key} type="monotone" dataKey={key} name={key} stroke={LINE_COLORS[index % LINE_COLORS.length]} strokeWidth={2} dot={{ r: 4, fill: LINE_COLORS[index % LINE_COLORS.length], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={1000} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;