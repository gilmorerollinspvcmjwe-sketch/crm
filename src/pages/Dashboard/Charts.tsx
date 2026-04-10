/**
 * 数据图表组件 (Charts)
 * 功能：使用 recharts 库、折线图/柱状图/饼图、数据源接口
 */

import * as React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type ChartType = 'line' | 'bar' | 'area' | 'pie'
export type TimeRange = 'week' | 'month' | 'quarter' | 'year'

export interface ChartDataPoint {
  [key: string]: string | number | null
}

export interface ChartSeries {
  name: string
  dataKey: string
  color: string
}

export interface ChartConfig {
  type: ChartType
  title: string
  data: ChartDataPoint[]
  series: ChartSeries[]
  xKey: string
  showGrid?: boolean
  showLegend?: boolean
  height?: number
}

interface ChartsProps {
  configs?: ChartConfig[]
  activeConfigIndex?: number
  onConfigChange?: (index: number) => void
  timeRange?: TimeRange
  onTimeRangeChange?: (range: TimeRange) => void
  className?: string
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']

const defaultConfigs: ChartConfig[] = [
  {
    type: 'area',
    title: '营收趋势',
    data: [
      { month: '1 月', revenue: 85000, target: 90000 },
      { month: '2 月', revenue: 92000, target: 90000 },
      { month: '3 月', revenue: 108000, target: 100000 },
      { month: '4 月', revenue: 125000, target: 120000 },
      { month: '5 月', revenue: 142000, target: 140000 },
      { month: '6 月', revenue: 158000, target: 160000 },
    ],
    series: [
      { name: '实际营收', dataKey: 'revenue', color: '#3b82f6' },
      { name: '目标', dataKey: 'target', color: '#f59e0b' },
    ],
    xKey: 'month',
    showGrid: true,
    showLegend: true,
    height: 300,
  },
  {
    type: 'bar',
    title: '销售排行',
    data: [
      { name: '李明', revenue: 450000, deals: 15 },
      { name: '王芳', revenue: 380000, deals: 12 },
      { name: '陈静', revenue: 320000, deals: 10 },
      { name: '张伟', revenue: 280000, deals: 8 },
      { name: '赵敏', revenue: 220000, deals: 6 },
    ],
    series: [
      { name: '营收', dataKey: 'revenue', color: '#3b82f6' },
    ],
    xKey: 'name',
    showGrid: true,
    showLegend: false,
    height: 300,
  },
  {
    type: 'pie',
    title: '销售来源',
    data: [
      { name: '电话销售', value: 35 },
      { name: '网站转化', value: 25 },
      { name: '客户推荐', value: 20 },
      { name: '渠道合作', value: 15 },
      { name: '其他', value: 5 },
    ],
    series: [
      { name: '占比', dataKey: 'value', color: '' },
    ],
    xKey: 'name',
    showGrid: false,
    showLegend: true,
    height: 300,
  },
  {
    type: 'line',
    title: '线索趋势',
    data: [
      { month: '1 月', leads: 380, converted: 68 },
      { month: '2 月', leads: 420, converted: 78 },
      { month: '3 月', leads: 450, converted: 85 },
      { month: '4 月', leads: 480, converted: 92 },
      { month: '5 月', leads: 520, converted: 105 },
      { month: '6 月', leads: 550, converted: 115 },
    ],
    series: [
      { name: '线索数', dataKey: 'leads', color: '#3b82f6' },
      { name: '转化数', dataKey: 'converted', color: '#10b981' },
    ],
    xKey: 'month',
    showGrid: true,
    showLegend: true,
    height: 300,
  },
]

export function Charts({
  configs = defaultConfigs,
  activeConfigIndex = 0,
  onConfigChange,
  timeRange = 'month',
  onTimeRangeChange,
  className,
}: ChartsProps) {
  const [selectedChart, setSelectedChart] = React.useState(activeConfigIndex)
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>(timeRange)

  const handleChartChange = (value: string) => {
    const index = parseInt(value)
    setSelectedChart(index)
    onConfigChange?.(index)
  }

  const handleRangeChange = (value: string) => {
    const range = value as TimeRange
    setSelectedRange(range)
    onTimeRangeChange?.(range)
  }

  const renderChart = (config: ChartConfig) => {
    const { type, data, series, xKey, showGrid, showLegend, height } = config

    const commonProps = {
      width: '100%' as const,
      height: height || 300,
      data,
    }

    const gridElement = showGrid ? <CartesianGrid strokeDasharray="3 3" className="stroke-muted" /> : null
    const legendElement = showLegend ? <Legend /> : null

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              {gridElement}
              <XAxis dataKey={xKey} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              {legendElement}
              {series.map((s, i) => (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || defaultColors[i % defaultColors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              {gridElement}
              <XAxis dataKey={xKey} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              {legendElement}
              {series.map((s, i) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color || defaultColors[i % defaultColors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              {gridElement}
              <XAxis dataKey={xKey} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              {legendElement}
              {series.map((s, i) => (
                <Area
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || defaultColors[i % defaultColors.length]}
                  fill={s.color || defaultColors[i % defaultColors.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey={series[0].dataKey}
                nameKey={xKey}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={defaultColors[index % defaultColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              {legendElement}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  const activeConfig = configs[selectedChart]

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">{activeConfig?.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedChart.toString()} onValueChange={handleChartChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择图表" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config, index) => (
                <SelectItem key={config.title} value={index.toString()}>
                  {config.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs value={selectedRange} onValueChange={handleRangeChange}>
            <TabsList className="grid grid-cols-4 w-[280px]">
              <TabsTrigger value="week">周</TabsTrigger>
              <TabsTrigger value="month">月</TabsTrigger>
              <TabsTrigger value="quarter">季</TabsTrigger>
              <TabsTrigger value="year">年</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {activeConfig && renderChart(activeConfig)}
      </CardContent>
    </Card>
  )
}

export default Charts
