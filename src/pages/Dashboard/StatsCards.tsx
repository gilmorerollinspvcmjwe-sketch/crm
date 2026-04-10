/**
 * 数据概览卡片组件 (StatsCards)
 * 功能：关键数据指标卡片、图标 + 数字 + 趋势、今日/本周/本月切换
 */

import * as React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  Briefcase,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface StatMetric {
  id: string
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  trend?: number
  trendDirection?: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: 'primary' | 'success' | 'warning' | 'danger'
  tooltip?: string
}

export type TimeRange = 'today' | 'week' | 'month'

interface StatsCardsProps {
  metrics?: StatMetric[]
  timeRange?: TimeRange
  onTimeRangeChange?: (range: TimeRange) => void
  className?: string
}

const colorConfig = {
  primary: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    icon: 'text-blue-500',
  },
  success: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    icon: 'text-green-500',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    icon: 'text-yellow-500',
  },
  danger: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    icon: 'text-red-500',
  },
}

const defaultMetrics: StatMetric[] = [
  {
    id: 'leads',
    label: '新增线索',
    value: 156,
    trend: 12.5,
    trendDirection: 'up',
    icon: Users,
    color: 'primary',
    tooltip: '今日新增线索数量',
  },
  {
    id: 'revenue',
    label: '成交金额',
    value: '125,000',
    prefix: '¥',
    trend: 8.2,
    trendDirection: 'up',
    icon: DollarSign,
    color: 'success',
    tooltip: '本月累计成交金额',
  },
  {
    id: 'opportunities',
    label: '进行中商机',
    value: 42,
    trend: -2.3,
    trendDirection: 'down',
    icon: Target,
    color: 'warning',
    tooltip: '当前进行中的商机数量',
  },
  {
    id: 'activities',
    label: '活动完成',
    value: 28,
    trend: 5.7,
    trendDirection: 'up',
    icon: Activity,
    color: 'primary',
    tooltip: '本周完成的活动数量',
  },
]

export function StatsCards({
  metrics = defaultMetrics,
  timeRange = 'today',
  onTimeRangeChange,
  className,
}: StatsCardsProps) {
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>(timeRange)

  const handleRangeChange = (value: string) => {
    const range = value as TimeRange
    setSelectedRange(range)
    onTimeRangeChange?.(range)
  }

  const formatValue = (metric: StatMetric) => {
    let value = metric.value.toString()
    if (metric.prefix) value = metric.prefix + value
    if (metric.suffix) value = value + metric.suffix
    return value
  }

  const getTrendIcon = (metric: StatMetric) => {
    if (metric.trend === undefined || metric.trendDirection === undefined) return null

    const isPositive = metric.trendDirection === 'up'
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    return (
      <div
        className={`flex items-center gap-1 text-xs ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        <TrendIcon className="h-3 w-3" />
        <span>{Math.abs(metric.trend)}%</span>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* 时间范围切换 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">数据概览</h3>
        <Tabs value={selectedRange} onValueChange={handleRangeChange}>
          <TabsList className="grid grid-cols-3 w-[240px]">
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="week">本周</TabsTrigger>
            <TabsTrigger value="month">本月</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 指标卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const colors = colorConfig[metric.color]

          return (
            <Tooltip key={metric.id}>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.icon}`} />
                      </div>
                      {getTrendIcon(metric)}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{formatValue(metric)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              {metric.tooltip && (
                <TooltipContent>
                  <p>{metric.tooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export default StatsCards
