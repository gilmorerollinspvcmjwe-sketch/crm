/**
 * 目标进度组件 (GoalProgress)
 * 功能：目标名称、进度条、完成百分比
 */

import * as React from 'react'
import { Target, TrendingUp, TrendingDown, Award, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface GoalItem {
  id: string
  name: string
  description?: string
  current: number
  target: number
  unit: string
  percentage: number
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  deadline?: string
  status: 'on-track' | 'at-risk' | 'behind' | 'completed'
  category: 'revenue' | 'customer' | 'activity' | 'conversion'
}

interface GoalProgressProps {
  goals?: GoalItem[]
  onGoalClick?: (goal: GoalItem) => void
  maxItems?: number
  className?: string
}

const statusConfig = {
  'on-track': {
    color: 'text-green-500 bg-green-500/10',
    label: '正常',
    icon: TrendingUp,
  },
  'at-risk': {
    color: 'text-yellow-500 bg-yellow-500/10',
    label: '风险',
    icon: Clock,
  },
  behind: {
    color: 'text-red-500 bg-red-500/10',
    label: '滞后',
    icon: TrendingDown,
  },
  completed: {
    color: 'text-green-500 bg-green-500/10',
    label: '完成',
    icon: Award,
  },
}

const categoryConfig = {
  revenue: { label: '营收', color: 'bg-blue-500' },
  customer: { label: '客户', color: 'bg-green-500' },
  activity: { label: '活动', color: 'bg-purple-500' },
  conversion: { label: '转化', color: 'bg-orange-500' },
}

const defaultGoals: GoalItem[] = [
  {
    id: '1',
    name: 'Q2 营收目标',
    description: '第二季度累计营收',
    current: 3250000,
    target: 5000000,
    unit: '¥',
    percentage: 65,
    trend: 'up',
    trendValue: 12.5,
    deadline: '2026-06-30',
    status: 'on-track',
    category: 'revenue',
  },
  {
    id: '2',
    name: '新增客户数',
    description: '季度新增客户目标',
    current: 85,
    target: 100,
    unit: '个',
    percentage: 85,
    trend: 'up',
    trendValue: 8.3,
    deadline: '2026-06-30',
    status: 'on-track',
    category: 'customer',
  },
  {
    id: '3',
    name: '商机转化率',
    description: '线索到商机转化率',
    current: 28,
    target: 35,
    unit: '%',
    percentage: 80,
    trend: 'stable',
    trendValue: 0,
    deadline: '2026-06-30',
    status: 'at-risk',
    category: 'conversion',
  },
  {
    id: '4',
    name: '活动完成数',
    description: '客户跟进活动完成',
    current: 245,
    target: 300,
    unit: '个',
    percentage: 81.7,
    trend: 'down',
    trendValue: -5.2,
    deadline: '2026-06-30',
    status: 'behind',
    category: 'activity',
  },
  {
    id: '5',
    name: '回款金额',
    description: '季度累计回款',
    current: 2800000,
    target: 2800000,
    unit: '¥',
    percentage: 100,
    trend: 'up',
    trendValue: 15.8,
    deadline: '2026-06-30',
    status: 'completed',
    category: 'revenue',
  },
  {
    id: '6',
    name: '客户满意度',
    description: 'CSAT 平均评分',
    current: 4.6,
    target: 4.5,
    unit: '分',
    percentage: 100,
    trend: 'up',
    trendValue: 2.2,
    deadline: '2026-06-30',
    status: 'completed',
    category: 'customer',
  },
]

export function GoalProgress({
  goals = defaultGoals,
  onGoalClick,
  maxItems = 10,
  className,
}: GoalProgressProps) {
  const formatValue = (goal: GoalItem) => {
    if (goal.unit === '¥') {
      const value = goal.current >= 10000 ? `${(goal.current / 10000).toFixed(1)}万` : goal.current
      return `¥${value}`
    }
    return `${goal.current}${goal.unit}`
  }

  const formatTarget = (goal: GoalItem) => {
    if (goal.unit === '¥') {
      const value = goal.target >= 10000 ? `${(goal.target / 10000).toFixed(1)}万` : goal.target
      return `¥${value}`
    }
    return `${goal.target}${goal.unit}`
  }

  const getProgressColor = (percentage: number, status: GoalItem['status']) => {
    if (status === 'completed') return 'bg-green-500'
    if (percentage >= 80) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">目标进度</CardTitle>
        </div>
        <Badge variant="outline">
          {goals.filter((g) => g.status === 'completed').length}/{goals.length} 完成
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] px-4">
          <div className="space-y-4 py-2">
            {goals.slice(0, maxItems).map((goal) => {
              const status = statusConfig[goal.status]
              const StatusIcon = status.icon
              const category = categoryConfig[goal.category]

              return (
                <div
                  key={goal.id}
                  className="cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-3 rounded-lg transition-colors"
                  onClick={() => onGoalClick?.(goal)}
                >
                  {/* 标题和状态 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${category.color}`} />
                      <div>
                        <p className="text-sm font-medium">{goal.name}</p>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="text-xs">{status.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {goal.trendValue !== undefined && goal.trend && (
                            <p>
                              趋势：{goal.trend === 'up' ? '+' : ''}
                              {goal.trendValue}%
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-2">
                    <Progress
                      value={goal.percentage}
                      className={`h-2 ${getProgressColor(goal.percentage, goal.status)}`}
                    />
                  </div>

                  {/* 数值和截止日期 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">{formatValue(goal)}</span>
                      {' / '}
                      {formatTarget(goal)}
                      <span className="ml-2 font-medium text-foreground">
                        {goal.percentage.toFixed(1)}%
                      </span>
                    </div>
                    {goal.deadline && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>截止：{formatDate(goal.deadline)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {goals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无目标设置</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default GoalProgress
