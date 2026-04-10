'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ArrowRight, Download } from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { Button } from '@/components/ui/button'
import { DashletConfig, ChartConfig, ChartType } from '@/types/dashlet'

interface ChartDashletProps {
  config: DashletConfig
  chartConfig: ChartConfig
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
}

const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
]

const CHART_MOCK_DATA = {
  line: [
    { month: '1月', value: 85000 },
    { month: '2月', value: 92000 },
    { month: '3月', value: 108000 },
    { month: '4月', value: 125000 },
    { month: '5月', value: 142000 },
    { month: '6月', value: 158000 },
  ],
  bar: [
    { name: '李明', revenue: 450000 },
    { name: '王芳', revenue: 380000 },
    { name: '陈静', revenue: 320000 },
    { name: '张伟', revenue: 280000 },
    { name: '赵敏', revenue: 220000 },
  ],
  pie: [
    { name: '电话销售', value: 35 },
    { name: '网站转化', value: 25 },
    { name: '客户推荐', value: 20 },
    { name: '渠道合作', value: 15 },
    { name: '其他', value: 5 },
  ],
}

export function ChartDashlet({
  config,
  chartConfig,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
}: ChartDashletProps) {
  const data = chartConfig.data?.length ? chartConfig.data : CHART_MOCK_DATA[config.config?.chartType as keyof typeof CHART_MOCK_DATA] || CHART_MOCK_DATA.line
  const colors = chartConfig.colors || CHART_COLORS

  const renderChart = () => {
    const tooltipStyle = {
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 20, left: 0, bottom: 5 },
    }

    const axisProps = {
      className: 'text-xs',
    }

    switch (chartConfig.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={config.gridPosition.h * 100}>
            <LineChart {...commonProps}>
              {chartConfig.showGrid !== false && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey={chartConfig.xKey || 'month'} {...axisProps} />
              <YAxis {...axisProps} />
              {chartConfig.showTooltip !== false && (
                <Tooltip contentStyle={tooltipStyle} />
              )}
              {chartConfig.showLegend !== false && <Legend />}
              {chartConfig.yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={config.gridPosition.h * 100}>
            <BarChart {...commonProps}>
              {chartConfig.showGrid !== false && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey={chartConfig.xKey || 'name'} {...axisProps} />
              <YAxis {...axisProps} />
              {chartConfig.showTooltip !== false && (
                <Tooltip contentStyle={tooltipStyle} />
              )}
              {chartConfig.showLegend !== false && <Legend />}
              {chartConfig.yKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={config.gridPosition.h * 100}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={config.gridPosition.w > 3 ? 60 : 30}
                outerRadius={config.gridPosition.w > 3 ? 100 : 60}
                paddingAngle={2}
                dataKey={chartConfig.yKeys[0] || 'value'}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {chartConfig.showTooltip !== false && <Tooltip contentStyle={tooltipStyle} />}
            </PieChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={config.gridPosition.h * 100}>
            <AreaChart {...commonProps}>
              {chartConfig.showGrid !== false && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey={chartConfig.xKey || 'month'} {...axisProps} />
              <YAxis {...axisProps} />
              {chartConfig.showTooltip !== false && (
                <Tooltip contentStyle={tooltipStyle} />
              )}
              {chartConfig.showLegend !== false && <Legend />}
              {chartConfig.yKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            不支持的图表类型
          </div>
        )
    }
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      {renderChart()}
    </DashletContainer>
  )
}

export default ChartDashlet
