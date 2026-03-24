// 饼图组件 - 使用 Recharts 实现
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';

interface PieChartProps {
  data?: any[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: any) => string;
}

// 默认颜色方案
const PIE_COLORS = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 橙色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#eb2f96', // 粉红
  '#fa8c16', // 橘色
  '#2f54eb', // 深蓝
  '#597ef7', // 浅蓝
  '#ffa940', // 浅橙
  '#ff7a45', // 深橙
];

// 渲染活动扇形（用于 Tooltip 效果）
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.8}
      />
    </g>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data = [],
  height = 300,
  innerRadius,
  outerRadius,
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

  // 检测数据类型并配置
  const isIndustryData = data.some((item) => 'industry' in item);
  const isLevelData = data.some((item) => 'level' in item && 'label' in item);

  // 准备图表数据
  const chartData = data.map((item, index) => {
    const name = item.industry || item.level || item.name || item.stage || '未知';
    const value = item.count || item.percentage || item.value || item.opportunityCount || 0;
    const percentage = item.percentage;

    return {
      name,
      value,
      percentage,
      label: item.label,
      fill: PIE_COLORS[index % PIE_COLORS.length],
    };
  });

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '13px',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1890ff' }}>
            {data.label || data.name}
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            数量：<span style={{ color: '#333', fontWeight: 500 }}>
              {valueFormatter ? valueFormatter(data.value) : data.value}
            </span>
          </p>
          {data.percentage !== undefined && (
            <p style={{ margin: '4px 0', color: '#666' }}>
              占比：<span style={{ color: '#333', fontWeight: 500 }}>{data.percentage}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // 计算默认半径
  const defaultInnerRadius = innerRadius !== undefined ? innerRadius : 0; // 0 表示实心饼图
  const defaultOuterRadius = outerRadius !== undefined ? outerRadius : Math.min(height / 2 - 40, 120);

  // 自定义标签
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius: ir,
    outerRadius: or,
    percent,
    name,
  }: any) => {
    const radius = ir + (or - ir) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // 只显示占比大于 5% 的标签
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={defaultInnerRadius}
          outerRadius={defaultOuterRadius}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={renderCustomizedLabel}
          labelLine={false}
          animationDuration={1000}
          activeShape={renderActiveShape}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry, index) => {
            const item = chartData[index];
            return (
              <span style={{ color: '#666', fontSize: 13 }}>
                {item.label || value} {item.percentage !== undefined ? `(${item.percentage}%)` : ''}
              </span>
            );
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
