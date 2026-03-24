// 柱状图组件 - 使用 Recharts 实现
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data?: any[];
  height?: number;
  valueFormatter?: (value: any) => string;
}

// 默认颜色方案
const DEFAULT_COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
];

export const BarChart: React.FC<BarChartProps> = ({
  data = [],
  height = 300,
  valueFormatter,
}) => {
  // 如果没有数据，显示空状态
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999', height }}>
        暂无数据
      </div>
    );
  }

  // 检测数据类型并配置图表
  const isPerformanceData = data.some((item) => 'userName' in item || 'teamName' in item);
  const isMonthlyData = data.some((item) => 'month' in item);

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '13px',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1890ff' }}>{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', color: '#666' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', backgroundColor: p.color, marginRight: '8px' }} />
              {p.name}: <span style={{ color: '#333', fontWeight: 500 }}>
                {valueFormatter ? valueFormatter(p.value) : p.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 业绩数据配置
  if (isPerformanceData) {
    const nameKey = data[0].userName ? 'userName' : 'teamName';
    const chartData = data.map((item) => ({
      name: item[nameKey],
      target: item.target,
      actual: item.actual,
      rate: item.rate,
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#666', fontSize: 12 }}
            angle={-30}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="target" name="目标" fill="#1890ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="实际" fill="#52c41a" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  // 月度趋势数据配置
  if (isMonthlyData) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#666', fontSize: 12 }}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="target" name="目标" fill="#1890ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="实际" fill="#52c41a" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  // 通用柱状图 - 自动检测数值字段
  const numericKeys = Object.keys(data[0]).filter(
    (key) => typeof data[0][key] === 'number' && key !== 'id'
  );

  const nameKey = Object.keys(data[0]).find(
    (key) => typeof data[0][key] === 'string'
  ) || 'name';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey={nameKey}
          tick={{ fill: '#666', fontSize: 12 }}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickFormatter={(value) => valueFormatter ? valueFormatter(value) : value}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {numericKeys.slice(0, 6).map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
